import "server-only"

import Stripe from "stripe"
import { HOST_NAME, IS_PRODUCTION } from "../constants"
import { PRODUCTS } from "../constants/checkout"
import { serverLogger } from "../utils/server/logging"
import { v4 as uuidv4 } from "uuid"
import { db, eq } from "@/db"
import { orders, users } from "@/db/schema"
import { generateEmailVerificationCode } from "../auth/email"
import { sendVerificationCodeEmail } from "../emails/verificationCodeEmail"
import { upsertUser } from "./users"
import { STRIPE_SECRET_KEY } from "../constants/server/checkout.server"
// import { users, subscriptions } from './your-schema';

if (!STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing. Please set the environment variable.")
}

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
})

export const createCheckoutSession = async ({ pricingId }: { pricingId: string }) => {
  const orderId = uuidv4()

  // Make sure pricingId exists
  const isValidpricingId = PRODUCTS.some((product) => product.pricingId === pricingId)
  if (!isValidpricingId) {
    throw new Error("Invalid pricingId")
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: pricingId,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${HOST_NAME}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${HOST_NAME}/payment-cancelled`,
    client_reference_id: orderId,
  })

  // Insert into orders table
  await db.insert(orders).values({
    id: orderId,
    status: "created",
    pricingId,
    sessionId: session.id,
  })

  return session
}

export const handleWebhook = async (event: Stripe.Event) => {
  serverLogger.info({
    type: "STRIPE",
    msg: "Handling webhook",
    details: {
      event: {
        type: event.type,
        id: event.id,
      },
    },
  })
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object
      await fulfillOrder(session)
      break
  }
}

async function fulfillOrder(session: Stripe.Checkout.Session) {
  serverLogger.info({
    type: "STRIPE",
    msg: "Fulfilling order",
    details: {
      session: {
        email: session.customer_details?.email,
        payment_intend: session.payment_intent,
        id: session.id,
        order_id: session.client_reference_id,
        success_url: session.success_url,
        cancel_url: session.cancel_url,
        status: session.payment_status,
        livemode: session.livemode,
        custom_fields: session.custom_fields,
        total_details: session.total_details,
      },
    },
  })

  if (!session.client_reference_id) {
    serverLogger.error({
      type: "STRIPE",
      msg: "Fulfilling order error",
      details: { sessionId: session.id, error: "Order ID not found in Stripe webhook event" },
    })
    throw new Error("Order ID not found in Stripe session")
  }

  let email = session.customer_details?.email

  if (!email) {
    throw new Error("Email not found")
  }

  // Create unverified user based on this email.
  // Ensure email is lowercased
  email = email.toLowerCase()
  const userId = await upsertUser({ email })

  //await setSession(userId); Cannot set the session here since this function is ran from Stripe hitting the webhook. Need to set it later on.

  const { line_items } = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items"],
  })

  // Find product and set allowed sites on the user.
  const pricingId = line_items?.data?.[0].price?.id

  if (!pricingId) {
    throw new Error("Pricing ID not found")
  }

  // Find the product that matches the pricingId, and set allowed sites
  const matchedProduct = PRODUCTS.find((product) => product.pricingId === pricingId)

  if (!matchedProduct) {
    throw new Error("No matching product found for the given pricing ID")
  }

  const allowedSites = matchedProduct.sites

  // Generate and send verification code for the user.
  const verificationCode = await generateEmailVerificationCode(userId, email)

  if (IS_PRODUCTION) {
    // generateEmailVerificationCode logs the code to the console in DEVELOPMENT
    serverLogger.info({ type: "STRIPE/AUTH", msg: "Sending verification code", details: { userId, email, verificationCode } })
    try {
      await sendVerificationCodeEmail({ email, token: verificationCode })
    } catch (error) {
      serverLogger.error({
        type: "STRIPE/AUTH",
        msg: "Error sending verification code during order fulfillment. User will need to re-send the code.",
        details: { userId, email, error },
      })
    }
  }

  // Run in singular transaction
  await db.transaction(async (tx) => {
    await tx.update(users).set({ allowedSites }).where(eq(users.id, userId))

    await tx.update(orders).set({ status: "paid", userId }).where(eq(orders.id, session.client_reference_id!))
  })

  serverLogger.info({
    type: "STRIPE/AUTH",
    msg: "User updated with allowed sites. User added to order.",
    details: { userId, allowedSites, orderId: session.client_reference_id },
  })

  return session.id
}
