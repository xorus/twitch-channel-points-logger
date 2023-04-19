import mitt from "mitt";

export const pointEmitter = mitt();
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
