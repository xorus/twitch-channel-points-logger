import { Emitter } from 'subscribe'

export const pointEmitter = new Emitter<'change'>();
let pointValue: string | undefined = undefined;

export function getPoints() {
    return pointValue;
}

export function setPoints(value?: string) {
    if (pointValue !== value) {
        pointValue = value;
        pointEmitter.emit("change", value);
    }
}
