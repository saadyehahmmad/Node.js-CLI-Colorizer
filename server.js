/*
                                                                            
                                                               ,,           
`7MM"""YMM                                                   `7MM           
  MM    `7                                                     MM           
  MM   d    `7M'   `MF' ,6"Yb.  `7MMpMMMb.pMMMb.  `7MMpdMAo.   MM   .gP"Ya  
  MMmmMM      `VA ,V'  8/   MM    MM    MM    MM    MM   `Wb   MM  ,M'   Yb 
  MM   Y  ,     XMX     ,pm9MM    MM    MM    MM    MM    M8   MM  8M"""""" 
  MM     ,M   ,V' VA.  8M   MM    MM    MM    MM    MM   ,AP   MM  YM.    , 
.JMMmmmmMMM .AM.   .MA.`Moo9^Yo..JMML  JMML  JMML.  MMbmmd'  .JMML. `Mbmmd' 
                                                    MM                      
                                                  .JMML.                    
*/

/**
 * Professional User Information Collection CLI
 * 
 * This application demonstrates the ColorizeLogger library capabilities
 * through an interactive command-line interface that collects and validates
 * user information with proper error handling and visual feedback.
 * 
 * @author Ahmad Sadieh
 * @version 1.0.0
 */

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { logger, ColorizeLogger, THEMES } = require('./colorize');

// Configuration
const config = {
  theme: process.env.THEME || 'light',
  showDebug: process.env.DEBUG === 'true',
  fields: [
    { 
      name: 'Name', 
      prompt: 'What is your full name?',
      validation: (value) => value.trim().length >= 2 ? true : 'Name must be at least 2 characters long'
    },
    { 
      name: 'Age', 
      prompt: 'How old are you?',
      validation: (value) => {
        const age = Number(value);
        if (isNaN(age)) return 'Age must be a number';
        if (age <= 0) return 'Age must be positive';
        if (!Number.isInteger(age)) return 'Age must be a whole number';
        if (age > 120) return 'Please enter a realistic age';
        return true;
      }
    },
    { 
      name: 'Email', 
      prompt: 'What is your email address?',
      validation: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? true : 'Please enter a valid email address';
      }
    },
    { 
      name: 'Major', 
      prompt: 'What is your field of study or profession?',
      validation: (value) => value.trim().length > 0 ? true : 'Field cannot be empty'
    }
  ]
};

// Set the theme based on configuration
logger.setTheme(config.theme);

// Debug logger with different theme for system messages
const debugLogger = new ColorizeLogger({ theme: 'minimal' });

/**
 * Creates a readline interface wrapped with Promise functionality
 * @returns {Object} Enhanced readline interface with question method that returns a Promise
 */
function createInterface() {
  const rl = readline.createInterface({ input, output });
  
  // Wrap the question method to return a Promise
  const question = (query) => {
    return new Promise((resolve) => {
      rl.question(query, (answer) => {
        resolve(answer.trim());
      });
    });
  };
  
  return {
    question,
    close: () => rl.close()
  };
}

/**
 * Validates user input based on field configuration
 * @param {Object} field - The field configuration object
 * @param {string} value - The value to validate
 * @returns {Object} Object containing isValid flag and error message if applicable
 */
function validateInput(field, value) {
  if (!field.validation) {
    return { isValid: true };
  }
  
  const result = field.validation(value);
  
  if (result === true) {
    return { isValid: true };
  } else {
    return { isValid: false, error: result || `Invalid ${field.name}` };
  }
}

/**
 * Collects user information with validation
 * @param {Object} rl - The readline interface
 * @param {Object} field - The field configuration object
 * @returns {Promise<string>} The validated user input
 */
async function collectField(rl, field) {
  let isValid = false;
  let value = '';
  let attempts = 0;
  
  // Format the prompt with field name and instructions
  const formattedPrompt = `${field.prompt}\n> `;
  
  while (!isValid) {
    attempts++;
    
    // Add a retry message after first attempt
    const promptText = attempts > 1 
      ? `${logger.format('Please try again. ', 'yellow')}${formattedPrompt}` 
      : formattedPrompt;
    
    // Use theme-aware prompt formatting
    value = await rl.question(logger.formatPrompt(promptText));
    
    if (config.showDebug) {
      debugLogger.debug(`Field: ${field.name}, Value: "${value}", Attempt: ${attempts}`);
    }
    
    const validation = validateInput(field, value);
    
    if (validation.isValid) {
      isValid = true;
    } else {
      logger.error(validation.error);
    }
  }
  
  return value;
}

/**
 * Displays a welcome banner with application information
 */
function displayWelcomeBanner() {
  console.clear(); // Clear the console for a clean start
  
  logger
    .info('======================================')
    .info('       USER INFORMATION SYSTEM        ', 'bright')
    .info('======================================')
    .info('')
    .info('This application will collect some basic')
    .info('information about you. Please answer the')
    .info('following questions accurately.')
    .info('')
    .info('Theme: ' + logger.format(config.theme, 'yellow'))
    .info('======================================')
    .info('');
}

/**
 * Main application function
 */
async function main() {
  const rl = createInterface();
  const information = {};
  
  try {
    // Display welcome banner
    displayWelcomeBanner();
    
    // Start the data collection process
    logger.info('Starting data collection process...', 'bright');
    
    // Track start time for performance logging
    const startTime = Date.now();
    
    // Collect information for each configured field
    for (const field of config.fields) {
      logger.info(`\n[${field.name}]`, 'underscore');
      information[field.name] = await collectField(rl, field);
      logger.success(`✓ ${field.name} recorded successfully.`);
    }
    
    // Calculate and log completion time
    const completionTime = ((Date.now() - startTime) / 1000).toFixed(2);
    if (config.showDebug) {
      debugLogger.debug(`Data collection completed in ${completionTime} seconds`);
    }
    
    // Display thank you message
    logger
      .info('')
      .info('======================================')
      .success('       INFORMATION COMPLETE!       ', 'bright')
      .info('======================================')
      .info('')
      .info('Thank you for providing your information.');
    
    // Display collected information with a title
    logger.table(information, 'Summary of collected information:');
    
    // Show next steps
    logger
      .info('')
      .info('Next steps:')
      .success(' • Your information has been recorded')
      .info(' • You will receive a confirmation email')
      .info(' • Contact support if you need assistance')
      .info('');
    
  } catch (error) {
    logger.error(`An error occurred: ${error.message}`);
    if (config.showDebug) {
      debugLogger.debug(`Stack trace: ${error.stack}`);
    }
  } finally {
    rl.close();
  }
}

// Start the application with proper error handling
main().catch(error => {
  logger.error(`Unhandled error: ${error.message}`);
  process.exit(1);
});


  

