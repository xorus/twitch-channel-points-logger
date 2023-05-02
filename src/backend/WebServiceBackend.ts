import {conf} from "../conf.js";
import {channelHandle} from "../lib.js";
import {error, log} from "../log.js";
import {pointEmitter} from "../store.js";

export class WebServiceBackend {
    constructor() {
        pointEmitter.on('change', (x: string) => {
            this.pointsChanged(x);
            log("Points changed to", x);
        });
    }

    pointsChanged(newValue?: string) {
        if (newValue === undefined) return;

        if (!conf.authorizationToken) {
            error("no authorization token");
            return;
        }

        if (!conf.whitelist) {
            log("no whitelist");
            return;
        }

        const handle = channelHandle();
        if (!conf.whitelist.includes('*')) {
            const whitelist = conf.whitelist.toLowerCase().replace(/(,|;)/, ' ').split(' ');
            if (!whitelist.find(x => x === handle)) {
                log("not in whitelist");
                return;
            }
        }

        GM.xmlHttpRequest({
            method: 'POST',
            url: __WEBSERVICE_URL_POINT_COUNT__,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + conf.authorizationToken
            },
            data: JSON.stringify({
                value: newValue,
                channel_name: handle,
                date: new Date().toISOString()
            }),
            onload: function (response) {
                var data = JSON.parse(response.responseText);
                log("sent point count to webservice", data);
            },
            onerror: function (error) {
                log("webservice error");
                console.error(error);
            }
        });
    }
}