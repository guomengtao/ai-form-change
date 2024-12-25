// Content script for AI Form Change

console.log('AI Form Change extension loaded');

function createGlobalAITextarea() {
  // Create the AI container HTML with a clean, modern design
  const aiContainerHTML = `
  <div id="ai-container" style="
    position: fixed; 
    bottom: 20px; 
    right: 20px; 
    width: 320px; 
    background-color: white; 
    border: 1px solid #e0e0e0; 
    border-radius: 12px; 
    box-shadow: 0 8px 20px rgba(0,0,0,0.08); 
    z-index: 10000; 
    padding: 15px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  ">
    <div style="
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    ">
      <h3 id="ai-assistant-title" style="
        margin: 0;
        font-size: 16px;
        color: #333;
        font-weight: 600;
      ">Tom</h3>
      <button id="ai-minimize-btn" style="
        background: none;
        border: none;
        color: #888;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
      ">×</button>
    </div>

    <textarea id="ai-global-suggestion" style="
      width: 100%; 
      height: 80px; 
      margin-bottom: 15px; 
      resize: vertical;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 8px;
      font-size: 12px;
      color: #666;
    " placeholder="AI suggestions and logs will appear here"></textarea>
    
    <div style="
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    ">
      <button id="ai-random-answers-btn" style="
        background-color: #4a90e2;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        transition: background-color 0.2s;
      " onmouseover="this.style.backgroundColor='#3a7bd5'" 
         onmouseout="this.style.backgroundColor='#4a90e2'">
        Random Answers
      </button>

      <button id="ai-first-option-btn" style="
        background-color: #50c878;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        transition: background-color 0.2s;
      " onmouseover="this.style.backgroundColor='#3cb371'" 
         onmouseout="this.style.backgroundColor='#50c878'">
        First Option
      </button>

      <button id="ai-random-checkbox-btn" style="
        background-color: #ff6f61;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        transition: background-color 0.2s;
      " onmouseover="this.style.backgroundColor='#ff5349'" 
         onmouseout="this.style.backgroundColor='#ff6f61'">
        Random Checkboxes
      </button>

      <button id="ai-random-radio-btn" style="
        background-color: #6a5acd;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        transition: background-color 0.2s;
      " onmouseover="this.style.backgroundColor='#5849c3'" 
         onmouseout="this.style.backgroundColor='#6a5acd'">
        Random Radio
      </button>

      <button id="ai-random-select-btn" style="
        background-color: #8e44ad;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        transition: background-color 0.2s;
        grid-column: span 2;
      " onmouseover="this.style.backgroundColor='#7a288a'" 
         onmouseout="this.style.backgroundColor='#8e44ad'">
        Random Select
      </button>

      <button id="ai-fill-unanswered-btn" style="
        background-color: #ff9800;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        transition: background-color 0.2s;
        grid-column: span 2;
      " onmouseover="this.style.backgroundColor='#f57c00'" 
         onmouseout="this.style.backgroundColor='#ff9800'">
        Fill Unanswered Questions
      </button>

      <button id="ai-clear-all-btn" style="
        background-color: #e74c3c;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        transition: background-color 0.2s;
        grid-column: span 2;
      " onmouseover="this.style.backgroundColor='#c0392b'" 
         onmouseout="this.style.backgroundColor='#e74c3c'">
        Clear All Selections
      </button>
    </div>
  </div>
`;

  // Create the AI container
  const aiContainer = document.createElement('div');
  aiContainer.innerHTML = aiContainerHTML;

  // Add the container to the body
  document.body.appendChild(aiContainer);

  // Get references to elements
  const extractFormsBtn = document.getElementById('ai-extract-forms-btn');
  const applyChangesBtn = document.getElementById('ai-apply-changes-btn');
  const randomAnswersBtn = document.getElementById('ai-random-answers-btn');
  const highlightBtn = document.getElementById('ai-highlight-btn');
  const originalSuggestionArea = document.getElementById('ai-global-suggestion');
  const modifyTextarea = document.getElementById('ai-modify-textarea');
  const minimizeBtn = document.getElementById('ai-minimize-btn');
  const firstOptionBtn = document.getElementById('ai-first-option-btn');
  const randomCheckboxBtn = document.getElementById('ai-random-checkbox-btn');
  const randomRadioBtn = document.getElementById('ai-random-radio-btn');
  const randomSelectBtn = document.getElementById('ai-random-select-btn');
  const fillUnansweredBtn = document.getElementById('ai-fill-unanswered-btn');
  const clearAllBtn = document.getElementById('ai-clear-all-btn');

  // Function to extract and format form code
  function extractFormCode() {
    const forms = document.querySelectorAll('form');
    let formCodeOutput = `# Total Forms Detected: ${forms.length}\n\n`;

    forms.forEach((form, index) => {
      // Add form index and any existing ID or name
      const formId = form.id ? `ID: ${form.id}` : '';
      const formName = form.name ? `Name: ${form.name}` : '';
      
      formCodeOutput += `### Form #${index + 1} ${formId} ${formName}\n\n`;
      formCodeOutput += `\`\`\`html\n${formatXml(form.outerHTML)}\n\`\`\`\n\n`;
      
      // Add additional form insights
      const inputs = form.querySelectorAll('input, select, textarea');
      formCodeOutput += `#### Form Insights:\n`;
      formCodeOutput += `- Total Input Elements: ${inputs.length}\n`;
      
      // Categorize input types
      const inputTypes = {};
      inputs.forEach(input => {
        const type = input.type || 'unknown';
        inputTypes[type] = (inputTypes[type] || 0) + 1;
      });
      
      Object.entries(inputTypes).forEach(([type, count]) => {
        formCodeOutput += `- ${type} inputs: ${count}\n`;
      });
      
      formCodeOutput += `\n---\n\n`;
    });

    return formCodeOutput;
  }

  // XML/HTML formatting function
  function formatXml(xml) {
    const tab = '  ';
    let formatted = '';
    let indent = '';
    
    xml.split(/>\s*</).forEach((node) => {
      if (node.match(/^\/\w/)) indent = indent.substring(tab.length);
      formatted += indent + '<' + node + '>\n';
      if (node.match(/^<?\w[^>]*[^/]$/)) indent += tab;
    });
    
    return formatted.substring(1, formatted.length - 2);
  }

  // Comprehensive random form filling function
  function comprehensiveRandomFormFilling() {
    // Get the suggestion area for logging
    const suggestionArea = document.getElementById('ai-global-suggestion');
    
    // Prepare logging variables
    let totalQuestions = 0;
    let randomlyAnsweredQuestions = 0;
    let logDetails = [];

    // Random seed generation
    const randomSeed = Math.random().toString(36).substring(2, 10);

    // Function to get nearby label or title for a question
    function findQuestionTitle(element) {
      // Try multiple methods to find the question text
      const titleSources = [
        // Check parent and sibling elements for labels
        () => {
          const parentLabel = element.closest('label');
          return parentLabel ? parentLabel.textContent.trim() : null;
        },
        // Check previous sibling elements
        () => {
          let prev = element.previousElementSibling;
          while (prev) {
            if (prev.textContent.trim().length > 0) {
              return prev.textContent.trim();
            }
            prev = prev.previousElementSibling;
          }
          return null;
        },
        // Check parent container for text
        () => {
          const container = element.closest('div, fieldset');
          if (container) {
            const textElements = container.querySelectorAll('label, h3, h4, p, span');
            for (let el of textElements) {
              if (el.textContent.trim().length > 0 && !el.contains(element)) {
                return el.textContent.trim();
              }
            }
          }
          return null;
        }
      ];

      // Try each method until we find a title
      for (let method of titleSources) {
        const title = method();
        if (title) return title;
      }

      return 'Untitled Question';
    }

    // Randomize radio buttons
    function randomizeRadioGroup(radioGroup) {
      // Collect all options with their labels
      const allOptions = Array.from(radioGroup).map((radio, index) => {
        const label = document.querySelector(`label[for="${radio.id}"]`);
        return {
          element: radio,
          label: label ? label.textContent.trim() : `Option ${index + 1}`,
          id: radio.id
        };
      });

      // Filter out non-answer options
      const validOptions = allOptions.filter(option => {
        const labelText = option.label.toLowerCase();
        const excludedPhrases = [
          '清空', 'clear', 'reset', '取消', 'cancel', 
          '不选择', 'none', 'skip', '跳过'
        ];
        
        return !excludedPhrases.some(phrase => labelText.includes(phrase));
      });

      // Use all options if no valid options found
      const optionsToChooseFrom = validOptions.length > 0 ? validOptions : allOptions;

      if (optionsToChooseFrom.length > 0) {
        const randomIndex = Math.floor(Math.random() * optionsToChooseFrom.length);
        const selectedOption = optionsToChooseFrom[randomIndex];
        
        selectedOption.element.click();

        return {
          type: 'radio',
          selected: selectedOption.label,
          inputName: selectedOption.element.name,
          allOptions: allOptions.map(opt => opt.label)
        };
      }
      return null;
    }

    // Randomize select elements
    function randomizeSelect(selectElement) {
      // Collect all options
      const options = Array.from(selectElement.options).map((option, index) => ({
        index: index,
        text: option.text.trim(),
        value: option.value,
        label: String.fromCharCode(97 + index) // a, b, c, d...
      }));

      // Filter out non-answer options
      const validOptions = options.filter(option => {
        const excludedPhrases = [
          '请选择', 'please select', '选择', 'select', 
          '不选择', 'none', 'skip', '跳过', 
          '--', '---', '----'
        ];
        
        return !excludedPhrases.some(phrase => 
          option.text.toLowerCase().includes(phrase)
        );
      });

      // Use all options if no valid options found
      const optionsToChooseFrom = validOptions.length > 0 ? validOptions : options;

      if (optionsToChooseFrom.length > 0) {
        const randomIndex = Math.floor(Math.random() * optionsToChooseFrom.length);
        const selectedOption = optionsToChooseFrom[randomIndex];
        
        selectElement.selectedIndex = selectedOption.index;
        
        // Trigger change event
        const changeEvent = new Event('change', { bubbles: true });
        selectElement.dispatchEvent(changeEvent);

        return {
          type: 'select',
          selected: selectedOption.text,
          value: selectedOption.value,
          allOptions: options.map(opt => `${opt.label}. ${opt.text} (value: ${opt.value})`)
        };
      }
      return null;
    }

    // Randomize checkbox inputs
    function randomizeCheckboxGroup(checkboxGroup) {
      // Collect all options with their labels
      const allOptions = checkboxGroup.map((checkbox, index) => {
        const label = document.querySelector(`label[for="${checkbox.id}"]`);
        return {
          element: checkbox,
          label: label ? label.textContent.trim() : `Option ${index + 1}`,
          id: checkbox.id
        };
      });

      // Filter out non-answer options
      const validOptions = allOptions.filter(option => {
        const labelText = option.label.toLowerCase();
        const excludedPhrases = [
          '清空', 'clear', 'reset', '取消', 'cancel', 
          '不选择', 'none', 'skip', '跳过'
        ];
        
        return !excludedPhrases.some(phrase => labelText.includes(phrase));
      });

      // Use all options if no valid options found
      const optionsToChooseFrom = validOptions.length > 0 ? validOptions : allOptions;

      if (optionsToChooseFrom.length > 0) {
        // Randomly decide how many checkboxes to select (1-50% of total)
        const maxSelections = Math.max(1, Math.floor(checkboxGroup.length / 2));
        const selectCount = Math.floor(Math.random() * maxSelections) + 1;

        // Shuffle the options
        const shuffled = allOptions.sort(() => 0.5 - Math.random());

        // Select first 'selectCount' checkboxes
        const selectedCheckboxes = shuffled.slice(0, selectCount);

        selectedCheckboxes.forEach(checkbox => {
          checkbox.element.checked = true;
        });

        return {
          type: 'checkbox',
          selectedCount: selectCount,
          allOptions: allOptions.map(opt => opt.label)
        };
      }
      return null;
    }

    // Main randomization logic
    function processQuestions() {
      // Radio button groups
      const radioGroups = {};
      document.querySelectorAll('input[type="radio"]').forEach(radio => {
        if (!radioGroups[radio.name]) {
          radioGroups[radio.name] = Array.from(document.querySelectorAll(`input[type="radio"][name="${radio.name}"]`));
        }
      });

      // Process unique radio groups
      Object.values(radioGroups).forEach(radioGroup => {
        if (radioGroup.length > 1) {
          const result = randomizeRadioGroup(radioGroup);
          if (result) {
            const questionTitle = findQuestionTitle(radioGroup[0]);
            logDetails.push({
              type: 'radio',
              question: questionTitle,
              ...result
            });
            randomlyAnsweredQuestions++;
          }
          totalQuestions++;
        }
      });

      // Select elements
      document.querySelectorAll('select').forEach(selectElement => {
        const result = randomizeSelect(selectElement);
        if (result) {
          const questionTitle = findQuestionTitle(selectElement);
          logDetails.push({
            type: 'select',
            question: questionTitle,
            ...result
          });
          randomlyAnsweredQuestions++;
        }
        totalQuestions++;
      });

      // Checkbox groups
      const checkboxGroups = {};
      document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (!checkboxGroups[checkbox.name]) {
          checkboxGroups[checkbox.name] = Array.from(document.querySelectorAll(`input[type="checkbox"][name="${checkbox.name}"]`));
        }
      });

      // Process unique checkbox groups
      Object.values(checkboxGroups).forEach(checkboxGroup => {
        if (checkboxGroup.length > 1) {
          const result = randomizeCheckboxGroup(checkboxGroup);
          if (result) {
            const questionTitle = findQuestionTitle(checkboxGroup[0]);
            logDetails.push({
              type: 'checkbox',
              question: questionTitle,
              ...result
            });
            randomlyAnsweredQuestions++;
          }
          totalQuestions++;
        }
      });
    }

    // Execute randomization
    processQuestions();

    // Prepare log message
    let logMessage = `Comprehensive Random Form Filling Complete:\n\n`;
    logMessage += `- Total Questions: ${totalQuestions}\n`;
    logMessage += `- Randomly Answered Questions: ${randomlyAnsweredQuestions}\n`;
    logMessage += `- Random Seed: ${randomSeed}\n\n`;
    logMessage += `Random Selection Details:\n\n`;

    // Add details for each randomized question
    logDetails.forEach((detail, index) => {
      logMessage += `[Question ${index + 1}]\n`;
      logMessage += `Type: ${detail.type}\n`;
      logMessage += `Question: ${detail.question}\n`;
      
      // Show ALL options for each type
      logMessage += `All Options:\n`;
      detail.allOptions.forEach((opt, optIndex) => {
        logMessage += `  ${String.fromCharCode(97 + optIndex)}. ${opt}\n`;
      });
      
      if (detail.type === 'radio') {
        logMessage += `Selected: ${detail.selected}\n`;
        logMessage += `Input Name: ${detail.inputName}\n\n`;
      } else if (detail.type === 'select') {
        logMessage += `Selected: ${detail.selected}\n`;
        logMessage += `Value: ${detail.value}\n\n`;
      } else if (detail.type === 'checkbox') {
        logMessage += `Selected Checkboxes: ${detail.selectedCount}\n\n`;
      }
    });

    logMessage += `Tip: Attempted to randomly answer ALL detected questions using multiple strategies!`;

    // Update suggestion area
    if (suggestionArea) {
      suggestionArea.value = logMessage;
    }

    // Console log for debugging
    console.log(logMessage);

    return {
      totalQuestions,
      randomlyAnsweredQuestions,
      randomSeed,
      logDetails
    };
  }

  // Enhanced function to randomize form answers comprehensively
  function randomizeFormAnswers() {
    // Comprehensive question and input detection
    const questionContainers = document.querySelectorAll(
      '.que, [id^="question-"], .qtext, .formulation, ' + 
      '[class*="question"], [class*="quiz-question"], ' + 
      'form div[role="group"]'
    );
    const totalQuestions = questionContainers.length;

    // Detailed log of random selections
    const randomSelectionLog = [];

    // Track processed elements
    let processedElements = 0;

    // Function to filter out non-answer options
    const isValidOption = (optionText) => {
      // List of common non-answer phrases to exclude
      const excludedPhrases = [
        '清空我的选择', // Clear my selection
        '取消选择', // Cancel selection
        'Clear selection', 
        'Reset',
        'Clear',
        '重置'
      ];

      // Check if the option is a number or a meaningful text
      const isNumeric = !isNaN(parseFloat(optionText)) && isFinite(optionText);
      const isNotExcluded = !excludedPhrases.some(phrase => 
        optionText.includes(phrase)
      );

      return isNumeric || isNotExcluded;
    };

    // Comprehensive input finder
    const findInputsInContainer = (container) => {
      return container.querySelectorAll(
        'input[type="radio"], input[type="checkbox"], ' +
        'input[type="text"], input[type="number"], ' +
        'select, textarea'
      );
    };

    // Find question text
    const findQuestionText = (container) => {
      const textSelectors = [
        '.qtext', '.prompt', 'p', 'label', 
        '[class*="question-text"]', 'h3', 'h4'
      ];

      for (let selector of textSelectors) {
        const textEl = container.querySelector(selector);
        if (textEl && textEl.textContent.trim()) {
          return textEl.textContent.trim();
        }
      }

      return 'Unknown Question';
    };

    // Shuffle and process all question containers
    const shuffledContainers = Array.from(questionContainers)
      .sort(() => 0.5 - Math.random());

    shuffledContainers.forEach((container) => {
      // Find inputs in this container
      const inputs = findInputsInContainer(container);
      
      // Skip if no inputs found
      if (inputs.length === 0) return;

      // Prioritize processing strategy
      const processingStrategies = [
        // Strategy 1: Radio and Checkbox
        () => {
          const radioCheckboxInputs = Array.from(inputs).filter(
            inp => inp.type === 'radio' || inp.type === 'checkbox'
          );

          if (radioCheckboxInputs.length > 0) {
            // Group by name
            const inputGroups = {};
            radioCheckboxInputs.forEach(inp => {
              if (inp.name) {
                if (!inputGroups[inp.name]) inputGroups[inp.name] = [];
                inputGroups[inp.name].push(inp);
              }
            });

            // Process each group
            Object.values(inputGroups).forEach(group => {
              if (group.length > 0) {
                // Filter valid options
                const validInputs = group.filter(inp => {
                  const label = document.querySelector(`label[for="${inp.id}"]`);
                  const optionText = label ? label.textContent.trim() : inp.value;
                  return isValidOption(optionText);
                });

                if (validInputs.length > 0) {
                  // Randomly select an input
                  const selectedInput = validInputs[Math.floor(Math.random() * validInputs.length)];
                  selectedInput.checked = true;

                  // Log selection
                  const label = document.querySelector(`label[for="${selectedInput.id}"]`);
                  randomSelectionLog.push({
                    type: selectedInput.type,
                    question: findQuestionText(container),
                    selectedOption: label ? label.textContent.trim() : selectedInput.value,
                    name: selectedInput.name
                  });

                  processedElements++;
                  return true;
                }
              }
              return false;
            });
          }
          return false;
        },

        // Strategy 2: Select Dropdowns
        () => {
          const selectInputs = Array.from(inputs).filter(
            inp => inp.tagName.toLowerCase() === 'select'
          );

          if (selectInputs.length > 0) {
            selectInputs.forEach(select => {
              const validOptions = Array.from(select.options)
                .filter(opt => isValidOption(opt.text));

              if (validOptions.length > 0) {
                const randomOption = validOptions[Math.floor(Math.random() * validOptions.length)];
                select.value = randomOption.value;

                // Log selection
                randomSelectionLog.push({
                  type: 'select',
                  question: findQuestionText(container),
                  selectedOption: randomOption.text,
                  name: select.name
                });

                processedElements++;
              }
            });
            return true;
          }
          return false;
        },

        // Strategy 3: Text and Number Inputs
        () => {
          const textInputs = Array.from(inputs).filter(
            inp => inp.type === 'text' || inp.type === 'number'
          );

          if (textInputs.length > 0) {
            textInputs.forEach(input => {
              // Generate a random value
              input.value = Math.floor(Math.random() * 1000).toString();

              // Log selection
              randomSelectionLog.push({
                type: input.type,
                question: findQuestionText(container),
                selectedOption: input.value,
                name: input.name
              });

              processedElements++;
            });
            return true;
          }
          return false;
        }
      ];

      // Try processing strategies in order
      processingStrategies.some(strategy => strategy());
    });

    // Format the random selection log
    const formattedLog = randomSelectionLog.map((entry, index) => `
[Question ${index + 1}]
Type: ${entry.type}
Question: ${entry.question}
Selected: ${entry.selectedOption}
Input Name: ${entry.name}
`).join('\n\n');

    // Provide detailed feedback
    originalSuggestionArea.value = `Comprehensive Random Form Filling Complete:\n
- Total Questions: ${totalQuestions}
- Randomly Answered Questions: ${processedElements}
- Random Seed: ${Math.random().toString(36).substr(2, 9)}

Random Selection Details:
${formattedLog}

Tip: Attempted to randomly answer ALL detected questions using multiple strategies!`;

    // Console log for debugging
    console.log(formattedLog);
  }

  // Enhanced function to randomize radio questions with detailed logging
  function randomizeRadioQuestions() {
    // Get the suggestion area for logging
    const suggestionArea = document.getElementById('ai-global-suggestion');
    const leftTextarea = document.getElementById('ai-form-html-code');
    
    // Prepare logging variables
    let processedQuestions = 0;
    let totalRadioQuestions = 0;
    let logDetails = [];

    // Find all radio button groups
    const radioGroups = {};
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
      if (!radioGroups[radio.name]) {
        radioGroups[radio.name] = Array.from(document.querySelectorAll(`input[type="radio"][name="${radio.name}"]`));
      }
    });

    // Process each radio button group
    Object.values(radioGroups).forEach(radioGroup => {
      if (radioGroup.length <= 1) return;

      // Collect ALL options with their labels
      const allOptions = radioGroup.map((radio, index) => {
        const label = document.querySelector(`label[for="${radio.id}"]`);
        return {
          element: radio,
          label: label ? label.textContent.trim() : `Option ${index + 1}`,
          id: radio.id,
          value: radio.value
        };
      });

      // Filter out non-answer options
      const validOptions = allOptions.filter(option => {
        const labelText = option.label.toLowerCase();
        const excludedPhrases = [
          '清空', 'clear', 'reset', '取消', 'cancel', 
          '不选择', 'none', 'skip', '跳过'
        ];
        
        return !excludedPhrases.some(phrase => labelText.includes(phrase));
      });

      // Use all options if no valid options found
      const optionsToChooseFrom = validOptions.length > 0 ? validOptions : allOptions;

      if (optionsToChooseFrom.length > 0) {
        const randomIndex = Math.floor(Math.random() * optionsToChooseFrom.length);
        const selectedOption = optionsToChooseFrom[randomIndex];
        
        // Try to find the question title
        const questionContainer = selectedOption.element.closest('div, fieldset, label');
        let questionTitle = 'Untitled Question';
        
        if (questionContainer) {
          const titleElement = questionContainer.querySelector('label, h3, h4, p, span');
          if (titleElement) {
            questionTitle = titleElement.textContent.trim();
          }
        }

        // Select the radio button
        selectedOption.element.click();

        // Prepare options log
        const optionsLog = allOptions.map((opt, index) => 
          `${String.fromCharCode(97 + index)}. ${opt.label} (value: ${opt.value})`
        );

        // Prepare log details
        const logEntry = {
          title: questionTitle,
          allOptions: optionsLog,
          selected: selectedOption.label,
          selectedValue: selectedOption.value
        };

        // Log details
        logDetails.push(logEntry);

        // Update left textarea with options
        if (leftTextarea) {
          let textareaContent = `Question: ${questionTitle}\n\n`;
          textareaContent += "All Options:\n";
          optionsLog.forEach(opt => {
            textareaContent += `${opt}\n`;
          });
          textareaContent += `\nSelected: ${selectedOption.label} (value: ${selectedOption.value})`;
          
          leftTextarea.value = textareaContent;
        }

        // Update suggestion area
        if (suggestionArea) {
          let suggestionContent = `Radio Question Randomized:\n`;
          suggestionContent += `Question: ${questionTitle}\n`;
          suggestionContent += `Selected: ${selectedOption.label}\n`;
          suggestionContent += `Value: ${selectedOption.value}`;
          
          suggestionArea.value = suggestionContent;
        }

        processedQuestions++;
      }

      totalRadioQuestions++;
    });

    // Prepare log message
    let logMessage = `Radio Questions Randomized:\n`;
    logMessage += `Total Radio Question Groups: ${totalRadioQuestions}\n`;
    logMessage += `Processed Question Groups: ${processedQuestions}\n\n`;

    // Add details for each randomized question
    logDetails.forEach((detail, index) => {
      logMessage += `Question ${index + 1}:\n`;
      logMessage += `  Title: ${detail.title}\n`;
      logMessage += `  All Options:\n`;
      detail.allOptions.forEach(opt => {
        logMessage += `    ${opt}\n`;
      });
      logMessage += `  Selected: ${detail.selected}\n\n`;
    });

    // Console log for debugging
    console.log(logMessage);

    return logMessage;
  }

  // Enhanced function to randomize select options with detailed logging
  function randomizeSelectQuestions() {
    // Get the suggestion area for logging
    const suggestionArea = document.getElementById('ai-global-suggestion');
    
    // Prepare logging variables
    let processedQuestions = 0;
    let totalSelectQuestions = 0;
    let logDetails = [];

    // Find all select elements
    const selectElements = document.querySelectorAll('select');

    // Process each select element
    selectElements.forEach((selectElement, index) => {
      // Try to find the question title
      let questionTitle = '';
      let questionContainer = selectElement.closest('div, fieldset, label');
      
      if (questionContainer) {
        const titleElement = questionContainer.querySelector('label, h3, h4, p, span');
        if (titleElement) {
          questionTitle = titleElement.textContent.trim();
        }
      }

      // Collect ALL options, including default/placeholder options
      const options = Array.from(selectElement.options).map((option, optIndex) => ({
        index: optIndex,
        value: option.value,
        text: option.text.trim(),
        label: String.fromCharCode(97 + optIndex) // a, b, c, d...
      }));

      // Log ALL options, not just filtered ones
      const allOptionsLog = options.map(opt => `${opt.label}. ${opt.text} (value: ${opt.value})`);

      // Filter out non-answer options
      const validOptions = options.filter(option => {
        const excludedPhrases = [
          '请选择', 'please select', '选择', 'select', 
          '不选择', 'none', 'skip', '跳过', 
          '--', '---', '----'
        ];
        
        return !excludedPhrases.some(phrase => 
          option.text.toLowerCase().includes(phrase) || 
          option.value.toLowerCase().includes(phrase)
        );
      });

      // If no valid options, use all options
      const optionsToChooseFrom = validOptions.length > 0 ? validOptions : options;

      // Randomly select an option
      if (optionsToChooseFrom.length > 0) {
        const randomIndex = Math.floor(Math.random() * optionsToChooseFrom.length);
        const selectedOption = optionsToChooseFrom[randomIndex];

        // Set the selected option
        selectElement.selectedIndex = selectedOption.index;
        
        // Trigger change event
        const changeEvent = new Event('change', { bubbles: true });
        selectElement.dispatchEvent(changeEvent);

        // Log details
        logDetails.push({
          title: questionTitle || `Select Question ${index + 1}`,
          allOptions: allOptionsLog,
          options: options.map(opt => `${opt.label}. ${opt.text} (value: ${opt.value})`),
          selectedOption: `${selectedOption.label}. ${selectedOption.text} (value: ${selectedOption.value})`,
          totalOptions: options.length,
          validOptions: optionsToChooseFrom.length
        });

        processedQuestions++;
      }

      totalSelectQuestions++;
    });

    // Prepare log message
    let logMessage = `Select Questions Randomized:\n`;
    logMessage += `Total Select Questions: ${totalSelectQuestions}\n`;
    logMessage += `Processed Select Questions: ${processedQuestions}\n\n`;

    // Add detailed log for each processed question
    logDetails.forEach((detail, index) => {
      logMessage += `Question ${index + 1}:\n`;
      logMessage += `  Title: ${detail.title}\n`;
      logMessage += `  All Options:\n`;
      detail.allOptions.forEach(opt => {
        logMessage += `    ${opt}\n`;
      });
      logMessage += `  Selected Option: ${detail.selectedOption}\n`;
      logMessage += `  Total Options: ${detail.totalOptions}\n`;
      logMessage += `  Valid Options: ${detail.validOptions}\n\n`;
    });

    // Update suggestion area
    if (suggestionArea) {
      suggestionArea.value = logMessage;
    }

    // Console log for debugging
    console.log(logMessage);

    return logMessage;
  }

  // Function to set first option as default for all checkbox inputs
  function setFirstOptionDefault() {
    // Find all question containers
    const questionContainers = document.querySelectorAll(
      '.que, [id^="question-"], .qtext, .formulation, ' + 
      '[class*="question"], [class*="quiz-question"], ' + 
      'form div[role="group"]'
    );
    const totalQuestions = questionContainers.length;

    // Detailed log of selections
    const selectionLog = [];

    // Track processed elements
    let processedElements = 0;

    // Function to filter out non-answer options
    const isValidOption = (optionText) => {
      // List of common non-answer phrases to exclude
      const excludedPhrases = [
        '清空我的选择', // Clear my selection
        '取消选择', // Cancel selection
        'Clear selection', 
        'Reset',
        'Clear',
        '重置'
      ];

      // Check if the option is a number or a meaningful text
      const isNumeric = !isNaN(parseFloat(optionText)) && isFinite(optionText);
      const isNotExcluded = !excludedPhrases.some(phrase => 
        optionText.includes(phrase)
      );

      return isNumeric || isNotExcluded;
    };

    // Find question text
    const findQuestionText = (container) => {
      const textSelectors = [
        '.qtext', '.prompt', 'p', 'label', 
        '[class*="question-text"]', 'h3', 'h4'
      ];

      for (let selector of textSelectors) {
        const textEl = container.querySelector(selector);
        if (textEl && textEl.textContent.trim()) {
          return textEl.textContent.trim();
        }
      }

      return 'Unknown Question';
    };

    // Process each question container
    questionContainers.forEach((container) => {
      // Find checkbox inputs in this container
      const checkboxInputs = container.querySelectorAll('input[type="checkbox"]');
      
      if (checkboxInputs.length > 0) {
        // Group checkboxes by name to handle checkbox groups
        const checkboxGroups = {};
        checkboxInputs.forEach(checkbox => {
          if (checkbox.name) {
            if (!checkboxGroups[checkbox.name]) {
              checkboxGroups[checkbox.name] = [];
            }
            checkboxGroups[checkbox.name].push(checkbox);
          }
        });

        // Process each checkbox group
        Object.values(checkboxGroups).forEach(group => {
          if (group.length > 0) {
            // Find the first checkbox in the group
            const firstCheckbox = group[0];
            
            // Find the corresponding label
            const label = document.querySelector(`label[for="${firstCheckbox.id}"]`);

            // Uncheck all checkboxes in the group first
            group.forEach(checkbox => {
              checkbox.checked = false;
            });

            // Check only the first checkbox
            firstCheckbox.checked = true;

            // Log the selection
            selectionLog.push({
              question: findQuestionText(container),
              selectedOption: label ? label.textContent.trim() : firstCheckbox.value,
              name: firstCheckbox.name
            });

            processedElements++;
          }
        });
      }
    });

    // Format the selection log
    const formattedLog = selectionLog.map((entry, index) => `
[Question ${index + 1}]
Question: ${entry.question}
Selected Option: ${entry.selectedOption}
Input Name: ${entry.name}
`).join('\n\n');

    // Provide detailed feedback
    originalSuggestionArea.value = `First Checkbox Option Filling Complete:\n
- Total Questions: ${totalQuestions}
- Processed Questions: ${processedElements}
- Random Seed: ${Math.random().toString(36).substr(2, 9)}

Selection Details:
${formattedLog}

Tip: First checkbox set as default for all checkbox inputs!`;

    // Warn if not all questions were processed
    if (processedElements < totalQuestions) {
      console.warn(`Warning: Only ${processedElements} out of ${totalQuestions} questions were processed.`);
    }
  }

  // Function to randomly fill all radio questions
  function randomizeRadioQuestions() {
    // Find all question containers
    const questionContainers = document.querySelectorAll(
      '.que, [id^="question-"], .qtext, .formulation, ' + 
      '[class*="question"], [class*="quiz-question"], ' + 
      'form div[role="group"]'
    );
    const totalQuestions = questionContainers.length;

    // Detailed log of random selections
    const randomSelectionLog = [];

    // Track processed elements
    let processedElements = 0;

    // Function to filter out non-answer options
    const isValidOption = (optionText) => {
      // List of common non-answer phrases to exclude
      const excludedPhrases = [
        '清空我的选择', // Clear my selection
        '取消选择', // Cancel selection
        'Clear selection', 
        'Reset',
        'Clear',
        '重置'
      ];

      // Check if the option is a number or a meaningful text
      const isNumeric = !isNaN(parseFloat(optionText)) && isFinite(optionText);
      const isNotExcluded = !excludedPhrases.some(phrase => 
        optionText.includes(phrase)
      );

      return isNumeric || isNotExcluded;
    };

    // Find question text
    const findQuestionText = (container) => {
      const textSelectors = [
        '.qtext', '.prompt', 'p', 'label', 
        '[class*="question-text"]', 'h3', 'h4'
      ];

      for (let selector of textSelectors) {
        const textEl = container.querySelector(selector);
        if (textEl && textEl.textContent.trim()) {
          return textEl.textContent.trim();
        }
      }

      return 'Unknown Question';
    };

    // Shuffle and process all question containers
    const shuffledContainers = Array.from(questionContainers)
      .sort(() => 0.5 - Math.random());

    shuffledContainers.forEach((container) => {
      // Find radio inputs in this container
      const radioInputs = container.querySelectorAll('input[type="radio"]');
      
      if (radioInputs.length > 0) {
        // Group radios by name
        const radioGroups = {};
        radioInputs.forEach(radio => {
          if (radio.name) {
            if (!radioGroups[radio.name]) radioGroups[radio.name] = [];
            radioGroups[radio.name].push(radio);
          }
        });

        // Process each radio group
        Object.values(radioGroups).forEach(group => {
          if (group.length > 0) {
            // Filter valid radio options
            const validRadios = group.filter(radio => {
              const label = document.querySelector(`label[for="${radio.id}"]`);
              const optionText = label ? label.textContent.trim() : radio.value;
              return isValidOption(optionText);
            });

            if (validRadios.length > 0) {
              // Randomly select a radio
              const selectedRadio = validRadios[Math.floor(Math.random() * validRadios.length)];
              selectedRadio.checked = true;

              // Log selection
              const label = document.querySelector(`label[for="${selectedRadio.id}"]`);
              randomSelectionLog.push({
                type: 'radio',
                question: findQuestionText(container),
                selectedOption: label ? label.textContent.trim() : selectedRadio.value,
                name: selectedRadio.name
              });

              processedElements++;
            }
          }
        });
      }
    });

    // Format the random selection log
    const formattedLog = randomSelectionLog.map((entry, index) => `
[Question ${index + 1}]
Type: ${entry.type}
Question: ${entry.question}
Selected: ${entry.selectedOption}
Input Name: ${entry.name}
`).join('\n\n');

    // Provide detailed feedback
    originalSuggestionArea.value = `Comprehensive Radio Random Filling Complete:\n
- Total Questions: ${totalQuestions}
- Randomly Answered Radio Questions: ${processedElements}
- Random Seed: ${Math.random().toString(36).substr(2, 9)}

Random Radio Selection Details:
${formattedLog}

Tip: Randomly selected radio options across ALL detected questions!`;

    // Ensure all questions are processed
    if (processedElements < totalQuestions) {
      console.warn(`Warning: Only ${processedElements} out of ${totalQuestions} radio questions were randomly answered.`);
    }
  }

  // Function to randomly fill all checkbox questions
  function randomizeCheckboxQuestions() {
    // Find all question containers
    const questionContainers = document.querySelectorAll(
      '.que, [id^="question-"], .qtext, .formulation, ' + 
      '[class*="question"], [class*="quiz-question"], ' + 
      'form div[role="group"]'
    );
    const totalQuestions = questionContainers.length;

    // Detailed log of random selections
    const randomSelectionLog = [];

    // Track processed elements
    let processedElements = 0;

    // Function to filter out non-answer options
    const isValidOption = (optionText) => {
      // List of common non-answer phrases to exclude
      const excludedPhrases = [
        '清空我的选择', // Clear my selection
        '取消选择', // Cancel selection
        'Clear selection', 
        'Reset',
        'Clear',
        '重置'
      ];

      // Check if the option is a number or a meaningful text
      const isNumeric = !isNaN(parseFloat(optionText)) && isFinite(optionText);
      const isNotExcluded = !excludedPhrases.some(phrase => 
        optionText.includes(phrase)
      );

      return isNumeric || isNotExcluded;
    };

    // Find question text
    const findQuestionText = (container) => {
      const textSelectors = [
        '.qtext', '.prompt', 'p', 'label', 
        '[class*="question-text"]', 'h3', 'h4'
      ];

      for (let selector of textSelectors) {
        const textEl = container.querySelector(selector);
        if (textEl && textEl.textContent.trim()) {
          return textEl.textContent.trim();
        }
      }

      return 'Unknown Question';
    };

    // Shuffle and process all question containers
    const shuffledContainers = Array.from(questionContainers)
      .sort(() => 0.5 - Math.random());

    shuffledContainers.forEach((container) => {
      // Find checkbox inputs in this container
      const checkboxInputs = container.querySelectorAll('input[type="checkbox"]');
      
      if (checkboxInputs.length > 0) {
        // Group checkboxes by name
        const checkboxGroups = {};
        checkboxInputs.forEach(checkbox => {
          if (checkbox.name) {
            if (!checkboxGroups[checkbox.name]) checkboxGroups[checkbox.name] = [];
            checkboxGroups[checkbox.name].push(checkbox);
          }
        });

        // Process each checkbox group
        Object.values(checkboxGroups).forEach(group => {
          if (group.length > 0) {
            // Uncheck all checkboxes in the group first
            group.forEach(checkbox => {
              checkbox.checked = false;
            });

            // Filter valid checkbox options
            const validCheckboxes = group.filter(checkbox => {
              const label = document.querySelector(`label[for="${checkbox.id}"]`);
              const optionText = label ? label.textContent.trim() : checkbox.value;
              return isValidOption(optionText);
            });

            // Randomly select checkboxes to check
            const checkboxesToSelect = Math.floor(Math.random() * (validCheckboxes.length + 1));
            
            // Shuffle and select checkboxes
            const shuffledValidCheckboxes = validCheckboxes.sort(() => 0.5 - Math.random());
            const selectedCheckboxes = shuffledValidCheckboxes.slice(0, checkboxesToSelect);

            // Check selected checkboxes
            selectedCheckboxes.forEach(checkbox => {
              checkbox.checked = true;

              // Log selection
              const label = document.querySelector(`label[for="${checkbox.id}"]`);
              randomSelectionLog.push({
                type: 'checkbox',
                question: findQuestionText(container),
                selectedOption: label ? label.textContent.trim() : checkbox.value,
                name: checkbox.name
              });

              processedElements++;
            });
          }
        });
      }
    });

    // Format the random selection log
    const formattedLog = randomSelectionLog.map((entry, index) => `
[Question ${index + 1}]
Type: ${entry.type}
Question: ${entry.question}
Selected: ${entry.selectedOption}
Input Name: ${entry.name}
`).join('\n\n');

    // Provide detailed feedback
    originalSuggestionArea.value = `Comprehensive Checkbox Random Filling Complete:\n
- Total Questions: ${totalQuestions}
- Randomly Answered Checkbox Questions: ${processedElements}
- Random Seed: ${Math.random().toString(36).substr(2, 9)}

Random Checkbox Selection Details:
${formattedLog}

Tip: Randomly selected checkboxes across ALL detected questions!`;

    // Ensure all questions are processed
    if (processedElements < totalQuestions) {
      console.warn(`Warning: Only ${processedElements} out of ${totalQuestions} checkbox questions were randomly answered.`);
    }
  }

  // Function to fill in all unanswered questions
  function fillUnansweredQuestions() {
    // Find all question containers
    const questionContainers = document.querySelectorAll(
      '.que, [id^="question-"], .qtext, .formulation, ' + 
      '[class*="question"], [class*="quiz-question"], ' + 
      'form div[role="group"]'
    );
    const totalQuestions = questionContainers.length;

    // Detailed log of selections
    const selectionLog = [];

    // Track processed elements
    let processedElements = 0;

    // Function to check if a question is answered
    const isQuestionAnswered = (container) => {
      // Check radio and checkbox inputs
      const radioCheckboxInputs = container.querySelectorAll('input[type="radio"], input[type="checkbox"]');
      const radioCheckboxAnswered = Array.from(radioCheckboxInputs).some(input => input.checked);

      // Check select inputs
      const selectInputs = container.querySelectorAll('select');
      const selectAnswered = Array.from(selectInputs).some(select => 
        select.selectedIndex > 0 || select.value !== ''
      );

      // Check text and number inputs
      const textInputs = container.querySelectorAll('input[type="text"], input[type="number"]');
      const textAnswered = Array.from(textInputs).some(input => input.value.trim() !== '');

      return radioCheckboxAnswered || selectAnswered || textAnswered;
    };

    // Function to filter out non-answer options
    const isValidOption = (optionText) => {
      // List of common non-answer phrases to exclude
      const excludedPhrases = [
        '清空我的选择', // Clear my selection
        '取消选择', // Cancel selection
        'Clear selection', 
        'Reset',
        'Clear',
        '重置'
      ];

      // Check if the option is a number or a meaningful text
      const isNumeric = !isNaN(parseFloat(optionText)) && isFinite(optionText);
      const isNotExcluded = !excludedPhrases.some(phrase => 
        optionText.includes(phrase)
      );

      return isNumeric || isNotExcluded;
    };

    // Find question text
    const findQuestionText = (container) => {
      const textSelectors = [
        '.qtext', '.prompt', 'p', 'label', 
        '[class*="question-text"]', 'h3', 'h4'
      ];

      for (let selector of textSelectors) {
        const textEl = container.querySelector(selector);
        if (textEl && textEl.textContent.trim()) {
          return textEl.textContent.trim();
        }
      }

      return 'Unknown Question';
    };

    // Process unanswered questions
    questionContainers.forEach((container) => {
      // Skip if question is already answered
      if (isQuestionAnswered(container)) return;

      // Find inputs in this container
      const inputs = container.querySelectorAll(
        'input[type="radio"], input[type="checkbox"], ' +
        'input[type="text"], input[type="number"], ' +
        'select, textarea'
      );

      if (inputs.length > 0) {
        // Prioritize input types
        const inputPriorities = [
          // Priority 1: Radio and Checkbox
          () => {
            const radioCheckboxInputs = Array.from(inputs).filter(
              inp => inp.type === 'radio' || inp.type === 'checkbox'
            );

            if (radioCheckboxInputs.length > 0) {
              // Group by name
              const inputGroups = {};
              radioCheckboxInputs.forEach(inp => {
                if (inp.name) {
                  if (!inputGroups[inp.name]) inputGroups[inp.name] = [];
                  inputGroups[inp.name].push(inp);
                }
              });

              // Process each group
              Object.values(inputGroups).forEach(group => {
                const validInputs = group.filter(inp => {
                  const label = document.querySelector(`label[for="${inp.id}"]`);
                  const optionText = label ? label.textContent.trim() : inp.value;
                  return isValidOption(optionText);
                });

                if (validInputs.length > 0) {
                  // Select first valid input
                  const selectedInput = validInputs[0];
                  selectedInput.checked = true;

                  // Log selection
                  const label = document.querySelector(`label[for="${selectedInput.id}"]`);
                  selectionLog.push({
                    type: selectedInput.type,
                    question: findQuestionText(container),
                    selectedOption: label ? label.textContent.trim() : selectedInput.value,
                    name: selectedInput.name
                  });

                  processedElements++;
                  return true;
                }
                return false;
              });
            }
            return false;
          },

          // Priority 2: Select Dropdowns
          () => {
            const selectInputs = Array.from(inputs).filter(
              inp => inp.tagName.toLowerCase() === 'select'
            );

            if (selectInputs.length > 0) {
              selectInputs.forEach(select => {
                const validOptions = Array.from(select.options)
                  .filter(opt => isValidOption(opt.text));

                if (validOptions.length > 0) {
                  // Select first valid option
                  select.selectedIndex = select.options.indexOf(validOptions[0]);

                  // Log selection
                  selectionLog.push({
                    type: 'select',
                    question: findQuestionText(container),
                    selectedOption: validOptions[0].text,
                    name: select.name
                  });

                  processedElements++;
                }
              });
              return true;
            }
            return false;
          },

          // Priority 3: Text and Number Inputs
          () => {
            const textInputs = Array.from(inputs).filter(
              inp => inp.type === 'text' || inp.type === 'number'
            );

            if (textInputs.length > 0) {
              textInputs.forEach(input => {
                // Generate a default value
                input.value = 'N/A';

                // Log selection
                selectionLog.push({
                  type: input.type,
                  question: findQuestionText(container),
                  selectedOption: input.value,
                  name: input.name
                });

                processedElements++;
              });
              return true;
            }
            return false;
          }
        ];

        // Try processing strategies in order
        inputPriorities.some(strategy => strategy());
      }
    });

    // Format the selection log
    const formattedLog = selectionLog.map((entry, index) => `
[Question ${index + 1}]
Type: ${entry.type}
Question: ${entry.question}
Selected: ${entry.selectedOption}
Input Name: ${entry.name}
`).join('\n\n');

    // Provide detailed feedback
    originalSuggestionArea.value = `Unanswered Questions Filling Complete:\n
- Total Questions: ${totalQuestions}
- Filled Unanswered Questions: ${processedElements}
- Random Seed: ${Math.random().toString(36).substr(2, 9)}

Unanswered Questions Details:
${formattedLog}

Tip: Filled ALL unanswered questions with default/first valid options!`;

    // Log if no unanswered questions were found
    if (processedElements === 0) {
      console.log('All questions are already answered!');
      originalSuggestionArea.value = 'All questions are already answered!';
    }
  }

  // Function to clear all selections on the page
  function clearAllSelections() {
    // Log the action
    const suggestionArea = document.getElementById('ai-global-suggestion');
    
    // Find and click all "清空我的选择" (Clear my selection) buttons
    const clearButtons = document.querySelectorAll('a.btn.btn-link[role="button"]');
    
    if (clearButtons.length > 0) {
      clearButtons.forEach(button => {
        try {
          button.click();
        } catch (error) {
          console.error('Error clicking clear button:', error);
        }
      });
      
      // Find and reset other input types
      const inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"], select');
      inputs.forEach(input => {
        try {
          if (input.type === 'radio' || input.type === 'checkbox') {
            input.checked = false;
          } else if (input.tagName === 'SELECT') {
            input.selectedIndex = -1;
          }
        } catch (error) {
          console.error('Error resetting input:', error);
        }
      });
      
      // Text and number inputs
      const textInputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
      textInputs.forEach(input => {
        try {
          input.value = '';
        } catch (error) {
          console.error('Error clearing text input:', error);
        }
      });
      
      // Update suggestion area
      if (suggestionArea) {
        suggestionArea.value = `Cleared ${clearButtons.length} "Clear Selection" buttons\n` +
                                `Reset ${inputs.length} input elements\n` +
                                `Cleared ${textInputs.length} text inputs`;
      }
    } else {
      // If no specific clear buttons found, do a general reset
      if (suggestionArea) {
        suggestionArea.value = 'No specific "Clear Selection" buttons found. Performing general form reset.';
      }
      
      // Fallback to a more general reset
      const form = document.querySelector('form');
      if (form) {
        form.reset();
      }
    }
  }

  // Function to ensure all buttons are properly connected
  function initializeButtonListeners() {
    // Minimize button
    const minimizeBtn = document.getElementById('ai-minimize-btn');
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => {
        const container = document.getElementById('ai-container');
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
      });
    }

    // Random Answers button
    const randomAnswersBtn = document.getElementById('ai-random-answers-btn');
    if (randomAnswersBtn) {
      randomAnswersBtn.addEventListener('click', comprehensiveRandomFormFilling);
    }

    // First Option button
    const firstOptionBtn = document.getElementById('ai-first-option-btn');
    if (firstOptionBtn) {
      firstOptionBtn.addEventListener('click', setFirstOptionDefault);
    }

    // Random Checkboxes button
    const randomCheckboxBtn = document.getElementById('ai-random-checkbox-btn');
    if (randomCheckboxBtn) {
      randomCheckboxBtn.addEventListener('click', randomizeCheckboxQuestions);
    }

    // Random Radio button
    const randomRadioBtn = document.getElementById('ai-random-radio-btn');
    if (randomRadioBtn) {
      randomRadioBtn.addEventListener('click', randomizeRadioQuestions);
    }

    // Random Select button
    const randomSelectBtn = document.getElementById('ai-random-select-btn');
    if (randomSelectBtn) {
      randomSelectBtn.addEventListener('click', randomizeSelectQuestions);
    }

    // Fill Unanswered button
    const fillUnansweredBtn = document.getElementById('ai-fill-unanswered-btn');
    if (fillUnansweredBtn) {
      fillUnansweredBtn.addEventListener('click', fillUnansweredQuestions);
    }

    // Clear All Selections button
    const clearAllBtn = document.getElementById('ai-clear-all-btn');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', clearAllSelections);
    }
  }

  // Initialize button listeners
  initializeButtonListeners();
}

