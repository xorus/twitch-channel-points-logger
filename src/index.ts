import {WebhookBackend} from "./backend/WebhookBackend.js";
import {log} from "./log.js";
import {mountConfigUi} from "./ui/configuration.js";
import {Watcher} from "./watcher.js";
import {WebServiceBackend} from "./backend/WebServiceBackend.js";

log("Script is running")
new Watcher();
new WebhookBackend();
new WebServiceBackend();
mountConfigUi();
