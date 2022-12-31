# J VS Code extension

This [VS Code] extension provides support for the [J programming language].

## Features

The extension currently provides syntax highlighting and interaction with the Jconsole.

![syntax highlighting](images/syntaxhilite.png)
>The above code snippet uses the Monokai color theme with some tweaks discussed below.

## Requirements

Install the J extension from Extensions Marketplace within VS Code or from the [VS Code Marketplace].
In the VS Code extensions view, search for ``j`` or ``language-j`` in the marketplace
search box.

To integrate with your installed Jconsole, make an entry for ``j.executablePath`` in VS Code User Settings (`Ctrl`+`,`) that points to the Jconsole executable, for example: ``"j.executablePath": "/home/elmo/j901/bin/jconsole"`` or on Windows:
``"j.executablePath": ""C:\\Program Files\\j901\\bin\\jconsole.exe"``

To distinguish some of the J's additional language features (e.g. verbs, adverbs, conjunctions) that are not commonly catered for in color themes, a number of suggested additions for your User Settings are provided in the ``user_settings_j.json`` file. The colors used were chosen to work with the Monokai theme.

## Integrated Terminal/Console

When one of the ``Execute`` or ``Load`` J commands from the Command Palette (see table) is run from an `.ijs` script, the command will be executed in the most recently active Jconsole terminal. If no Jconsole terminal is currently running, then a new one will be created first.

When an ``Execute`` command is run and there is no selection, then if the line the cursor is on is the first line of a multi-line definition (explicit or direct definition) the entire multi-line definition will be run. Otherwise just the entire line will be executed in the terminal. If there is a selection (within a line or over multiple lines), then the selected text will be executed in the terminal.

When a ``Load Script`` command is run, the script will be saved to disk prior to loading it in the terminal.

| Command Palette                      | Description                                    |
| ------------------------------------ | ---------------------------------------------- |
| J: Execute Line/Selecton and Advance | Execute and advance to the next non-blank line |
| J: Execute Line/Selection            | Execute without advancing                      |
| J: Load Script                       | load the script file                           |
| J: Load and Display Script           | load the script file with display              |
| J: Create JConsole Terminal          | Manually start a new Jconsole terminal         |


## Release Notes

See the [Change Log](CHANGELOG.md) for release notes.

-----------------------------------------------------------------------------------------------------------
[VS Code]: (https://code.visualstudio.com)
[J programming language]: https://www.jsoftware.com
[VS Code Marketplace]: https://marketplace.visualstudio.com/items?itemName=tikkanz.language-j
