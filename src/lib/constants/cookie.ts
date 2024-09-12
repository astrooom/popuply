import { IS_DEVELOPMENT } from "./global"

export const NEXT_AUTH_SESSION_TOKEN = IS_DEVELOPMENT ? "next-auth.session-token" : "__Secure-next-auth.session-token"
