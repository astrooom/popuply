import "server-only"

import pino from "pino"
import pretty from "pino-pretty"

// import { runIfFn } from "@ultra/utils";

import { IS_DEVELOPMENT, IS_PRODUCTION } from "@/lib/constants"

const stream = pretty({
  colorize: !!IS_DEVELOPMENT,
  translateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
})

export const serverLogger = pino({ level: IS_PRODUCTION ? "info" : "debug" }, stream)

// Define a type for your details object
type LogDetails = {
  component: string
  path: string
  function: string
  serializedError?: string
} & { [key: string]: unknown }

type WithLoggingOptions<T> = {
  defaultReturnValue?: T | (() => T)
}

// export const withLogging = async <T>(
//   asyncFunction: AnyFunction<void, Promise<T>>,
//   details: LogDetails,
//   options?: WithLoggingOptions<T>,
// ) => {
//   try {
//     return await asyncFunction();
//   } catch (err) {
//     const error = err as NextError;

//     // Construct log contents based on the error and details
//     const logContents = {
//       type: details?.function || asyncFunction?.name || "Unknown Function",
//       details: {
//         ...details,
//         digest: error?.digest,
//         message: getErrorMessage(error) ?? "Unknown error",
//         serializedError: error
//           ? JSON.stringify(error, Object.getOwnPropertyNames(error))
//           : "Error could not be stringified",
//       },
//     };

//     // Log as warning or error based on the presence of a default return value
//     if (options?.defaultReturnValue !== undefined) {
//       serverLogger.warn({ ...logContents, details: { ...logContents.details, ...options } });
//       return runIfFn(options.defaultReturnValue);
//     }

//     serverLogger.error(logContents);

//     throw error;
//   }
// };
