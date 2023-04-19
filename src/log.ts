export function log(...args: unknown[]) {
    console.log("%c[channel-points-logger]%c", 'background: purple; padding: 0 4px 0 4px; color: white; border-radius: 4px', 'color: unset', ...args);
}
export function error(...args: unknown[]) {
    console.error("%c[channel-points-logger]%c", 'background: purple; padding: 0 4px 0 4px; color: white; border-radius: 4px', 'color: unset', ...args);
}
