# j

This [VS Code](https://code.visualstudio.com) extension provides support for the [j programming language](http://www.jsoftware.com/).

## Features

The extension currently provides syntax highlighting and an integrated J console.

![syntax highlighting](images/syntaxhilite.png)
>The above code snippet uses the Monokai color theme with some tweaks discussed below.

## Requirements

Getting the j (jprogramming) extension for VS Code to work involves two steps: 1.
Install VS Code, 2. Install the j extension.

In the VSCode extensions view, search for the term ``language-j`` in the marketplace
search box, then select the j extension and click the install button.
You might have to reload VS Code after this step.

To provide highlighting for some of the ``j``'s additional language features not commonly catered for in most color themes, a number of suggested additions for your User Settings are provided in the ``user_settings_j.json`` file. The colors used work well with the Monokai theme.

To provide the J console,  make an entry in User Settings pointing to the jconsole executable, for example: ``"j.executablePath": "/home/elmo/j901/bin/jconsole"`` or on Windows:
``"j.executablePath": ""C:\\Program Files\\j901\\bin\\jconsole.exe"``

## Integrated Terminal/Console

When an `.ijs` script is open, the J console should show in the terminal window. To send code to the terminal, click on the script window to give it focus, and use the following commands from the Command Palette. Note that if the line is the first line of an explicit definition, then the entire explicit definition will be run.

| Command Palette             | Description  |
|-----------------------------|--------------|
| J: Execute Line and Advance | Execute the line and advance to the next non-blank line |
| J: Execute Line             | Execute the line without advancing |
| J: Execute Selection        | Execute the selected text (must be a selection in a single line) |
| J: Load Script              | load the script file |
| J: Load and Display Script  | load the script file with display |


## Release Notes

See the [Change Log](CHANGELOG.md) for release notes.

-----------------------------------------------------------------------------------------------------------
