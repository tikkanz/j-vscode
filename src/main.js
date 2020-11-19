// language-j

const vscode = require('vscode');

let terminal;

// ---------------------------------------------------------------------
function activate(context) {
 const config = vscode.workspace.getConfiguration('j');
 const terminalName = 'Jconsole';
 const terminalCmd = config.executablePath;

 const createTerminal = () => {
  terminal = vscode.window.createTerminal(terminalName, terminalCmd);
  terminal.show();
 };

 createTerminal();

 let cmd;
 cmd = vscode.commands.registerTextEditorCommand('language-j.executeSelection', executeSelection);
 context.subscriptions.push(cmd);
 cmd = vscode.commands.registerTextEditorCommand('language-j.loadScript', loadScript);
 context.subscriptions.push(cmd);
 cmd = vscode.commands.registerTextEditorCommand('language-j.loadDisplayScript', loadDisplayScript);
 context.subscriptions.push(cmd);
 cmd = vscode.commands.registerTextEditorCommand('language-j.executeLine', executeLine);
 context.subscriptions.push(cmd);
 cmd = vscode.commands.registerTextEditorCommand('language-j.executeLineAdvance', executeLineAdvance);
 context.subscriptions.push(cmd); 
 cmd = vscode.commands.registerTextEditorCommand('language-j.createTerminal', createTerminal);
 context.subscriptions.push(cmd);

}

function deactivate() {
 if (terminal) {
  terminal.dispose();
 }
}

// ---------------------------------------------------------------------
exports.activate = activate;
exports.deactivate = deactivate;
