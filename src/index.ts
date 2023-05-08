import {WebhookBackend} from "./backend/WebhookBackend.js";
import {log} from "./log.js";
import {mountConfigUi} from "./ui/configuration.js";
import {Watcher} from "./watcher.js";
import {WebServiceBackend} from "./backend/WebServiceBackend.js";

function initLogin(tokenElement: HTMLElement) {
    log("Script is running in auth page");
    const token = tokenElement.dataset.token;
    GM.setValue('authorizationToken', token);
    log("Auth token set to " + token);
    tokenElement.style.display = 'none';
    document.querySelectorAll<HTMLElement>('.pointy-points-auto-access-token-show').forEach(x => x.style.display = 'block');
    window.close();
}

function initScript() {
    log("Script is running");
    new Watcher();
    new WebhookBackend();
    new WebServiceBackend();
    mountConfigUi();
}


if (window.location.pathname.startsWith('/p/')) {
    log("noping out of FFZ");
} else {
    const tokenElement = document.getElementById('pointy-points-auto-access-token');
    if (tokenElement) {
        initLogin(tokenElement);
    } else {
        initScript();
    }
}
