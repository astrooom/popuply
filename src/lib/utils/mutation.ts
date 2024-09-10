import { PlainObject } from "./type";

export function objectKeys<T extends object>(obj: T) {
  return Object.keys(obj) as Array<keyof T>;
}

/**
 * Checks if a value is a plain object.
 *
 * @param {*} v The value to check.
 * @returns {boolean} True if the value is a plain object, false otherwise.
 * @example
 *    isPlainObject({}) //=> true
 *    isPlainObject({ a: 1 }) //=> true
 *    isPlainObject(null) //=> false
 *    isPlainObject('1) //=> false
 *    isPlainObject([]) //=> false
 *    isPlainObject(new Function()) //=> false
 *    isPlainObject(new Date()) //=> false
 */
export function isPlainObject<T>(v: T | object): v is PlainObject {
  return v?.constructor === Object;
}

/**
 * Checks if a value is an array.
 *
 * @template T - The type of the value being checked
 * @param {unknown} value - The value to check
 * @returns {value is T[]} - True if the value is an array, false otherwise
 */
export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}
