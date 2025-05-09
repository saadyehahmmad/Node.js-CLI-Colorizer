/**
 * Console Text Colorizer Library
 * 
 * A utility library for adding colors and styling to terminal output
 * with an object-oriented API for better developer experience.
 */
// ANSI color and style codes
const COLORS = {
  // Styles
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  
  // Text colors
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  
  // Background colors
  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m"
};

// Pre-defined themes
const THEMES = {
  default: {
    success: { color: 'green', style: null },
    error: { color: 'red', style: null },
    warning: { color: 'yellow', style: null },
    info: { color: 'cyan', style: null },
    debug: { color: 'magenta', style: null },
    prompt: { color: 'white', style: 'bright' }
  },
  dark: {
    success: { color: 'green', style: 'bright' },
    error: { color: 'red', style: 'bright' },
    warning: { color: 'yellow', style: 'bright' },
    info: { color: 'blue', style: 'bright' },
    debug: { color: 'magenta', style: 'dim' },
    prompt: { color: 'white', style: 'underscore' }
  },
  light: {
    success: { color: 'green', style: 'dim' },
    error: { color: 'red', style: 'dim' },
    warning: { color: 'yellow', style: 'dim' },
    info: { color: 'blue', style: 'dim' },
    debug: { color: 'magenta', style: 'dim' },
    prompt: { color: 'black', style: 'bright' }
  },
  minimal: {
    success: { color: 'green', style: null },
    error: { color: 'red', style: null },
    warning: { color: 'yellow', style: null },
    info: { color: 'white', style: null },
    debug: { color: 'white', style: 'dim' },
    prompt: { color: 'white', style: null }
  },
  vibrant: {
    success: { color: 'green', bgColor: 'bgBlack', style: 'bright' },
    error: { color: 'white', bgColor: 'bgRed', style: 'bright' },
    warning: { color: 'black', bgColor: 'bgYellow', style: null },
    info: { color: 'white', bgColor: 'bgBlue', style: 'bright' },
    debug: { color: 'white', bgColor: 'bgMagenta', style: null },
    prompt: { color: 'black', bgColor: 'bgCyan', style: 'bright' }
  }
};

/**
 * ColorizeLogger class for enhanced console output with colors
 */
class ColorizeLogger {
  /**
   * Creates a new ColorizeLogger instance
   * @param {Object} [options] - Configuration options
   * @param {string} [options.theme='default'] - Theme name or custom theme object
   * @param {boolean} [options.enabled=true] - Whether color output is enabled
   * @param {Object} [options.customTheme] - Custom theme definition
   */
  constructor(options = {}) {
    this.options = {
      theme: options.theme || 'default',
      enabled: options.enabled !== undefined ? options.enabled : true,
      customTheme: options.customTheme || null
    };
    
    // Set the theme
    this.setTheme(this.options.theme, this.options.customTheme);
  }

  /**
   * Sets the current theme
   * @param {string|Object} theme - Theme name or custom theme object
   * @param {Object} [customTheme] - Custom theme definition if theme is 'custom'
   * @returns {ColorizeLogger} The logger instance for chaining
   */
  setTheme(theme, customTheme = null) {
    if (typeof theme === 'string') {
      if (theme === 'custom' && customTheme) {
        this.theme = customTheme;
      } else if (THEMES[theme]) {
        this.theme = THEMES[theme];
      } else {
        this.theme = THEMES.default;
      }
    } else if (typeof theme === 'object' && theme !== null) {
      this.theme = theme;
    } else {
      this.theme = THEMES.default;
    }
    
    return this;
  }

  /**
   * Creates a custom theme
   * @param {string} name - Theme name
   * @param {Object} themeConfig - Theme configuration
   * @returns {ColorizeLogger} The logger instance for chaining
   */
  createTheme(name, themeConfig) {
    if (typeof name === 'string' && typeof themeConfig === 'object') {
      THEMES[name] = themeConfig;
    }
    
    return this;
  }
  
  /**
   * Enables or disables color output
   * @param {boolean} enabled - Whether color output is enabled
   * @returns {ColorizeLogger} The logger instance for chaining
   */
  setEnabled(enabled) {
    this.options.enabled = !!enabled;
    return this;
  }

