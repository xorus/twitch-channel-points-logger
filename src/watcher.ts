import { escapeRegExp } from "./lib.js";
import { log } from "./log.js";
import { setPoints } from "./store.js";

const TOOLTIP_WAIT_DELAY_MS = 300;
const INITIAL_POINTS_DELAY_MS = 10 * 1000; // first fetch
const REFRESH_POINTS_DELAY_MS = 1 * 60 * 1000;

export class Watcher {
    private currencyNameRegex?: string;
    private currentPointCount?: string;

    computePointCount() {
        const image = document.querySelector<HTMLImageElement>('button .channel-points-icon__image');
        if (!image) return undefined;
        // the currency name is written in the image alt attribute, which will be useful to match via regex later
        this.currencyNameRegex = escapeRegExp(image.alt);

        const btn = image.closest<HTMLButtonElement>('button');
        if (!btn || !btn.parentElement) return undefined;

        // fake a mouse over to open the tooltip (the tooltip description does not have screen-reader accessibility I could tap into :-) )
        // this will allow us to get the exact channel point count
        btn.parentElement.dispatchEvent(new MouseEvent('mouseover', {
            // need to use unsafeWindows because tampermonkey/greasemonkey mocks the window element
            'view': unsafeWindow,
            'bubbles': true,
            'cancelable': true
        }));

        setTimeout(() => {
            for (let el of document.querySelectorAll<HTMLDivElement>('.ReactModal__Content')) {
                el.style.display = "none";
                // find the point count, it will always be in a tooltip in the format "XXX Currency Name"
                let regex = new RegExp(`([\\d. ',]+) ${this.currencyNameRegex}`, "i");
                let matches = el.innerHTML.match(regex);
                if (matches && matches[1]) {
                    // normalize point count into something more number-ish
                    // twitch uses different separators depending on user locale, so we just remove everything that's not a number from the string
                    this.currentPointCount = matches[1].replace(/[^\d]/g, '');
                    log("Updated channel point count =", this.currentPointCount);
                    setPoints(this.currentPointCount);
                    break;
                }
            }
            btn.parentElement?.dispatchEvent(new MouseEvent('mouseout', {
                'view': unsafeWindow,
                'bubbles': true,
                'cancelable': true
            }));
        }, TOOLTIP_WAIT_DELAY_MS); // tooltip takes about 100ms before it starts opening
    }

    start() {
        setInterval(() => this.computePointCount(), REFRESH_POINTS_DELAY_MS);
        setTimeout(() => this.computePointCount(), INITIAL_POINTS_DELAY_MS);
    }

    constructor() {
        this.start();
    }
}
