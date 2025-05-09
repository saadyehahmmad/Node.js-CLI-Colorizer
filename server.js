
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { logger } = require('./colorize'); // Import the logger instance
// Uncomment to use a different theme
logger.setTheme('light'); // Try: 'default', 'dark', 'light', 'vibrant'

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
 * Validates user input based on field type
 * @param {string} field - The field being validated
 * @param {string} value - The value to validate
 * @returns {Object} Object containing isValid flag and error message if applicable
 */
function validateInput(field, value) {
  if (!value) {
    return { isValid: false, error: `${field} cannot be empty.` };
  }
  
  switch (field) {
    case 'Age':
      const age = Number(value);
      if (isNaN(age) || age <= 0 || !Number.isInteger(age)) {
        return { isValid: false, error: 'Age must be a positive integer.' };
      }
      break;
  }
  
  return { isValid: true };
}

/**
 * Collects user information with validation
 * @param {Object} rl - The readline interface
 * @param {string} field - The field to collect
 * @param {string} prompt - The prompt message
 * @returns {Promise<string>} The validated user input
 */
async function collectField(rl, field, prompt) {
  let isValid = false;
  let value = '';
  
  while (!isValid) {
    // Use theme-aware prompt formatting
    value = await rl.question(logger.formatPrompt(prompt));
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
 * Main application function
 */
async function main() {
  const rl = createInterface();
  const information = {};
  
  try {
    // Display welcome message with chained method calls
    logger
      .info('==============================')
      .info('  User Information Collection  ', 'bright')
      .info('==============================');
    
    // Collect user information with proper validation
    information.Name = await collectField(rl, 'Name', "What's your name?\n");
    logger.success(`Hi ${information.Name}!`);
    
    information.Age = await collectField(rl, 'Age', "What's your age?\n");
    logger.success(`Nice! ${information.Age} is a great age.`);
    
    information.Major = await collectField(rl, 'Major', "What's your major?\n");
    logger.success(`${information.Major} sounds interesting!`);
    
    // Display collected information with a title
    logger.table(information, 'Summary of information:');
    
  } catch (error) {
    logger.error(`An error occurred: ${error.message}`);
  } finally {
    rl.close();
  }
}

// Start the application
main().catch(error => {
  logger.error(`Unhandled error: ${error.message}`);
  process.exit(1);
});


  

