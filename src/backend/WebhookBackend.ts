import { conf } from "../conf";
import { channelHandle } from "../lib";
import { log } from "../log";
import { pointEmitter } from "../store";

export class WebhookBackend {
    constructor() {
        pointEmitter.on('change', x => {
            this.pointsChanged(x);
            log("Points changed to", x);
        });
    }

    pointsChanged(newValue?: string) {
        if (newValue === undefined) return;
        
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
            onload: function(response) {
                var data = JSON.parse(response.responseText);
                log("sent webhook", data);
            },
            onerror: function(error) {
                log("webhook error");
                console.error(error);
            }
        });
    }
}