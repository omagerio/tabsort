'use strict';
let openTabs = [];
let sortByFullPath = true;

function getNewTabPosition(filePath) {
    openTabs.sort(
        function (a, b) {
            if (a < b) {
                return -1;
            } else {
                return 1;
            }
        }
    );

    let position = 1;

    for (let tabPathIndex in openTabs) {
        if (openTabs[tabPathIndex] == filePath) {
            position = tabPathIndex;
            break;
        }
    }

    return position;
}

Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
async function activate(context) {

    const configuredView = vscode_1.workspace.getConfiguration().get('tabsort.sortByFullPath');
    switch (configuredView) {
        case '0':
            sortByFullPath = false;
            break;
        case '1':
            sortByFullPath = true;
            break;
        default:
            sortByFullPath = true;
            break;
    }

    /*
    await vscode_1.workspace.getConfiguration().update('tabsort.sortByFullPath', sortByFullPath, vscode_1.ConfigurationTarget.Global, );
    */

    context.subscriptions.push(
        vscode_1.workspace.onDidCloseTextDocument(
            (editor) => {
                let filename = editor.fileName.toLowerCase();
                if (!sortByFullPath) {
                    filename = filename.split(/[\\/]/).pop();
                }
                let position = openTabs.indexOf(filename);
                if (position > -1) {
                    openTabs.splice(position, 1);
                }
            }
        )
    );

    context.subscriptions.push(vscode_1.window.onDidChangeActiveTextEditor((editor) => {
        if (editor != undefined) {
            let filename = editor._documentData._document.fileName.toLowerCase();

            if (!sortByFullPath) {
                filename = filename.split(/[\\/]/).pop();
            }

            if (openTabs.indexOf(filename) == -1) {
                openTabs.push(filename);
            }
            let newPosition = getNewTabPosition(filename);
            vscode_1.commands.executeCommand('moveActiveEditor', { to: "position", value: parseInt(newPosition) + 1 });
        }
    }));

    context.subscriptions.push(vscode_1.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('tabsort.sortByFullPath')) {
            const configuredView = vscode_1.workspace.getConfiguration().get('tabsort.sortByFullPath');
            sortByFullPath = configuredView;
            vscode_1.window.showInformationMessage("Please close all tabs for the new sort method to start working");
            openTabs = [];
        }
    }));
}
exports.activate = activate;