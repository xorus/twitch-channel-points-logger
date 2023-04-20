import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { conf } from '../conf.js';
import { log } from '../log.js';
import { Button, ButtonPrimary, InputLabel, InputText } from './styles.js';

// ugly as fuck but it works
function Configuration() {
    const [open, setOpen] = useState<boolean>(false);
    const [webhookUrl, setWebhookUrl] = useState<string>('');

    useEffect(() => {
        GM.registerMenuCommand('Configuration', () => setOpen(false));
    }, []);

    useEffect(() => {
        if (open) setWebhookUrl(conf.webhookUrl ?? '');
    }, [open]);

    if (!open) return null;
    return <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        // background: "rgba(0, 0, 0, 0.5)",
    }}>
        <div style={{
            width: "300px",
            background: "var(--color-background-body)",
            color: "var(--color-text-base)",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            padding: "1rem",
            borderRadius: "5px",
            position: "absolute"
        }}>
            <h1 style={{ fontSize: '1.5rem', paddingBottom: "1rem" }}>Point Logger Configuration</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                conf.webhookUrl = data.get('xtc-webhook-url') as string ?? '';
                log("set url to", conf.webhookUrl);
                conf.save();
                setOpen(false);
            }} style={{
                display: "flex",
                flexDirection: "column",
                gap: "1em",
            }}>
                <div>
                    <label>
                        <InputLabel style={{ display: "block" }}>webhook url</InputLabel>
                        <InputText type="text" name="xtc-webhook-url" value={webhookUrl} onChange={(x: any) => setWebhookUrl(x.target.value)} />
                    </label>
                </div>
                <div style={{
                    display: "flex",
                    gap: "1em",
                    flexWrap: "wrap",
                    alignItems: "right"
                }}>
                    <Button type="button" onClick={() => setOpen(false)}>Cancel</Button>
                    <ButtonPrimary>Save</ButtonPrimary>
                </div>
            </form>
        </div>
    </div>
}


export function mountConfigUi() {
    const wrapper = document.createElement('div');
    document.body.appendChild(wrapper);
    const root = createRoot(wrapper);
    root.render(<Configuration />);
}