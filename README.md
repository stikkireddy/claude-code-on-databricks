# claude-code-on-databricks
Running Claude Code natively on Databricks using Claude Code Router

## Table of Contents
- [Prerequisites](#prerequisites)
  - [Install NVM using Homebrew](#install-nvm-using-homebrew)
  - [Set up NVM path](#set-up-nvm-path)
- [Installation](#installation)
  - [Install Claude Code](#install-claude-code)
  - [Update Claude Code](#update-claude-code)
  - [Install Claude Code Router](#install-claude-code-router)
- [Configuration](#configuration)
- [Debugging](#debugging)
- [Usage](#usage)

## Prerequisites

### Install NVM using Homebrew
```bash
brew install nvm
```

### Set up NVM path
Add the following to your shell profile (`~/.zshrc` or `~/.bash_profile`):
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/share/nvm/nvm.sh" ] && \. "/opt/homebrew/share/nvm/nvm.sh"
[ -s "/opt/homebrew/share/nvm/bash_completion" ] && \. "/opt/homebrew/share/nvm/bash_completion"
```

Reload your shell:
```bash
source ~/.zshrc  # or source ~/.bash_profile
```

## Installation

### Install Claude Code
```bash
npm install -g @anthropics/claude-code
```

### Update Claude Code
To update Claude Code to the latest version:
```bash
npm update -g @anthropics/claude-code
```

### Install Claude Code Router
```bash
npm install -g @musistudio/claude-code-router
```

## Configuration

1. Create the plugins directory for Claude Code Router:
```bash
mkdir -p ~/.claude-code-router/plugins
```

2. Copy the transformer script to the plugins directory:
```bash
cp databricks-claude-transformers.js ~/.claude-code-router/plugins/
```

3. Copy the configuration file to the Claude Code Router directory:
```bash
cp config.json ~/.claude-code-router/config.json
```

4. Edit the configuration file and fill in your Databricks details:
```bash
nano ~/.claude-code-router/config.json
```

Replace the following placeholders:
- `<username>`: Your system username
- `<workspace-url>`: Your Databricks workspace URL
- `<databricks-api-key>`: Your Databricks API key

You can also configure debugging options in this file:
- `LOG`: Set to `true` to enable logging
- `LOG_LEVEL`: Set to `debug` for detailed logs
- `Router.options.debug`: Set to `true` for router debugging

### About the Transformer Script

The `databricks-claude-transformers.js` script is a custom transformer that adapts Claude Code requests to work with Databricks serving endpoints. It handles:

- Request format conversion between Claude and Databricks
- Proper handling of image URLs in multimodal requests
- Logging for debugging purposes

This transformer is referenced in the `config.json` file under the `transformers` section:

```json
"transformers": [
    {
      "path": "/Users/<username>/.claude-code-router/plugins/databricks-claude-transformers.js"
    }
]
```

## Debugging

To enable debugging for Claude Code Router:

1. When copying the configuration file, set the debug options:
```bash
cp config.json ~/.claude-code-router/config.json
```

2. Edit the configuration file to enable logging:
```bash
nano ~/.claude-code-router/config.json
```

3. Update the following settings:
```json
{
    "LOG": true,
    "LOG_LEVEL": "debug",
    ...
    "Router": {
      "default": "databricks,databricks-claude-sonnet-4",
      "options": {
        "debug": true
      }
    }
}
```

Logs will be displayed in the terminal where you run the Claude Code Router. For transformer-specific logs, they will appear in the same terminal output when the transformer script is executed during API calls.

## Usage

After configuration, you can use Claude Code with your Databricks setup through the router:

```bash
ccr code
```