  /**
   * Creates a styled message with the specified color
   * @param {string} text - The text to colorize
   * @param {string} color - The color to apply (from COLORS object)
   * @param {string} [bgColor] - Optional background color
   * @param {string} [style] - Optional text style
   * @returns {string} The styled text string
   */
  _colorize(text, color, bgColor, style) {
    if (!this.options.enabled) {
      return text;
    }
    
    let result = '';
    
    // Apply style if provided
    if (style && COLORS[style]) {
      result += COLORS[style];
    }
    
    // Apply background if provided
    if (bgColor && COLORS[bgColor]) {
      result += COLORS[bgColor];
    }
    
    // Apply text color
    if (color && COLORS[color]) {
      result += COLORS[color];
    }
    
    // Add the text and reset
    result += text + COLORS.reset;
    
    return result;
  }

  /**
   * Logs a colorized message to the console
   * @param {string} text - The text to log
   * @param {string} color - The color to apply
   * @param {string} [bgColor] - Optional background color
   * @param {string} [style] - Optional text style
   * @returns {ColorizeLogger} The logger instance for chaining
   */
  log(text, color, bgColor, style) {
    console.log(this._colorize(text, color, bgColor, style));
    return this;
  }

  /**
   * Logs a success message based on theme
   * @param {string} text - The text to log
   * @param {string} [customStyle] - Optional style override
   * @returns {ColorizeLogger} The logger instance for chaining
   */
  success(text, customStyle) {
    const { color, bgColor, style } = this.theme.success;
    this.log(text, color, bgColor, customStyle || style);
    return this;
  }

  /**
   * Logs an error message based on theme
   * @param {string} text - The text to log
   * @param {string} [customStyle] - Optional style override
   * @returns {ColorizeLogger} The logger instance for chaining
   */
  error(text, customStyle) {
    const { color, bgColor, style } = this.theme.error;
    this.log(text, color, bgColor, customStyle || style);
    return this;
  }

  /**
   * Logs a warning message based on theme
   * @param {string} text - The text to log
   * @param {string} [customStyle] - Optional style override
   * @returns {ColorizeLogger} The logger instance for chaining
   */
  warning(text, customStyle) {
    const { color, bgColor, style } = this.theme.warning;
    this.log(text, color, bgColor, customStyle || style);
    return this;
  }

  /**
   * Logs an info message based on theme
   * @param {string} text - The text to log
   * @param {string} [customStyle] - Optional style override
   * @returns {ColorizeLogger} The logger instance for chaining
   */
  info(text, customStyle) {
    const { color, bgColor, style } = this.theme.info;
    this.log(text, color, bgColor, customStyle || style);
    return this;
  }

  /**
   * Logs a debug message based on theme
   * @param {string} text - The text to log
   * @param {string} [customStyle] - Optional style override
   * @returns {ColorizeLogger} The logger instance for chaining
   */
  debug(text, customStyle) {
    const { color, bgColor, style } = this.theme.debug;
    this.log(text, color, bgColor, customStyle || style);
    return this;
  }

  /**
   * Creates a table with colorized headers
   * @param {Object} data - The data to display in table
   * @param {string} [title] - Optional table title
   * @returns {ColorizeLogger} The logger instance for chaining
   */
  table(data, title) {
    if (!data || typeof data !== 'object') {
      this.error('Invalid data for table display');
      return this;
    }
    
    if (title) {
      this.info(title);
    }
    
    console.table(data);
    return this;
  }

  /**
   * Colorizes text without logging it (for custom usage)
   * @param {string} text - The text to colorize
   * @param {string} color - The color to apply
   * @param {string} [bgColor] - Optional background color
   * @param {string} [style] - Optional text style
   * @returns {string} The colorized text
   */
  format(text, color, bgColor, style) {
    return this._colorize(text, color, bgColor, style);
  }

  /**
   * Formats prompt text according to the current theme
   * @param {string} text - The prompt text to format
   * @returns {string} - The formatted prompt text 
   */
  formatPrompt(text) {
    const { color, bgColor, style } = this.theme.prompt;
    return this.format(text, color, bgColor, style);
  }
}

// Create a singleton instance with the default theme
const logger = new ColorizeLogger();

// Export both the class (for potential extension) and the singleton instance
module.exports = {
  ColorizeLogger,
  logger,
  COLORS,
  THEMES
};

// Also export individual colors for backward compatibility
Object.entries(COLORS).forEach(([key, value]) => {
  module.exports[key] = value;
});
