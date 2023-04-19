import { conf } from "../conf.js";
import { channelHandle } from "../lib.js";
import { error, log } from "../log.js";
import { pointEmitter } from "../store.js";

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
            error("no webhook url");
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
                var data = JSON.parse(response.responseText);
                log("sent webhook", data);
            },
            onerror: function (error) {
                log("webhook error");
                console.error(error);
            }
        });
    }
}