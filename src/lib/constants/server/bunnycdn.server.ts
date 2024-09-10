import "server-only";

export const BUNNYCDN_STORAGE_URL = "https://storage.bunnycdn.com"
export const BUNNYCDN_ZONE_API_KEY = process.env.BUNNYCDN_ZONE_API_KEY; // Used for image uploads to the popuply zone
export const BUNNYCDN_ACCOUNT_API_KEY = process.env.BUNNYCDN_ACCOUNT_API_KEY; // Used for cache purges etc. account-wide. Is used to purge image URLS on upload here.
export const BUNNYCDN_API_URL = "https://api.bunny.net"