// Enhanced function to extract question details
function extractQuestionDetails(formElement) {
  // Find all question containers
  const questionContainers = formElement.querySelectorAll('.que');
  
  // Store extracted questions
  const extractedQuestions = [];

  questionContainers.forEach(container => {
    // Extract question text
    const questionTextEl = container.querySelector('.qtext');
    const questionText = questionTextEl ? questionTextEl.textContent.trim() : 'Untitled Question';

    // Extract prompt (if exists)
    const promptEl = container.querySelector('.prompt');
    const prompt = promptEl ? promptEl.textContent.trim() : 'Choose an option:';

    // Extract options
    const radioOptions = container.querySelectorAll('input[type="radio"]');
    const options = Array.from(radioOptions).map(radio => {
      const label = container.querySelector(`label[for="${radio.id}"]`);
      return {
        value: radio.value,
        text: label ? label.textContent.trim() : 'Unknown Option',
        id: radio.id
      };
    });

    // Extract select options (if exists)
    const selectOptions = container.querySelectorAll('select option');
    const selectOptionDetails = Array.from(selectOptions).map((option, index) => ({
      value: option.value,
      text: option.text.trim(),
      label: String.fromCharCode(97 + index)
    }));

    // Prepare question details
    const questionDetails = {
      questionText: questionText,
      prompt: prompt,
      type: radioOptions.length > 0 ? 'radio' : 
            selectOptions.length > 0 ? 'select' : 'unknown',
      options: radioOptions.length > 0 ? options : selectOptionDetails
    };

    extractedQuestions.push(questionDetails);
  });

  return extractedQuestions;
}

