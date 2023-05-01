import {conf} from "../conf.js";
import {channelHandle} from "../lib.js";
import {log} from "../log.js";
import {pointEmitter} from "../store.js";

export class WebhookBackend {
    constructor() {
        pointEmitter.on('change', (x: string) => {
            this.pointsChanged(x);
            log("Points changed to", x);
        });
    }

    pointsChanged(newValue?: string) {
        if (newValue === undefined) return;

        if (!conf.webhookUrl) {
            // error("no webhook url"); // disabled
            return;
        }

        GM.xmlHttpRequest({
            method: 'POST',
            url: conf.webhookUrl,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                value: newValue,
                channel: channelHandle()
            }),
            onload: function (response) {
                log("sent webhook", JSON.parse(response.responseText));
            },
            onerror: function (error) {
                log("webhook error");
                console.error(error);
            }
        });
    }
}