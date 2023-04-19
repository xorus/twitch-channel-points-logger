// ==UserScript==
// @name         Twitch Channel point count uploader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_info
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @connect      n8n.xorus.dev
// @require      https://raw.githubusercontent.com/rfkortekaas/MonkeyConfig/master/monkeyconfig.js

// ==/UserScript==

// @ require      https://apis.google.com/js/api.js
(function() {
    'use strict';

    const cfg = new MonkeyConfig({
        title: 'Settings',
        menuCommand: true,
        params: {
            webhook: {
                type: 'text',
                default: ''
            },
            /*sheets_api_key: {
                type: 'text',
                default: ''
            },
            sheets_api_client_id: {
                type: 'text',
                default: ''
            },
            sheets_document_id: {
                type: 'text',
                default: '',
            },
            sheets_sheet_gid: {
                type: 'text',
                default: '',
            },
            sheets_sheet_column_date: {
                type: 'text',
                default: 'A',
            },
            sheets_sheet_column_value: {
                type: 'text',
                default: 'B',
            },*/
        }
    });

/*
    function initClient() {
        gapi.client.init({
            apiKey: cfg.get('sheets_api_key'),
            clientId: cfg.get('sheets_api_client_id'),
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
            scope: 'https://www.googleapis.com/auth/spreadsheets'
        }).then(() => {
            // Authorize the user to access the sheet

            console.log("hello :)=");
            return gapi.auth2.getAuthInstance().signIn();
        }).then(() => {
            // Use the SpreadsheetApp API to access the sheet
            const sheet = SpreadsheetApp.openById(cfg.get('sheets_document_id')).getActiveSheet();
            // ...

            console.log("sheet", sheet);
        });
    }
    initClient();

    function addRowToSheet() {
        // Replace DOCUMENT_ID and SHEET_GID with the ID of your Google Sheet document and the GID of the sheet you want to add data to
        const sheet = SpreadsheetApp.openById( cfg.get('sheets_document_id')).getSheetBySheetId( cfg.get('sheets_document_gid'));

        // Get the last row of data
        const lastRow = sheet.getLastRow();

        // Get the last value in the second column
        const lastValue = sheet.getRange(lastRow, 2).getValue();

        // Compute the new value
        const newValue = computeNewValue();

        // Check if the new value is the same as the last value
        if (newValue === lastValue) {
            // If they're the same, don't add a new row
            return;
        }

        // If they're different, add a new row with the current date and the new value
        const date = new Date().toLocaleDateString();
        const newRow = [date, newValue];
        sheet.appendRow(newRow);
    }



    function computeNewValue() {
        // Replace this with your own computation
        return Math.floor(Math.random() * 1000000);
    }*/
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    let currentPointCount = undefined;

    const computePointCount = () => {
        // console.log("hello");
        const image = document.querySelector('button .channel-points-icon__image');
        const currencyNameRegex = escapeRegExp(image.alt);
        if (!image) return undefined;
        // console.log("hello1", currencyNameRegex, image);

        const btn = image.closest('button');
        if (!btn) return undefined;
        // console.log("hello2", btn);

        btn.parentElement.dispatchEvent(new MouseEvent('mouseover', {
            'view': unsafeWindow,
            'bubbles': true,
            'cancelable': true
        }));
        // console.log("hello4");

        /*const hide = document.createElement('style');
        hide.innerText = '.ReactModal__Content { display: none!important; }';
        document.body.appendChild(hide);*/

        setTimeout(() => {
            for (let el of document.querySelectorAll('.ReactModal__Content')) {
                el.style.display = "none";
                // console.log("hello3", el);
                let regex = new RegExp("([\\d. ',]+) " + currencyNameRegex, "i");
                let matches = el.innerHTML.match(regex);
                if (matches[1]) {
                    currentPointCount = matches[1].replace(/[. ',]/g, '');
                    console.log("count ", currentPointCount);
                    break;
                }
            }
            // hide.remove();
            btn.parentElement.dispatchEvent(new MouseEvent('mouseout', {
                'view': unsafeWindow,
                'bubbles': true,
                'cancelable': true
            }));
        }, 300);
    };

    setInterval(computePointCount, 1 * 60 * 1000);
    // setTimeout(computePointCount, 5 * 1000);

    const theThing = () => {
        if (window.location.pathname.includes('/dougdoug')) {
            if (currentPointCount === undefined) {
                console.error("no point count to upload");
            }
            let xmlHttpRequest = GM.xmlHttpRequest || GM_xmlhttpRequest;
            xmlHttpRequest({
                method: 'POST',
                url: cfg.get('webhook'),
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    value: currentPointCount,
                    channel: 'dougdoug'
                }),
                onload: function(response) {
                    var data = JSON.parse(response.responseText);
                    console.log(data);
                },
                onerror: function(error) {
                    console.error(error);
                }
            });
        }
    }
    setInterval(theThing, 2 * 60 * 1000);
})();

