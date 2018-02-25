// extension

const vscode = require('vscode');

let terminal;

// ---------------------------------------------------------------------
function activate(context) {
 const config = vscode.workspace.getConfiguration('j');
 const terminalName = 'J console';
 const terminalCmd = config.executablePath;

 const createTerminal = () => {
  terminal = vscode.window.createTerminal(terminalName, terminalCmd);
  terminal.show();
 };

 createTerminal();

 let cmd;
 cmd = vscode.commands.registerTextEditorCommand('extension.ctrlE', ctrlE);
 context.subscriptions.push(cmd);
 cmd = vscode.commands.registerTextEditorCommand('extension.ctrlL', ctrlL);
 context.subscriptions.push(cmd);
 cmd = vscode.commands.registerTextEditorCommand('extension.ctrlshiftL', ctrlshiftL);
 context.subscriptions.push(cmd);
 cmd = vscode.commands.registerTextEditorCommand('extension.ctrlR', ctrlR);
 context.subscriptions.push(cmd);
 cmd = vscode.commands.registerTextEditorCommand('extension.ctrlEnter', ctrlEnter);
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
