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

    async pointsChanged(newValue?: string) {
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
        if (!handle) {
            error("could not determine channel handle");
            return;
        }
        if (!conf.whitelist.includes('*')) {
            const whitelist = conf.whitelist.toLowerCase().replace(/(,|;)/, ' ').split(' ');
            if (!whitelist.find(x => x === handle)) {
                log("not in whitelist");
                return;
            }
        }

        const lastCount = await conf.getLastPointCount(handle);
        if (lastCount !== newValue) {
            conf.setLastPointCount(handle, newValue);
        } else {
            log("Point count did not change since last time. Not sending update to backend.");
            return;
        }

        GM.xmlHttpRequest({
            method: 'POST',
            url: conf.getPointCountUrl(),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + conf.authorizationToken
            },
            data: JSON.stringify({
                value: newValue,
                channel_name: handle
            }),
            onload: function (response) {
                log("sent point count to webservice", JSON.parse(response.responseText));
            },
            onerror: function (error) {
                log("webservice error");
                console.error(error);
            }
        });
    }
}