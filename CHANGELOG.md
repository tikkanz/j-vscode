# Change Log
All notable changes to the J VSCode extension will be documented in this file.
## [0.9.0] - 2022-12-28
### Enhancement
- Streamlined terminal start behaviour
- Combined Execute Selection and Execute Line commands
### Fixed
- Fixed regression in advancing to next non-blank line
## [0.8.1] - 2022-12-27
### Fixed
- Fix multiline definition handling
- Tidy up build infrastructure

## [0.8.0] - 2022-12-27
### Chore
- Convert JavaScript to TypeScript
## [0.7.4] - 2021-04-26

### Fixed
- Sending text to J Windows Terminal

## [0.7.3] - 2021-04-19

### Fixed
- Clear Terminal cmdline before sending text to it
## [0.7.2] - 2021-02-12

### Added
- Highlight brackets again

## [0.7.1] - 2021-02-23

### Changed
- Fix to numeric highlighting

## [0.7.0] - 2020-12-11

### Changed
- Improved numeric highlighting
- Updated valid primitives for language changes

## [0.6.0] - 2020-11-20

### Added
- Handle Direct Definition with/without control info
- Key-binding to start JConsole terminal

### Changed
- The JConsole Terminal no longer automatically restarts
- Fixed closing of Direct Definition for nouns (J9.02)

## [0.5.2] - 2020-10-28

### Added
- Support for Direct Definition

### Changed
- Simplified reference to conjunctions : and . with or without modifiers 

## [0.5.1] - 2020-10-16

### Changed
- Fixed missing comment in language syntax definition
- Fixed toggling of multi-line comments
- Fixed auto-closing of single-quotes within comments and strings

## [0.5.0] - 2020-10-11
### Added
- Support for explicit string definitions
- Distinguished verb and adverb/conj explicit definitions

### Changed
- Fixed scope of single line strings
- Fixed capture of NB. at start of comment

## [0.4.0]
## [0.3.0]
- Narrow scope of keybindings so only apply to J files
- Use YAML grammar as reference

## [0.2.1]
- Minor change to highlighing and syntax file naming

## [0.2.0]
- Added support for J terminal/console

## [0.1.0]
- Added suggested additions for User Settings to highlight more language features

## [0.0.1] - 2018-01-31
- Initial release
- Added grammar for syntax highlighting

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.