export const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

export const PRODUCTS = [
  { id: "1site", name: "1 Site", price: 10, sites: 1, pricingId: process.env.PRICEID_1SITE },
  { id: "5sites", name: "5 Sites", price: 20, sites: 5, pricingId: process.env.PRICEID_5SITE },
  { id: "10sites", name: "10 Sites", price: 30, sites: 10, pricingId: process.env.PRICEID_10SITE },
]
