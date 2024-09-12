export const IS_DEVELOPMENT = process.env.NODE_ENV === "development"

export const IS_PRODUCTION = process.env.NODE_ENV === "production"

export const ENV_NAME = IS_DEVELOPMENT ? "development" : "production"

export const HOST_NAME = process.env.NEXT_PUBLIC_HOST_NAME
