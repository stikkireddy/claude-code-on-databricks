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
- `transformers[].options.debug`: Set to `true` for transformer-specific debugging

### About the Transformer Script

The `databricks-claude-transformers.js` script is a custom transformer that adapts Claude Code requests to work with Databricks serving endpoints. It handles:

- Request format conversion between Claude and Databricks
- Proper handling of image URLs in multimodal requests
- Logging for debugging purposes

#### Request Transformation Process

The transformer performs several important modifications to ensure compatibility between Claude Code and Databricks serving endpoints:

1. **URL Construction**: Uses the provider's API base URL to target the correct Databricks serving endpoint

2. **Message Content Handling**:
   - Converts empty string content to `null` for tool calls compatibility
   - Processes message arrays to ensure proper formatting
   - Removes `cache_control` properties from messages

3. **Image URL Processing**: Transforms image URLs to ensure proper base64 encoding format for multimodal requests

4. **Request Cleanup**: Removes unnecessary properties like `parallel_tool_calls` that might cause issues with the Databricks API

These transformations ensure that Claude Code requests are properly formatted for the Databricks serving endpoint, allowing seamless integration between the two systems.

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
    "transformers": [
        {
          "path": "/Users/<username>/.claude-code-router/plugins/databricks-claude-transformers.js",
          "options": {
            "debug": true
          }
        }
    ],
    ...
    "Router": {
      "default": "databricks,databricks-claude-sonnet-4"
    }
}
```

Logs will be displayed in the terminal where you run the Claude Code Router. For transformer-specific logs, they will appear in the same terminal output when the transformer script is executed during API calls.

## Usage

After configuration, you can use Claude Code with your Databricks setup through the router:

```bash
ccr code
```

## API Rate Limits

Databricks serving endpoints have default rate limits that may affect your usage of Claude Code. These limits include:

- Requests per minute (RPM) limits
- Maximum concurrent requests
- Maximum tokens per request

If you encounter rate limit errors or need higher throughput for your Claude Code usage, please contact your Databricks account team to discuss increasing these limits. They can help adjust your serving endpoint configuration based on your specific needs and usage patterns.

Typical rate limit errors will appear as HTTP 429 responses or may be indicated in the Claude Code Router logs when debugging is enabled.
