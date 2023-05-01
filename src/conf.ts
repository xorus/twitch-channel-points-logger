import { Emitter } from 'subscribe'

export class Conf {
    public webhookUrl?: string;
    public authorizationToken?: string;
    public whitelist?: string;
    public readonly emitter = new Emitter<'loadedValue'>();

    public constructor() {
        this.load();
    }

    public load() {
        GM.getValue<string>('webhookUrl', '').then(x => {
            this.webhookUrl = x;
            this.emitter.emit("loadedValue");
        });
        GM.getValue<string>('authorizationToken', '').then(x => {
            this.authorizationToken = x;
            this.emitter.emit("loadedValue");
        });
        GM.getValue<string>('whitelist', '').then(x => {
            this.whitelist = x;
            this.emitter.emit("loadedValue");
        });
    }

    public save() {
        GM.setValue('webhookUrl', this.webhookUrl);
        GM.setValue('authorizationToken', this.authorizationToken);
        GM.setValue('whitelist', this.whitelist);
    }
}

export const conf = new Conf();

