import { ComplexAttributeConverter } from "lit";


/**
 * Attribute converter for attributes of type `number|undefined`.
 * Attribute value empty string or `null` is interpreted as `undefined`; non-empty string is parsed as number.
 * Example:
 * 
 * ```ts
 * class NightingaleExampleTrack {
 *   ;@property({ converter: OptionalNumberAttributeConverter })
 *   "y-min"?: number;
 * }
 * ```
 * */
export const OptionalNumberAttributeConverter: ComplexAttributeConverter<number | undefined> = {
    fromAttribute(str) {
        if (!str) { // null or empty string
            return undefined;
        } else {
            return Number(str);
        }
    },
    toAttribute(value) {
        if (value === undefined) {
            return "";
        } else {
            return String(value);
        }
    },
}

/**
 * Create an attribute converter for attribute that allows a fixed set of string values.
 * Passing an invalid value to the attribute will result in a warning and using the default value instead.
 * Example:
 * 
 * ```ts
 * const Weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
 * type Weekday = typeof Weekdays[number];
 * 
 * class NightingaleExampleTrack {
 *   ;@property({ converter: EnumAttributeConverter(Weekdays, "Mon") })
 *   day: Weekday;
 * }
 * ```
 * */
export function EnumAttributeConverter<T extends string, D extends T>(allowedValues: readonly T[], defaultValue: D): ComplexAttributeConverter<T> {
    return {
        fromAttribute(str) {
            if (!str) { // null or empty string
                return defaultValue;
            }
            if (allowedValues.includes(str as T)) { // valid string
                return str as T;
            } else { // invalid string
                console.warn(`Value "${str}" is not valid for attribute of type ${allowedValues.map(v => `"${v}"`).join(" | ")}. Falling back to default value ("${defaultValue}").`);
                return defaultValue;
            }
        },
        toAttribute(value) {
            return value;
        },
    };
}
