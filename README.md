# AI Form Change Chrome Extension

## Overview

AI Form Change is an innovative Chrome extension that leverages AI to help users improve and modify web forms dynamically. The extension adds an intelligent layer to existing web forms, providing suggestions and potential improvements.

## Features

- 🤖 Three AI Windows
  - Tom: Left Window (Always Visible)
  - Jack: Middle Window (Toggleable)
  - AI Navigator: Right Window (Dynamic Area-Based)
- 🔍 Automatic Form Detection
- 💡 Intelligent Form Modification
- 🌐 Works on Any Webpage

## Windows Management

### Tom (Left Window)
- Always visible
- Provides primary AI assistance

### Jack (Middle Window)
- Hidden by default
- Can be toggled using `toggleEnhancedFloatingTextarea()` in browser console

### AI Navigator (Right Window)
- Dynamically moves with mouse position
- Tracks different screen areas
- Provides context-aware navigation

## Installation

### From Source

1. Clone the repository
   ```bash
   git clone https://github.com/guomengtao/ai-form-change.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in the top right)

4. Click "Load unpacked" and select the `ai-form-change` directory

## Usage

1. Navigate to any webpage with forms
2. The extension automatically detects forms
3. Interact with Tom, Jack, and AI Navigator windows

## Advanced Usage

### Toggling Jack Window
Open browser console and run:
```javascript
toggleEnhancedFloatingTextarea()
```

## Development

### Prerequisites

- Node.js
- Chrome Browser

### Setup

```bash
npm install
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Project Link: [https://github.com/guomengtao/ai-form-change](https://github.com/guomengtao/ai-form-change)

---

**Note**: This is a prototype extension. Future versions will include more advanced AI capabilities.
