"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const service_1 = require("./service");
const components_1 = require("./config/components");
const components = [];
Object.keys(components_1.default).forEach((item) => {
    components.push(Object.assign(Object.assign({}, components_1.default[item]), { path: item }));
});
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "bview-helper" is now active!');
    let app = new service_1.Service();
    app.setConfig();
    let completionItemProvider = new service_1.BviewCompletionItemProvider();
    // let registration = vscode.workspace.registerTextDocumentContentProvider('bview-helper', docs);
    let completion = vscode.languages.registerCompletionItemProvider([
        {
            language: 'vue',
            scheme: 'file',
        },
        {
            language: 'html',
            scheme: 'file',
        },
    ], completionItemProvider, '', ' ', ':', '<', '"', "'", '/', '@', '(');
    let vueLanguageConfig = vscode.languages.setLanguageConfiguration('vue', {
        wordPattern: app.WORD_REG,
    });
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.bview-helper', () => {
        // The code you place here will be executed every time your command is executed
        switch (vscode.window.activeTextEditor.document.languageId) {
            case 'vue':
            case 'html':
                break;
            default:
                return;
        }
        const selection = app.getSeletedText();
        let items = components.map((item) => {
            return {
                label: item.tag,
                detail: item.title.toLocaleLowerCase() + ' ' + item.subtitle,
                path: item.path,
                description: item.type,
            };
        });
        if (items.length < 1) {
            vscode.window.showInformationMessage('Initializing。。。, please try again.');
            return;
        }
        let find = items.filter((item) => item.label === selection);
        if (find.length) {
            app.openDocs(find[0], find[0].label);
            return;
        }
        // cant set default value for this method? angry.
        vscode.window.showQuickPick(items).then((selected) => {
            selected && app.openDocs(selected, selected.label);
        });
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from bview-helper!');
    });
    context.subscriptions.push(app, disposable, completion, vueLanguageConfig);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map