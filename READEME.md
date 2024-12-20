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