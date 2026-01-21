# Em Dash Replace

A simple Obsidian plugin that automatically replaces double dashes (` --`) with em dashes (`—`) as you type.

## Features

- Automatically converts ` --` to `—` when typing
- Respects code blocks and inline code (won't replace dashes inside code)
- Works on desktop and mobile

## Manual Installation

1. Download `main.js`, `manifest.json`, and `styles.css` (if present) from the latest release
2. Copy them to `<Vault>/.obsidian/plugins/em-dash-replace/`
3. Reload Obsidian and enable the plugin in Settings → Community plugins

## Usage

Simply type ` --` (space followed by two dashes) and it will automatically be replaced with an em dash (`—`).

The plugin will not replace dashes inside code blocks or inline code to preserve your code formatting.

## Development

```bash
npm install
npm run dev
```