import {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {conf} from '../conf.js';
import {log} from '../log.js';
import {Button, ButtonPrimary, InputLabel, InputText} from './styles.js';

// ugly as fuck but it works
function Configuration() {
    const [open, setOpen] = useState<boolean>(false);
    const [webhookUrl, setWebhookUrl] = useState<string>('');
    const [authToken, setAuthToken] = useState<string>('');
    const [whitelist, setWhitelist] = useState<string>('');

    useEffect(() => {
        GM.registerMenuCommand('Configuration', () => setOpen(true));
    }, []);

    useEffect(() => {
        if (open) {
            setWebhookUrl(conf.webhookUrl ?? '');
            setWhitelist(conf.whitelist ?? '');
            setAuthToken(conf.authorizationToken ?? '');
        }
    }, [open]);

    const authenticated = authToken.length > 0;

    if (!open) return null;
    return <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.5)",
    }} onClick={e => {
        if (e.target !== e.currentTarget) return;
        setOpen(false);
    }} className={"backdrop"}>
        <div style={{
            width: "400px",
            background: "var(--color-background-body)",
            color: "var(--color-text-base)",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            padding: "1rem",
            borderRadius: "5px",
            position: "absolute"
        }}>
            <div style={{alignItems: "center", display: "flex", paddingBottom: "1rem"}}>
                <h1 style={{fontSize: '1.5rem', paddingBottom: "0"}}>
                    Point Logger Configuration
                </h1>
                <div style={{flex: 1}}></div>
                <Button type="button" onClick={() => setOpen(false)}>Close</Button>
            </div>
            <form onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                conf.webhookUrl = (data.get('xtc-webhook-url') as string ?? '').trim();
                conf.authorizationToken = (data.get('xtc-auth-token') as string ?? '').trim();
                conf.whitelist = data.get('xtc-whitelist') as string ?? '';
                log("set url to", conf.webhookUrl);
                log("set auth token to", conf.authorizationToken);
                conf.save();
                setOpen(false);
            }} style={{
                display: "flex",
                flexDirection: "column",
                gap: "1em",
            }}>
                {authenticated ? undefined :
                    <p>
                        Welcome!<br/>
                        Login is a bit of a manual process for now, sorry! <br/><br/>
                        <ol style={{listStyleType: 'decimal'}}>
                            <li>Click Login</li>
                            <li>Login via Twitch in the opened pop-up</li>
                            <li>Copy the token into the "Auth token" field</li>
                            <li>Close the pop-up</li>
                            <li>Fill in the "channels to log" field (or just put * if you don't care)</li>
                            <li>Hit "Save"</li>
                        </ol>
                    </p>
                }

                {/*<div>*/}
                {/*    {authenticated ? <strong>Logged in</strong> : <strong>Not logged in</strong>}*/}
                {/*</div>*/}
                <div>
                    <label>
                        <InputLabel style={{display: "block"}}>
                            Auth token
                        </InputLabel>
                        <InputText type="text" name="xtc-auth-token" value={authToken}
                                   onChange={(x: any) => setAuthToken(x.target.value.trim())}/>
                    </label>
                </div>

                <div>
                    <ButtonPrimary type="button" onClick={() => {
                        window.open(__WEBSERVICE_URL_LOGIN__, 'point counter login',
                            'status=no,location=no,toolbar=no,menubar=no,width=500,height=700'
                        )
                    }}>
                        {authenticated ? <strong>Reauthenticate</strong> : <strong>Login</strong>}
                    </ButtonPrimary>
                </div>

                <div>
                    <label>
                        <InputLabel style={{display: "block"}}>
                            Channels to log (comma separated list, use * to include all channels)
                        </InputLabel>
                        <InputText type="text" name="xtc-whitelist" value={whitelist}
                                   placeholder="example: dougdoug, pointcrow"
                                   title="Comma separated values, use * to include all channels"
                                   required onChange={(x: any) => setWhitelist(x.target.value)}/>
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

                <details>
                    <summary>advanced</summary>
                    <div>
                        <label>
                            <InputLabel style={{display: "block"}}>Custom webhook url</InputLabel>
                            <InputText type="text" name="xtc-webhook-url" value={webhookUrl}
                                       placeholder="Leave empty if unsure"
                                       onChange={(x: any) => setWebhookUrl(x.target.value)}/>
                        </label>
                    </div>
                </details>
            </form>
        </div>
    </div>
}


export function mountConfigUi() {
    const wrapper = document.createElement('div');
    wrapper.id = "xtc-config-ui";
    document.body.appendChild(wrapper);
    const root = createRoot(wrapper);
    root.render(<Configuration/>);
}