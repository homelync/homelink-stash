export function replaceErrors(key, value) {
    if (value instanceof Error) {
        var error = {};

        Object.getOwnPropertyNames(value).forEach(x => error[x] = value[x]);

        return error;
    }

    return value;
}