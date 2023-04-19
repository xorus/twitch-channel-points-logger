import mitt from "mitt";

export class Conf {
    public webhookUrl: string;
    public readonly emitter = mitt<{loadedValue: never}>();

    public constructor() {
        this.load();
    }

    public load() {
        GM.getValue<string>('webhookUrl', '').then(x => {
            this.webhookUrl = x;
            this.emitter.emit("loadedValue");
        });
    }

    public save() {
        GM.setValue('webhookUrl', this.webhookUrl);
    }
}

export const conf = new Conf();
