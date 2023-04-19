import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { conf } from '../conf';
import { log } from '../log';
// import { styled } from "@stitches/react";

// const button = styled('button', {
//     backgroundColor: "var(--color-background-button-primary-default)",
//     color: "var(--color-text-button-primary)"
// })

// ugly as fuck but it works
function Configuration() {
    const [open, setOpen] = useState<boolean>(true);
    const [webhookUrl, setWebhookUrl] = useState<string>('');

    useEffect(() => {
        GM.registerMenuCommand('Configuration', () => setOpen(true));
        // setWebhookUrl(conf.webhookUrl);
        // conf.emitter.on('loadedValue', () => {
        //     setWebhookUrl(conf.webhookUrl);
        // });
    }, []);

    useEffect(() => {
        if (open) setWebhookUrl(conf.webhookUrl);
    }, [open]);

    if (!open) return undefined;
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
            background: "black",
            color: "white",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            padding: "1rem",
            borderRadius: "5px",
            position: "absolute"
        }}>
            <h1 style={{ fontSize: '2rem', paddingBottom: "1rem" }}>configuration</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                conf.webhookUrl = data.get('xtc-webhook-url') as string ?? '';
                log("set url to", conf.webhookUrl);
                conf.save();
                setOpen(false);
            }}>
                <div>
                    <label>
                        <span style={{ display: "block" }}>webhook url</span>
                        <input type="text" name="xtc-webhook-url" value={webhookUrl} onChange={x => setWebhookUrl(x.target.value)} />
                    </label>
                </div>
                <div>
                    <button type="button" onClick={() => setOpen(false)}>Cancel</button>
                    <button>💾 save</button>
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