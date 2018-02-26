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
 cmd = vscode.commands.registerTextEditorCommand('language-j.ctrlE', ctrlE);
 context.subscriptions.push(cmd);
 cmd = vscode.commands.registerTextEditorCommand('language-j.ctrlL', ctrlL);
 context.subscriptions.push(cmd);
 cmd = vscode.commands.registerTextEditorCommand('language-j.ctrlshiftL', ctrlshiftL);
 context.subscriptions.push(cmd);
 cmd = vscode.commands.registerTextEditorCommand('language-j.ctrlR', ctrlR);
 context.subscriptions.push(cmd);
 cmd = vscode.commands.registerTextEditorCommand('language-j.ctrlEnter', ctrlEnter);
 context.subscriptions.push(cmd);

 vscode.window.onDidCloseTerminal((event) => {
  if (terminal && event.name === terminalName) {
   createTerminal();
  }
 });
}

// ---------------------------------------------------------------------
function deactivate() {
 if (terminal) {
  terminal.dispose();
 }
}

// ---------------------------------------------------------------------
exports.activate = activate;
exports.deactivate = deactivate;
