/**
 * Enhances the readability of complex types in IDEs.
 * @template T The type to be prettified.
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & unknown;

/**
 * Combines properties from the source type with the target type, overriding any duplicates.
 * @template Target The base type.
 * @template Source The type whose properties will be merged into the target.
 */
export type Assign<Target, Source> = Prettify<Omit<Target, keyof Source> & Source>;

/**
 * Makes all properties of the original type writeable.
 * @template T The original type.
 */
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Makes a specific property of a type optional.
 * @template Source The original type.
 * @template Prop The property to make optional.
 */
export type Optional<Source, Prop extends keyof Source> = Prettify<Pick<Partial<Source>, Prop> & Omit<Source, Prop>>;

/**
 * Creates a type that requires at least one of the specified properties to be present.
 * @template T The original type.
 * @template K Union of keys, at least one of which must be present.
 */
export type RequireAtLeastOne<T, K extends keyof T = keyof T> = Prettify<
  Omit<T, K> & { [P in K]-?: Required<Pick<T, P>> & Partial<Pick<T, Exclude<K, P>>> }[K]
>;

/**
 * Makes specified properties of an object optional.
 * @template T The original type.
 * @template K Union of keys to make optional.
 */
export type PartialBy<T, K extends keyof T> = Prettify<Omit<T, K> & Partial<Pick<T, K>>>;

/**
 * Converts a string to an array of that string, or leaves an array as-is.
 * @template T The input type (string or array).
 */
type StringOrArray<T> = T extends string ? T[] : T;

/**
 * Creates a type with specified properties required and others optional, supporting nested properties.
 * @template T The original type.
 * @template K Union of keys (including nested keys) to make required.
 */
export type PartialWithRequired<T, K extends string | ReadonlyArray<string>> = Omit<
  Partial<T>,
  StringOrArray<K>[number]
> & {
  [P in StringOrArray<K>[number]as P extends keyof T
  ? P
  : P extends `${infer Top}.${string}`
  ? Top extends keyof T
  ? Top
  : never
  : never]-?: P extends keyof T
  ? T[P]
  : P extends `${infer Top}.${infer Rest}`
  ? Top extends keyof T
  ? T[Top] extends (infer U)[]
  ? (PartialWithRequired<U, Rest> | undefined)[]
  : PartialWithRequired<T[Top], Rest>
  : never
  : never;
};

/**
 * Picks nested properties from a type, making parent properties required if specified.
 * @template T The original type.
 * @template K Union of keys (including nested keys) to pick.
 * @template ParentRequired Whether parent properties should be required.
 */
type NestedPick<T, K extends string | ReadonlyArray<string>, ParentRequired extends boolean = false> = {
  [P in StringOrArray<K>[number]as P extends keyof T
  ? P
  : P extends `${infer Top}.${string}`
  ? Top extends keyof T
  ? Top
  : never
  : never]-?: P extends keyof T
  ? ParentRequired extends true
  ? T[P]
  : T[P] | undefined
  : P extends `${infer Top}.${infer Rest}`
  ? Top extends keyof T
  ? T[Top] extends (infer U)[]
  ? NestedPick<U, Rest, true>[]
  : NestedPick<T[Top], Rest, true>
  : never
  : never;
};

/**
 * Merges two types, giving priority to properties from T over U.
 * @template T The type with higher priority.
 * @template U The type with lower priority.
 */
type MergeTypes<T, U> = Omit<U, keyof T> & T;

/**
 * Creates a type with specified properties picked and required, supporting nested properties.
 * @template T The original type.
 * @template PickKeys Union of keys (including nested keys) to pick and make required.
 * @template RequiredKeys Union of keys (including nested keys) to make required if not picked.
 */
export type NestedPickWithRequired<
  T,
  PickKeys extends string | ReadonlyArray<string>,
  RequiredKeys extends string | ReadonlyArray<string>,
> = MergeTypes<NestedPick<T, PickKeys, true>, NestedPick<T, RequiredKeys, true>>;

/**
 * Generates a union of all property keys in an object type, including nested keys.
 * @template ObjectType The object type to generate keys for.
 */
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends Array<infer ArrayType>
  ? ArrayType extends object
  ? `${Key}` | `${Key}.${NestedKeyOf<ArrayType>}`
  : `${Key}`
  : ObjectType[Key] extends object
  ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
  : `${Key}`;
}[keyof ObjectType & (string | number)];


/**
 * The type of a plain object. This is a more strict type than the `object` type which also includes functions and arrays.
 */
export type PlainObject = Record<PropertyKey, unknown>;