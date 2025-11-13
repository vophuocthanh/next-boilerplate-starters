/**
 * Custom isEmpty function to replace lodash isEmpty
 * Checks if value is an empty object, collection, map, or set.
 * Objects are considered empty if they have no own enumerable string keyed properties.
 * Array-like values such as arguments objects, arrays, buffers, strings, or jQuery-like collections are considered empty if they have a length of 0.
 * Similarly, maps and sets are considered empty if they have a size of 0.
 */

type EmptyValue =
  | null
  | undefined
  | string
  | unknown[]
  | Record<string, unknown>
  | Map<unknown, unknown>
  | Set<unknown>
  | ArrayLike<unknown>;

const isEmpty = (value: EmptyValue): boolean => {
  // Handle null and undefined
  if (value == null) {
    return true;
  }

  // Handle arrays, strings, and array-like objects with length property
  if (
    Array.isArray(value) ||
    typeof value === "string" ||
    (typeof value === "object" &&
      "length" in value &&
      typeof value.length === "number")
  ) {
    return value.length === 0;
  }

  // Handle Map and Set
  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  // Handle plain objects
  if (typeof value === "object" && value.constructor === Object) {
    return Object.keys(value).length === 0;
  }

  // Handle other object types (check for own enumerable properties)
  if (typeof value === "object") {
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        return false;
      }
    }
    return true;
  }

  // For primitive values (numbers, booleans, symbols, etc.)
  return false;
};

export default isEmpty;
