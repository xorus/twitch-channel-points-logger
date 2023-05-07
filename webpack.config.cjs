const path = require('path');
const {UserscriptPlugin} = require('webpack-userscript');
const {NormalModuleReplacementPlugin, DefinePlugin} = require('webpack');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const dev = process.env.NODE_ENV === 'development';

const version = "0.1.0";// + (new Date().getTime());

const WEBSERVICE_DOMAIN = process.env.WEBSERVICE_BASE_URL ?? 'pointypoints';
const WEBSERVICE_BASE_URL = process.env.WEBSERVICE_BASE_URL ?? 'https://pointypoints.xorus.dev';

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
    entry: './src/index.ts',
    mode: dev ? 'development' : 'production',
    module: {
        rules: [
            // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
            {test: /\.([cm]?ts|tsx)$/, loader: "ts-loader"}
        ]
    },
    plugins: [
        new DefinePlugin({
            '__WEBSERVICE_URL_LOGIN__': JSON.stringify(`${WEBSERVICE_BASE_URL}/login/twitch`),
            '__WEBSERVICE_URL_POINT_COUNT__': JSON.stringify(`${WEBSERVICE_BASE_URL}/api/points`),
        }),
        new NormalModuleReplacementPlugin(new RegExp(/^\..+\.js$/), function (resource) {
            resource.request = resource.request.replace(new RegExp(/\.js$/), '');
        }),
        new UserscriptPlugin({
            headers: {
                name: 'twitch-channel-points-logger',
                description: 'Logs channel points. For my own sanity, this script is bundled using Webpack. Check the GitHub link for a readable source code.',
                version: `${version}.${new Date().getTime()}.[buildNo]`, //`,
                author: "Xorus",
                homepage: "https://github.com/xorus/twitch-channel-points-logger",
                bugs: "https://github.com/xorus/twitch-channel-points-logger/issues",
                match: [
                    "https://www.twitch.tv/*",
                ],
                connect: [
                    WEBSERVICE_DOMAIN
                ],
                icon: "https://icons.duckduckgo.com/ip3/twitch.tv.ico",
                grant: [
                    "GM.getValue",
                    "GM.setValue",
                    "GM.addStyle",
                    "GM.info",
                    "GM.xmlHttpRequest",
                    "GM.registerMenuCommand",
                ]
            },
            pretty: true,
            strict: true,
            whitelist: true,
            i18n: {
                en: {
                    name: 'Twitch Channel Points Logger'
                }
            }
        }),
        new FileManagerPlugin({
            events: {
                onEnd: {
                    copy: [
                        {source: './dist/bundle.user.js', destination: './build/twitch-channel-points-logger.user.js'},
                        {source: './dist/bundle.meta.js', destination: './build/twitch-channel-points-logger.meta.js'},
                    ]
                }
            }
        })
    ],
    devServer: {
        port: 8085,
        // open: ['http://locahost:8085/bundle.user.js'],
        // open: true,
        static: {
            directory: path.join(__dirname, 'dist'),
            watch: true,
        },
        // devMiddleware: {
        //   writeToDisk: true
        // },
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
};