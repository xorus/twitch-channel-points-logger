import { WebhookBackend } from "./backend/WebhookBackend.js";
import { log } from "./log.js";
import { mountConfigUi } from "./ui/configuration.js";
import { Watcher } from "./watcher.js";

log("I'm alive!")
new Watcher();
new WebhookBackend();
mountConfigUi();
