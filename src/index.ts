import { WebhookBackend } from "./backend/WebhookBackend";
import { log } from "./log";
import { mountConfigUi } from "./ui/configuration";
import { Watcher } from "./watcher";

log("I'm alive!")
new Watcher();
new WebhookBackend();
mountConfigUi();
