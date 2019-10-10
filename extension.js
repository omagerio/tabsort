'use strict';
let openTabs = [];

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
function activate(context) {

    context.subscriptions.push(
        vscode_1.workspace.onDidCloseTextDocument(
            (editor) => {
                let position = openTabs.indexOf(editor.fileName.toLowerCase());
                if (position > -1) {
                    openTabs.splice(position, 1);
                }
            }
        )
    );

    context.subscriptions.push(vscode_1.window.onDidChangeActiveTextEditor((editor) => {
        if (editor != undefined) {
            let filename = editor._documentData._document.fileName.toLowerCase();
            if (openTabs.indexOf(filename) == -1) {
                openTabs.push(filename);
            }
            let newPosition = getNewTabPosition(filename);
            vscode_1.commands.executeCommand('moveActiveEditor', { to: "position", value: parseInt(newPosition) + 1 });
        }
    }));
}
exports.activate = activate;