// Function to update left textarea with question details
function updateLeftTextareaWithQuestionDetails() {
  // Get the left textarea
  const leftTextarea = document.getElementById('ai-form-html-code');
  
  // Find the form
  const form = document.querySelector('form');
  
  if (!form || !leftTextarea) return;

  // Extract question details
  const questions = extractQuestionDetails(form);

  // Prepare formatted text
  let formattedText = '';

  questions.forEach((question, index) => {
    // Add question number
    formattedText += `Question ${index + 1}:\n`;
    
    // Add question text
    formattedText += `${question.questionText}\n`;
    
    // Add prompt
    formattedText += `${question.prompt}\n`;
    
    // Add options
    question.options.forEach((option, optIndex) => {
      // Use alphabetical labels for options
      const label = String.fromCharCode(97 + optIndex);
      formattedText += `${label}. ${option.text} (value: ${option.value})\n`;
    });
    
    // Add separator between questions
    formattedText += '\n';
  });

  // Update textarea
  leftTextarea.value = formattedText;
}

// Modify the existing function to call question details extraction
function extractFormHTML() {
  // Original extraction logic
  const firstForm = document.querySelector('form');
  if (!firstForm) {
    console.warn('No form found on the page');
    return;
  }

  // Get the textarea
  const htmlTextarea = document.getElementById('ai-form-html-code');
  const suggestionArea = document.getElementById('ai-global-suggestion');

  // Extract full HTML
  const formHTML = firstForm.outerHTML;
  
  // Display HTML in textarea
  if (htmlTextarea) {
    htmlTextarea.value = formatXml(formHTML);
  }

  // Update suggestion area
  if (suggestionArea) {
    suggestionArea.value = `Form HTML extracted. Total length: ${formHTML.length} characters.`;
  }

  // NEW: Update left textarea with question details
  updateLeftTextareaWithQuestionDetails();

  return formHTML;
}

