/**
 * Escapes all special characters in a given string to allow it to be used in a regular expression.
 *
 * @param str - The string to escape.
 * @returns The escaped string.
 */
export function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Extracts the username from the URL path and returns it.
 * If the URL doesn't match the expected format, returns undefined.
 *
 * @returns The extracted username, or undefined if not found.
 */
export function channelHandle(): string | undefined {
    const match = window.location.pathname.match(/^\/(popout\/)?(?<user>[a-zA-Z0-9_]+)/);
    if (match && match[2]) return match[2];
    return undefined;
}