/* n8n workflow:
{
  "name": "Twitch points to Google Sheets",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "bef7fef0-2c66-47ff-ab7e-efbb8d682c5b",
        "options": {}
      },
      "id": "a6681a14-eba3-4e2b-b503-23b32b83c66d",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [
        520,
        520
      ],
      "webhookId": "bef7fef0-2c66-47ff-ab7e-efbb8d682c5b"
    },
    {
      "parameters": {
        "documentId": {
          "__rl": true,
          "value": "https://docs.google.com/spreadsheets/d/1CiAT3S74MNgspUeA2n17lqRNDbUaRlHxYWokc1_nZOI/edit#gid=277539579",
          "mode": "url",
          "__regex": "https:\\/\\/(?:drive|docs)\\.google\\.com\\/\\w+\\/d\\/([0-9a-zA-Z\\-_]+)(?:\\/.*|)"
        },
        "sheetName": {
          "__rl": true,
          "value": 277539579,
          "mode": "list",
          "cachedResultName": "raw numbers",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1CiAT3S74MNgspUeA2n17lqRNDbUaRlHxYWokc1_nZOI/edit#gid=277539579"
        },
        "options": {}
      },
      "id": "915674dc-34b2-4ca9-868c-db93c3ee3c01",
      "name": "Google Sheets",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 3,
      "position": [
        740,
        520
      ]
    },
    {
      "parameters": {
        "operation": "limit",
        "keep": "lastItems"
      },
      "id": "919c2b12-5dc6-4ee0-ab04-10b0c914cef9",
      "name": "Item Lists",
      "type": "n8n-nodes-base.itemLists",
      "typeVersion": 2,
      "position": [
        920,
        520
      ]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ \"\" + $node.Webhook.json.body.value }}",
              "value2": "={{ \"\" + $json.value }}"
            }
          ]
        }
      },
      "id": "c1638788-102f-413e-8c9e-a24a098ea5e8",
      "name": "is the same value",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        1100,
        520
      ]
    },
    {
      "parameters": {
        "operation": "append",
        "documentId": {
          "__rl": true,
          "value": "https://docs.google.com/spreadsheets/d/1CiAT3S74MNgspUeA2n17lqRNDbUaRlHxYWokc1_nZOI/edit#gid=277539579",
          "mode": "url",
          "__regex": "https:\\/\\/(?:drive|docs)\\.google\\.com\\/\\w+\\/d\\/([0-9a-zA-Z\\-_]+)(?:\\/.*|)"
        },
        "sheetName": {
          "__rl": true,
          "value": 277539579,
          "mode": "list",
          "cachedResultName": "raw numbers",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1CiAT3S74MNgspUeA2n17lqRNDbUaRlHxYWokc1_nZOI/edit#gid=277539579"
        },
        "fieldsUi": {
          "fieldValues": [
            {
              "fieldId": "date (UTC)",
              "fieldValue": "={{ DateTime.now().toUTC().format('yyyy-MM-dd T:s') }}"
            },
            {
              "fieldId": "value",
              "fieldValue": "={{ $node.Webhook.json.body.value }}"
            }
          ]
        },
        "options": {
          "cellFormat": "USER_ENTERED"
        }
      },
      "id": "fcc2da40-0137-4a83-b424-fa6c6ba49d5e",
      "name": "Google Sheets1",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 3,
      "position": [
        1280,
        540
      ],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "5",
          "name": "Google jdpepi"
        }
      }
    }
  ],
  "pinData": {},
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "Google Sheets",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Sheets": {
      "main": [
        [
          {
            "node": "Item Lists",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Item Lists": {
      "main": [
        [
          {
            "node": "is the same value",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "is the same value": {
      "main": [
        [],
        [
          {
            "node": "Google Sheets1",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": true,
  "settings": {},
  "versionId": "95d1f114-de94-45fc-9254-cb30a2fcfc9b",
  "id": "11",
  "meta": {
    "instanceId": "14c0677e59f375a48b67d68616276bffb345b54cfe3db013ba03f61d970a9599"
  },
  "tags": []
}

*/

