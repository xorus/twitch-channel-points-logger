import {Emitter} from 'subscribe'

export class Conf {
    public webhookUrl?: string;
    public backendUrl?: string;
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
        GM.getValue<string>('backendUrl', '').then(x => {
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
        GM.setValue('backendUrl', this.backendUrl);
        GM.setValue('authorizationToken', this.authorizationToken);
        GM.setValue('whitelist', this.whitelist);
    }

    private authWaitInterval: number = -1;

    public async waitUntilAuthTokenChanges() {
        // prevent double running if the user closed the window
        clearInterval(this.authWaitInterval);
        return new Promise<string>(resolve => {
            this.authWaitInterval = setInterval(() => {
                GM.getValue<string>('authorizationToken', '').then(x => {
                    if (x !== this.authorizationToken) {
                        clearInterval(this.authWaitInterval);
                        resolve(x);
                    }
                });
            }, 250);
        });
    }

    public getLoginUrl() {
        return (this.backendUrl ?? __WEBSERVICE_URL__) + __ENDPOINT_LOGIN__;
    }

    public getPointCountUrl() {
        return (this.backendUrl ?? __WEBSERVICE_URL__) + __ENDPOINT_POINT_COUNT__;
    }
}

export const conf = new Conf();

