# Node.js CLI Colorizer

A powerful and customizable library for enhancing command-line interfaces with colorful, styled text output in Node.js applications.

![image](https://github.com/user-attachments/assets/c75ab977-d173-47f6-a3c4-475a5a45d039)
![image](https://github.com/user-attachments/assets/77ba1efd-6bae-4447-aa4f-5314848e46d7)



## Features

- 🎨 **Theme Support**: Multiple built-in themes with easy customization
- 🔄 **Method Chaining**: Fluent API for concise and readable code
- 🧩 **Modular Design**: Use as a singleton or create multiple instances
- 📝 **Semantic Logging**: Express intent with semantic methods (error, warning, success)
- 🔌 **Easy Integration**: Simple drop-in enhancement for existing applications
- 📊 **Enhanced Tables**: Display data tables with styled headers
- 🔧 **Customizable**: Create and apply custom themes to match your application style

## Installation

Simply include the `colorize.js` file in your project:

```bash
# No npm installation required! Just clone or download this repository
git clone https://github.com/saadyehammad/nodejs-cli-colorizer.git
```

## Quick Start

```javascript
// Import the pre-configured logger instance
const { logger } = require('./colorize');

// Use semantic logging methods
logger.success('Operation completed successfully!');
logger.error('Something went wrong');
logger.warning('This might be a problem');
logger.info('Just FYI');
logger.debug('Debug information');

// Display tables with titles
logger.table({ name: 'John', age: 30 }, 'User Details');

// Chain methods for compact code
logger
  .info('Processing started')
  .success('Step 1 completed')
  .success('Step 2 completed')
  .info('All steps finished');
```

## Themes

The library comes with several built-in themes:

- **default**: Standard colors with clear distinction
- **dark**: Brighter colors for dark terminals
- **light**: Dimmed colors for light backgrounds
- **minimal**: Simple, minimal styling
- **vibrant**: High-contrast with background colors

```javascript
// Change theme globally
logger.setTheme('vibrant');

// Or create a new logger with a specific theme
const darkLogger = new ColorizeLogger({ theme: 'dark' });
```

## Custom Themes

You can create your own custom themes:

```javascript
const { logger, ColorizeLogger } = require('./colorize');

// Define a custom theme
const myTheme = {
  success: { color: 'green', bgColor: 'bgBlack', style: 'bright' },
  error: { color: 'white', bgColor: 'bgRed', style: 'bright' },
  warning: { color: 'black', bgColor: 'bgYellow', style: null },
  info: { color: 'blue', style: 'underscore' },
  debug: { color: 'magenta', style: 'dim' },
  prompt: { color: 'cyan', style: 'bright' }
};

// Method 1: Apply to the global logger
logger.setTheme('custom', myTheme);

// Method 2: Register a named theme
logger.createTheme('awesome', myTheme);
logger.setTheme('awesome');

// Method 3: Create a new instance with the custom theme
const customLogger = new ColorizeLogger({
  theme: 'custom',
  customTheme: myTheme
});
```

## Advanced Usage

### Creating Multiple Loggers

```javascript
const { ColorizeLogger } = require('./colorize');

// Create specialized loggers for different parts of your application
const systemLogger = new ColorizeLogger({ theme: 'minimal' });
const userLogger = new ColorizeLogger({ theme: 'vibrant' });

systemLogger.info('System starting up...');
userLogger.success('User logged in successfully');
```

### Disabling Colors

```javascript
// Disable colors for certain environments
if (process.env.NO_COLOR) {
  logger.setEnabled(false);
}

// Or create a non-colored logger
const plainLogger = new ColorizeLogger({ enabled: false });
```

### Custom Formatting

```javascript
// Format text without logging it
const errorText = logger.format('Error:', 'red', null, 'bright');
console.log(`${errorText} Something went wrong with the process`);

// Format prompts using the theme's prompt style
const prompt = logger.formatPrompt('Enter your name: ');
```

## API Reference

### ColorizeLogger Class

#### Constructor

```javascript
const logger = new ColorizeLogger(options);
```

Options:
- `theme`: Theme name or theme object (default: 'default')
- `enabled`: Whether colors are enabled (default: true)
- `customTheme`: Custom theme definition when using 'custom' theme

#### Methods

| Method | Description |
|--------|-------------|
| `log(text, color, bgColor, style)` | Log text with specific styling |
| `success(text, [style])` | Log success message |
| `error(text, [style])` | Log error message |
| `warning(text, [style])` | Log warning message |
| `info(text, [style])` | Log info message |
| `debug(text, [style])` | Log debug message |
| `table(data, [title])` | Display data in a table with optional title |
| `format(text, color, bgColor, style)` | Format text without logging |
| `formatPrompt(text)` | Format text using theme's prompt style |
| `setTheme(theme, [customTheme])` | Set the active theme |
| `createTheme(name, themeConfig)` | Create a new named theme |
| `setEnabled(enabled)` | Enable or disable color output |

## Example Project - User Information Collection CLI

This repository includes a sample application demonstrating the usage of the ColorizeLogger library in a real-world scenario.

### Running the Example

```bash
node server.js
```

### Features of the Example

- User information collection with validation
- Colorful and styled prompts and responses
- Theme-aware formatting
- Proper error handling
- Table display of collected data

## License

MIT

## Contributing

Contributions welcome! Please feel free to submit a Pull Request. 
