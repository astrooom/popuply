import nodemailer from "nodemailer"
import { render } from "@react-email/components"
import { serverLogger } from "@/lib/utils/server/logging"

const smtpSettings = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
}

export const transporter = nodemailer.createTransport(smtpSettings)

type SendEmailProps = {
  email: string
  subject: string
  content: React.ReactElement
  text?: string
}

export async function sendEmail({ email, subject, content, text }: SendEmailProps) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    html: render(content),
    text,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    serverLogger.info("Email sent", { info })
  } catch (error) {
    serverLogger.error("Error sending email", { error })
    throw error
  }
}