// Function to create an enhanced floating textarea with AI integration
function createEnhancedFloatingTextarea() {
  // Coze AI Configuration
  const COZE_API_KEY = 'pat_2R3oaaWVgYYzwl6fE17d4TUXI7Vrj2axBHAq9itiSvaQCSfDRdP1TB6EUxK17xBC';
  const COZE_BOT_ID = '7446605387228397603';
  const COZE_API_URL = 'https://api.coze.cn/open_api/v2/chat';

  // Create main container
  const container = document.createElement('div');
  container.id = 'ai-enhanced-container';
  container.style.cssText = `
    position: fixed; 
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
    width: 450px;
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    z-index: 10001;
    padding: 15px;
    display: flex;
    flex-direction: column;
    cursor: move;
  `;

  // Create header
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  `;

  // Window title
  const windowTitle = document.createElement('h3');
  windowTitle.id = 'ai-area-navigator-title';
  windowTitle.textContent = 'Jack';
  windowTitle.style.cssText = `
    margin: 0;
    font-size: 16px;
  `;

  // Minimize/Maximize button
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '−';
  toggleBtn.style.cssText = `
    background: none;
    border: none;
    color: #888;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  `;

  // Prompt Input
  const promptInput = document.createElement('input');
  promptInput.type = 'text';
  promptInput.id = 'ai-form-prompt';
  promptInput.value = "help me answer the form all question to be correct answer, but do not change other any code, you only could change the question to be correct, if not correct answer set one nearst or random answer, but must answer every question";
  promptInput.style.cssText = `
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    font-size: 12px;
  `;

  // Form HTML Textarea
  const formHtmlTextarea = document.createElement('textarea');
  formHtmlTextarea.id = 'ai-form-html-code';
  formHtmlTextarea.placeholder = 'Form HTML will be automatically extracted...';
  formHtmlTextarea.style.cssText = `
    width: 100%;
    height: 200px;
    resize: vertical;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 8px;
    font-size: 12px;
    font-family: 'Courier New', monospace;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-y: auto;
    margin-bottom: 10px;
  `;

  // AI Response Textarea (Green)
  const aiResponseTextarea = document.createElement('textarea');
  aiResponseTextarea.id = 'ai-response-code';
  aiResponseTextarea.placeholder = 'AI response will appear here...';
  aiResponseTextarea.style.cssText = `
    width: 100%;
    height: 200px;
    resize: vertical;
    border: 1px solid #2ecc71;
    border-radius: 6px;
    padding: 8px;
    font-size: 12px;
    font-family: 'Courier New', monospace;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-y: auto;
    margin-bottom: 10px;
    background-color: #e8f5e9;
  `;

  // Function to submit the form
  function submitForm() {
    // Find the first form on the page
    const form = document.querySelector('form');
    
    // Find submit buttons within the form
    const submitButtons = form ? 
      form.querySelectorAll('input[type="submit"], button[type="submit"]') : 
      [];

    // Logging and suggestion area
    const suggestionArea = document.getElementById('ai-global-suggestion');
    
    // If no explicit submit button, try to submit the form directly
    if (form) {
      try {
        // Check if there are any submit buttons
        if (submitButtons.length > 0) {
          // Click the first submit button
          submitButtons[0].click();
          
          // Log success
          if (suggestionArea) {
            suggestionArea.value = 'Form submitted successfully using first submit button.';
          }
          console.log('Form submitted via first submit button');
        } else {
          // Fallback to form submission
          form.submit();
          
          // Log success
          if (suggestionArea) {
            suggestionArea.value = 'Form submitted directly.';
          }
          console.log('Form submitted directly');
        }
      } catch (error) {
        // Log any errors
        console.error('Error submitting form:', error);
        
        if (suggestionArea) {
          suggestionArea.value = `Form submission failed: ${error.message}`;
        }
      }
    } else {
      // No form found
      console.warn('No form found to submit');
      
      if (suggestionArea) {
        suggestionArea.value = 'No form found to submit.';
      }
    }
  }

  // Send to AI Button
  const sendToAiBtn = document.createElement('button');
  sendToAiBtn.textContent = 'Send to AI';
  sendToAiBtn.style.cssText = `
    background-color: #3498db;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    transition: background-color 0.2s;
    margin-right: 10px;
  `;

  // Submit Form button
  const submitFormBtn = document.createElement('button');
  submitFormBtn.textContent = 'Submit Form';
  submitFormBtn.style.cssText = `
    background-color: #2ecc71;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    transition: background-color 0.2s;
  `;

  // Extract and format form HTML function
  function extractFormHTML() {
    const firstForm = document.querySelector('form');
    
    if (firstForm) {
      let formHTML = firstForm.outerHTML;
      
      try {
        formHTML = formatXml(formHTML);
      } catch (error) {
        console.warn('Could not format HTML:', error);
      }
      
      formHtmlTextarea.value = formHTML;
      
      const suggestionArea = document.getElementById('ai-global-suggestion');
      if (suggestionArea) {
        suggestionArea.value = `Extracted HTML from first form\nTotal length: ${formHTML.length} characters`;
      }
    } else {
      formHtmlTextarea.value = 'No form found on the page.';
      
      const suggestionArea = document.getElementById('ai-global-suggestion');
      if (suggestionArea) {
        suggestionArea.value = 'Could not find any form on the page.';
      }
    }
  }

  // Send to AI function with Coze AI integration
  async function sendToAI() {
    // Get elements
    const promptInput = document.getElementById('ai-form-prompt');
    const formHtmlTextarea = document.getElementById('ai-form-html-code');
    const aiResponseTextarea = document.getElementById('ai-response-code');
    const suggestionArea = document.getElementById('ai-global-suggestion');

    // Prepare the prompt
    const prompt = `${promptInput.value}\n\nForm HTML:\n${formHtmlTextarea.value}`;

    // Update UI to show processing
    aiResponseTextarea.value = 'Processing AI request...';
    if (suggestionArea) {
      suggestionArea.value = 'Sending request to Coze AI...';
    }

    try {
      // Prepare the request
      const response = await fetch(COZE_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COZE_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Host': 'api.coze.cn'
        },
        body: JSON.stringify({
          bot_id: COZE_BOT_ID,
          user: "chrome_extension_user",
          query: prompt,
          stream: false
        })
      });

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the response
      const data = await response.json();

      // Extract the AI's response
      const aiResponse = data.messages.find(msg => msg.type === 'answer')?.content || 'No response from AI';

      // Update the AI response textarea
      aiResponseTextarea.value = aiResponse;

      // Update suggestion area
      if (suggestionArea) {
        suggestionArea.value = 'AI response received successfully!';
      }

    } catch (error) {
      // Handle any errors
      console.error('Error sending request to Coze AI:', error);
      
      aiResponseTextarea.value = `Error: ${error.message}`;
      
      if (suggestionArea) {
        suggestionArea.value = `AI Request Failed: ${error.message}`;
      }
    }
  }

  // Event Listeners
  sendToAiBtn.addEventListener('click', sendToAI);
  submitFormBtn.addEventListener('click', submitForm);

  // Minimize/Maximize toggle
  toggleBtn.addEventListener('click', () => {
    const elementsToToggle = [
      promptInput, 
      formHtmlTextarea, 
      aiResponseTextarea, 
      sendToAiBtn, 
      submitFormBtn
    ];

    elementsToToggle.forEach(el => {
      el.style.display = el.style.display === 'none' ? 'block' : 'none';
    });

    toggleBtn.textContent = toggleBtn.textContent === '−' ? '+' : '−';
  });

  // Assemble the container
  header.appendChild(windowTitle);
  header.appendChild(toggleBtn);
  container.appendChild(header);
  container.appendChild(promptInput);
  container.appendChild(formHtmlTextarea);
  
  // Button container
  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = `
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  `;
  buttonContainer.appendChild(sendToAiBtn);
  buttonContainer.appendChild(submitFormBtn);
  container.appendChild(buttonContainer);
  
  container.appendChild(aiResponseTextarea);

  // Add to body
  document.body.appendChild(container);

  // Make the container draggable (same dragging logic as before)
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  header.addEventListener('mousedown', dragStart);
  document.addEventListener('mouseup', dragEnd);
  document.addEventListener('mousemove', drag);

  function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === header) {
      isDragging = true;
    }
  }

  function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;

    isDragging = false;
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      xOffset = currentX;
      yOffset = currentY;

      setTranslate(currentX, currentY, container);
    }
  }

  function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
  }
}

// Modify initialization to create all windows, with Jack window hidden by default
function initializeExtension() {
  // Ensure the AI textarea is added as soon as possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createGlobalAITextarea();
      // Create enhanced floating textarea, but keep it hidden
      const enhancedTextarea = createEnhancedFloatingTextarea();
      enhancedTextarea.style.display = 'none';
      createSuperMovingWindow();
    });
  } else {
    createGlobalAITextarea();
    // Create enhanced floating textarea, but keep it hidden
    const enhancedTextarea = createEnhancedFloatingTextarea();
    enhancedTextarea.style.display = 'none';
    createSuperMovingWindow();
  }
}

// Modify toggleEnhancedFloatingTextarea to toggle visibility
function toggleEnhancedFloatingTextarea() {
  const existingTextarea = document.getElementById('enhanced-floating-textarea');
  if (existingTextarea) {
    if (existingTextarea.style.display === 'none') {
      existingTextarea.style.display = 'block';
    } else {
      existingTextarea.style.display = 'none';
    }
  } else {
    // If it doesn't exist, create it
    const newTextarea = createEnhancedFloatingTextarea();
    newTextarea.style.display = 'block';
  }
}

// Start the extension
initializeExtension();
