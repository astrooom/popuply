import { isArray, isPlainObject, objectKeys } from "@/lib/utils/mutation";

import type { SafeActionResult, ValidationErrors } from "next-safe-action";
import type { z } from "zod";

export class RateLimitError extends Error {
  constructor() {
    super("That was a little too quick. Please try again in a few seconds.");
    this.name = "RateLimitError";
  }
}

export class ErrorBase<T extends string> extends Error {
  name: T;
  message: string;
  cause: unknown;

  constructor({ name, message, cause }: { name: T; message: string; cause?: unknown }) {
    super();
    this.name = name;
    this.message = message;
    this.cause = cause;
  }
}

export class AlreadyRegisteredError extends ErrorBase<"USER_ALREADY_REGISTERED"> {
  constructor(message: string) {
    super({ name: "USER_ALREADY_REGISTERED", message });
  }
}

/**
 * Use this error to wrap any error that occurs during a server action in order to surface the message to the client.
 */
export class ServerActionError extends ErrorBase<"SERVER_ACTION_ERROR"> {
  constructor(message: string, cause?: unknown) {
    super({ name: "SERVER_ACTION_ERROR", message, cause });
  }
}

/**
 * Use this error to specifically handle the case where a user has hit the trial IP rate limit.
 */
export class TrialIpRateLimitError extends ErrorBase<"TRIAL_IP_RATE_LIMIT_ERROR"> {
  constructor(message: string, cause?: unknown) {
    super({ name: "TRIAL_IP_RATE_LIMIT_ERROR", message, cause });
  }
}

/**
 * Checks if the given value is an Error object.
 * @param error - The value to check.
 * @returns True if the value is an Error object, false otherwise.
 */
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

type ErrorWithMessage = {
  message: string;
};

export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return isError(error) && typeof error.message === "string";
}

/**
 * Converts any value to an ErrorWithMessage object.
 * @param maybeError - The value to convert.
 * @returns An ErrorWithMessage object.
 */
function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;
  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // Fallback in case there's an error stringifying the `maybeError` (circular references, for instance)
    return new Error(String(maybeError));
  }
}

// Graciously stolen from: https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
export function getErrorMessage(error: unknown) {
  const { message } = toErrorWithMessage(error);
  return message;
}

type ErrorWithDigest = Error & {
  digest: string;
};

/**
 * Checks if the given error has a 'digest' property.
 * @param error - The error to check.
 * @returns True if the error has a 'digest' property, false otherwise.
 */
export function isErrorWithDigest(error: unknown): error is ErrorWithDigest {
  return isError(error) && "digest" in error && typeof (error as ErrorWithDigest).digest === "string";
}

/**
 * Extracts the digest from an error if it exists.
 * @param error - The error to extract the digest from.
 * @returns The digest string if it exists, null otherwise.
 */
export function getErrorDigest(error: unknown) {
  if (isErrorWithDigest(error)) return error.digest;
  return null;
}

/**
 * Parses a server error and returns a structured error object.
 * @param error - The error to parse.
 * @returns An object containing the error message and digest (if available).
 */
export function parseServerError(error: unknown) {
  return isErrorWithDigest(error)
    ? { message: error.message, digest: error.digest }
    : { message: getErrorMessage(error), digest: null };
}

/**
 * Generates a pretty string representation of validation errors.
 * @param validationErrors - The validation errors object.
 * @param parentPath - The parent path for nested errors (used recursively).
 * @returns A formatted string of validation errors.
 */
export function getPrettyValidationError<Schema extends z.ZodTypeAny>(
  validationErrors: ValidationErrors<Schema>,
  parentPath: string = "",
) {
  const errors: string[] = [];
  const errorKeys = objectKeys(validationErrors);
  for (const key of errorKeys) {
    const value = validationErrors[key];
    if (key === "_errors" && isArray(value)) {
      const currentPath = parentPath ? `${parentPath}.${String(key)}` : String(key);
      errors.push(`${currentPath}: ${value.join(" ")}`);
    } else if (isPlainObject(value)) {
      const currentPath = parentPath ? `${parentPath}.${String(key)}` : String(key);
      getPrettyValidationError(value as ValidationErrors<Schema>, currentPath);
    }
  }
  return errors.join("\n");
}

type SuccessResult<Data> = {
  data: Data;
  serverError: undefined;
  validationErrors: undefined;
};

/**
 * Checks if the result of a safe action is a success result.
 * @param result - The result to check.
 * @returns True if the result is a success result, false otherwise.
 */
export function isSuccessActionResult<
  ServerError,
  Schema extends z.ZodTypeAny | undefined,
  BAS extends readonly z.ZodTypeAny[],
  Data,
>(result?: SafeActionResult<ServerError, Schema, BAS, ValidationErrors<Schema>, Data>): result is SuccessResult<Data> {
  // Returns true if "serverError" and "validationErrors" keys are not found in the result object and "data" key is found.
  return !!result && !("serverError" in result || "validationErrors" in result) && "data" in result;
}

