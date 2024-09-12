import { z } from "zod"

export const domainSchema = z
  .string()
  .min(1, { message: "Please enter a domain" })
  .max(253)
  .regex(
    /^(?!:\/\/)(?!www\.)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}$/,
    "Invalid domain format. Please enter a valid domain (e.g., example.com).",
  )
