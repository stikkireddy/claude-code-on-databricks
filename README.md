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
  - [Install OpenCode](#install-opencode-alternative-interface)
- [Configuration](#configuration)
  - [Using Different Anthropic Models](#using-different-anthropic-models)
- [Debugging](#debugging)
- [Usage](#usage)
  - [Using Claude Code CLI](#using-claude-code-cli)
  - [Using OpenCode](#using-opencode)
- [License](#license)
- [API Rate Limits](#api-rate-limits)

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
npm install -g @anthropic-ai/claude-code
```

### Update Claude Code
To update Claude Code to the latest version:
```bash
npm install -g @anthropic-ai/claude-code
```

### Install Claude Code Router
```bash
npm install -g @musistudio/claude-code-router
```

Claude Code Router is an open-source project available on GitHub under the MIT license: [https://github.com/musistudio/claude-code-router](https://github.com/musistudio/claude-code-router)

### Install OpenCode (Alternative Interface)

OpenCode is an alternative interface for Claude Code that provides a VSCode-like experience:

```bash
npm install -g opencode-ai@latest
```

OpenCode is an open-source project available on GitHub under the MIT license: [https://github.com/sst/opencode](https://github.com/sst/opencode)

After installation, copy the OpenCode configuration file to the appropriate directory:

```bash
mkdir -p ~/.config/opencode
cp opencode/opencode.jsonc ~/.config/opencode/opencode.jsonc
```

Note: Template configuration files are available in the `opencode/` folder of this repository.

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
cp claude_code/config.json ~/.claude-code-router/config.json
```

Note: Template configuration files are available in the `claude_code/` folder of this repository.

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

### Using Different Anthropic Models

You can configure both Claude Code Router and OpenCode to use different Anthropic models provided by Databricks:

#### For Claude Code Router

Edit the `claude_code/config.json` file to update the model name and router default:

```json
{
  // Other configuration...
  "Providers": [
    {
      "name": "databricks",
      "models": [
        "databricks-claude-sonnet-4"  // Change to your desired model
      ],
      // Other provider settings...
    }
  ],
  "Router": {
    "default": "databricks,databricks-claude-sonnet-4"  // Update both parts
  }
}
```

#### For OpenCode

Edit the `opencode/opencode.jsonc` file to update the model name:

```json
{
  // Other configuration...
  "provider": {
    "anthropic": {
      // Other settings...
      "models": {
        "databricks-claude-3-7-sonnet": {  // Change key and name to your desired model
          "name": "databricks-claude-3-7-sonnet"  // e.g., databricks-claude-opus or databricks-claude-sonnet-4
        }
      }
    }
  }
}
```

Common Databricks model names include:
- `databricks-claude-sonnet-4`
- `databricks-claude-3-7-sonnet`
- `databricks-claude-opus`

Ensure that your Databricks serving endpoint is configured with the corresponding model.

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

### Using Claude Code CLI

After configuration, you can use Claude Code CLI with your Databricks setup through the router:

```bash
ccr code
```

### Using OpenCode

To use OpenCode with Claude Code Router:

1. Start Claude Code Router in one terminal:

```bash
ccr start
```

2. In a separate terminal, start OpenCode:

```bash
opencode
```

3. Once OpenCode is running, use the `/models` command in the OpenCode interface and select the appropriate `databricks-*` model from the list.

This setup allows you to use the VSCode-like OpenCode interface while routing requests through Claude Code Router to your Databricks serving endpoint.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## API Rate Limits

Databricks serving endpoints have default rate limits that may affect your usage of Claude Code. These limits include:

- Requests per minute (RPM) limits
- Maximum concurrent requests
- Maximum tokens per request

If you encounter rate limit errors or need higher throughput for your Claude Code usage, please contact your Databricks account team to discuss increasing these limits. They can help adjust your serving endpoint configuration based on your specific needs and usage patterns.

Typical rate limit errors will appear as HTTP 429 responses or may be indicated in the Claude Code Router logs when debugging is enabled.