type ErrorResult<ServerError, Schema extends z.ZodTypeAny | undefined> = {
  data: undefined;
  serverError?: ServerError;
  validationErrors?: ValidationErrors<Schema>;
};

/**
 * Checks if the result of a safe action is an error result.
 * @param result - The result to check.
 * @returns True if the result is an error result, false otherwise.
 */
export function isErrorActionResult<
  ServerError,
  Schema extends z.ZodTypeAny | undefined,
  BAS extends readonly z.ZodTypeAny[],
  Data,
>(
  result?: SafeActionResult<ServerError, Schema, BAS, ValidationErrors<Schema>, Data>,
): result is ErrorResult<ServerError, Schema> {
  return result?.serverError !== undefined || result?.validationErrors !== undefined;
}

/**
 * Gets a summary of the error from a server action response.
 * @param serverActionResponse - The server action response.
 * @param fallback - The fallback error message if no specific error is found.
 * @returns A string summarizing the error.
 */
export function getActionErrorSummary<
  ServerError extends string,
  Schema extends z.ZodTypeAny,
  BAS extends readonly z.ZodTypeAny[],
  CVE extends ValidationErrors<Schema>,
  CBAVE,
  Data,
>(
  serverActionResponse: SafeActionResult<ServerError, Schema, BAS, CVE, CBAVE, Data>,
  fallback = "An unexpected error occurred.",
) {
  if (serverActionResponse.serverError) return serverActionResponse.serverError;
  if (serverActionResponse.validationErrors) return getPrettyValidationError(serverActionResponse.validationErrors);
  return fallback;
}

/** REDIRECT ERRORS */
enum RedirectType {
  push = "push",
  replace = "replace",
}

enum RedirectStatusCode {
  SeeOther = 303,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
}

const REDIRECT_ERROR_CODE = "NEXT_REDIRECT";

export type RedirectError<U extends string> = Error & {
  digest: `${typeof REDIRECT_ERROR_CODE};${RedirectType};${U};${RedirectStatusCode};`;
};

/**
 * Checks an error to determine if it's an error generated by the `redirect(url)` helper.
 * @param error the error that may reference a redirect error
 * @returns true if the error is a redirect error
 */
export function isRedirectError<U extends string>(error: unknown): error is RedirectError<U> {
  if (typeof error !== "object" || error === null || !("digest" in error) || typeof error.digest !== "string")
    return false;
  const [errorCode, type, destination, status] = error.digest.split(";", 4);
  const statusCode = Number(status);
  return (
    errorCode === REDIRECT_ERROR_CODE &&
    (type === "replace" || type === "push") &&
    typeof destination === "string" &&
    !isNaN(statusCode) &&
    statusCode in RedirectStatusCode
  );
}

/**
 * Returns the encoded URL from the error if it's a RedirectError, null otherwise.
 * Note that this does not validate the URL returned.
 * @param error the error that may be a redirect error
 * @return the url if the error was a redirect error
 */
export function getURLFromRedirectError<U extends string>(error: RedirectError<U>): U;
export function getURLFromRedirectError(error: unknown): string | null {
  if (!isRedirectError(error)) return null;
  // Slices off the beginning of the digest that contains the code and the separating ';'.
  return error.digest.split(";", 3)[2];
}

/**
 * Gets the redirect type from a redirect error.
 * @param error - The redirect error.
 * @returns The redirect type (push or replace).
 * @throws Error if the provided error is not a redirect error.
 */
export function getRedirectTypeFromError<U extends string>(error: RedirectError<U>): RedirectType {
  if (!isRedirectError(error)) throw new Error("Not a redirect error");
  return error.digest.split(";", 2)[1] as RedirectType;
}

/**
 * Gets the redirect status code from a redirect error.
 * @param error - The redirect error.
 * @returns The redirect status code.
 * @throws Error if the provided error is not a redirect error.
 */
export function getRedirectStatusCodeFromError<U extends string>(error: RedirectError<U>): number {
  if (!isRedirectError(error)) throw new Error("Not a redirect error");
  return Number(error.digest.split(";", 4)[3]);
}

/** NOT FOUND ERRORS */
const NOT_FOUND_ERROR_CODE = "NEXT_NOT_FOUND";

type NotFoundError = Error & { digest: typeof NOT_FOUND_ERROR_CODE };

/**
 * Checks an error to determine if it's an error generated by the `notFound()` helper.
 * @param error the error that may reference a not found error
 * @returns true if the error is a not found error
 */
export function isNotFoundError(error: unknown): error is NotFoundError {
  if (typeof error !== "object" || error === null || !("digest" in error)) return false;
  return error.digest === NOT_FOUND_ERROR_CODE;
}
