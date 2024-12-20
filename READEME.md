# AI Form HTML Extractor Chrome Extension

## Overview
This Chrome extension automatically detects, extracts, and modifies webpage forms using AI-powered assistance. It provides an interactive interface to view, edit, and replace form HTML dynamically.

## Features
- Automatically detect forms on a webpage
- Extract form HTML
- AI-powered form modification
- Manual HTML editing
- One-click form replacement

## Installation
1. Clone the repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the project directory

## Usage
1. Navigate to a webpage with a form
2. Click the extension icon
3. View the original form HTML
4. Click "Ask AI to Modify Form"
5. Review AI-suggested modifications
6. Click "Apply Modified Form" to replace the original form

## AI Providers

The extension now supports multiple AI providers:
- ChatGPT (Default)
- Moonshot AI
- Coze AI

### Switching AI Providers
You can switch between AI providers using the dropdown menu in the form extraction tool. The selected provider will be used for generating form improvements.

#### Current Providers
1. **ChatGPT**: Default provider, using GPT-4o-mini model for advanced form improvements.
2. **Moonshot AI**: Alternative provider with different AI capabilities.
3. **Coze AI**: Another alternative AI provider.

**Note:** Ensure you have valid API keys configured for the providers you wish to use.

## Environment Variables

To use the AI providers, you must set the following environment variables:

- `CHATGPT_API_KEY`: Your OpenAI API key
- `MOONSHOT_API_KEY`: Your Moonshot AI API key
- `COZE_API_KEY`: Your Coze AI API key
- `COZE_BOT_ID`: Your Coze AI Bot ID (optional, has a default)

### Setting Environment Variables

#### macOS/Linux
```bash
export CHATGPT_API_KEY='your_openai_api_key'
export MOONSHOT_API_KEY='your_moonshot_api_key'
export COZE_API_KEY='your_coze_api_key'
```

#### Windows (PowerShell)
```powershell
$env:CHATGPT_API_KEY='your_openai_api_key'
$env:MOONSHOT_API_KEY='your_moonshot_api_key'
$env:COZE_API_KEY='your_coze_api_key'
```

**Important:** Never commit API keys directly to your repository. Always use environment variables or secure secret management.

## Technologies
- JavaScript
- Chrome Extension API
- Coze AI API
- Moonshot AI API

## Configuration
Replace the Coze AI API key and Moonshot AI API key in [content.js](cci:7://file:///Users/event/Documents/git-files/Chrome-Plugins/ai-form-change/content.js:0:0-0:0) with your own API keys.

## License
MIT License

## Contributing
Pull requests are welcome. For major changes, please open an issue first.