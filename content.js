// Coze AI Configuration
const COZE_API_KEY = 'pat_2R3oaaWVgYYzwl6fE17d4TUXI7Vrj2axBHAq9itiSvaQCSfDRdP1TB6EUxK17xBC';
const COZE_BOT_ID = '7446605387228397603';
const COZE_API_URL = 'https://api.coze.cn/open_api/v2/chat';

async function extractFormHTML() {
  // Find all forms on the page
  const forms = document.querySelectorAll('form');
  
  // Remove any existing form extraction textareas
  const existingTextareas = document.querySelectorAll('.form-extractor-container');
  existingTextareas.forEach(el => el.remove());
  
  // If no forms found, silently return
  if (forms.length === 0) {
    return;
  }
  
  // Use only the first form
  const firstForm = forms[0];
  
  // Create main container
  const container = document.createElement('div');
  container.classList.add('form-extractor-container');
  container.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    width: 500px;
    max-height: 80vh;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
  `;
  
  // Blue textarea for original form HTML
  const blueTextarea = document.createElement('textarea');
  blueTextarea.id = 'original-form-html';
  blueTextarea.style.cssText = `
    width: 100%;
    height: 300px;
    background-color: lightblue;
    border: 2px solid blue;
    padding: 10px;
    font-family: monospace;
    resize: vertical;
    overflow: auto;
  `;
  
  // Set blue textarea content with the first form's HTML and instructions
  blueTextarea.value = `${firstForm.outerHTML}

---INSTRUCTIONS---
help me edit the code all radio and checkbox values to set right answers, but do not change other code. If some question has no current answer, choose a most closes one or random to choose one, but must choose one answer.`;
  
  // Store reference to the first form
  const formId = 'first-form';
  firstForm.setAttribute('data-form-extractor-id', formId);
  
  // Ask AI Button
  const askAIButton = document.createElement('button');
  askAIButton.textContent = 'Ask AI to Modify Form';
  askAIButton.style.cssText = `
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    margin-bottom: 10px;
  `;
  
  // Green textarea for AI response
  const greenTextarea = document.createElement('textarea');
  greenTextarea.id = 'ai-modified-form-html';
  greenTextarea.style.cssText = `
    width: 100%;
    height: 300px;
    background-color: lightgreen;
    border: 2px solid green;
    padding: 10px;
    font-family: monospace;
    resize: vertical;
    overflow: auto;
  `;
  
  // Apply to Page Button
  const applyButton = document.createElement('button');
  applyButton.textContent = 'Apply Modified Form';
  applyButton.style.cssText = `
    background-color: #2196F3;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
  `;
  
  // Close Button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.style.cssText = `
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: red;
    color: white;
    border: none;
    cursor: pointer;
  `;
  closeButton.onclick = () => container.remove();
  
  // Ask AI Button Click Handler (Using Coze AI API)
  askAIButton.onclick = async () => {
    // Disable button during API call
    askAIButton.disabled = true;
    askAIButton.textContent = 'Asking AI...';
    greenTextarea.value = 'Waiting for AI response...';
    
    try {
      // Prepare the API request
      const response = await fetch(COZE_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COZE_API_KEY}`,
          'Content-Type': 'application/json',
          'Connection': 'keep-alive'
        },
        body: JSON.stringify({
          bot_id: COZE_BOT_ID,
          user: "chrome_extension_user",
          query: `Modify this HTML form to improve its usability and set appropriate default values. Here's the current form HTML:

${blueTextarea.value}

Instructions:
1. Optimize form layout and accessibility
2. Set sensible default values for inputs
3. Add helpful placeholders or hints
4. Ensure all inputs have proper labels
5. Improve form validation if possible

Return ONLY the modified HTML form code.`,
          stream: false
        })
      });
      
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Parse the response
      const data = await response.json();
      
      // Extract the AI's response (adjust based on actual Coze API response structure)
      const aiResponse = data.messages[0].content;
      
      // Update the green textarea with AI's response
      greenTextarea.value = aiResponse;
      
      // Re-enable the button
      askAIButton.disabled = false;
      askAIButton.textContent = 'Ask AI to Modify Form';
    } catch (error) {
      console.error('AI API Error:', error);
      greenTextarea.value = `Error: ${error.message}`;
      
      // Re-enable the button
      askAIButton.disabled = false;
      askAIButton.textContent = 'Ask AI to Modify Form';
    }
  };
  
  // Apply Button Click Handler
  applyButton.onclick = () => {
    // Reset button style initially
    applyButton.style.backgroundColor = '#2196F3';
    applyButton.textContent = 'Applying Modified Form...';
    
    try {
      // Find the form to replace
      const originalForm = document.querySelector(`[data-form-extractor-id="${formId}"]`);
      
      if (!originalForm) {
        throw new Error('Could not find the original form');
      }
      
      // Get the HTML from the green textarea
      const modifiedFormHTML = greenTextarea.value.trim();
      
      // Create a temporary div to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = modifiedFormHTML;
      const newForm = tempDiv.firstElementChild;
      
      // Preserve the original form's data-form-extractor-id
      newForm.setAttribute('data-form-extractor-id', formId);
      
      // Replace the original form with the modified form
      originalForm.parentNode.replaceChild(newForm, originalForm);
      
      // Success state
      applyButton.style.backgroundColor = '#4CAF50'; // Green
      applyButton.textContent = 'Form Updated Successfully ✓';
      
      // Optional: Revert button after 3 seconds
      setTimeout(() => {
        applyButton.style.backgroundColor = '#2196F3';
        applyButton.textContent = 'Apply Modified Form';
      }, 3000);
    } catch (error) {
      console.error('Form update error:', error);
      
      // Failure state
      applyButton.style.backgroundColor = '#F44336'; // Red
      applyButton.textContent = 'Form Update Failed ✗';
      
      // Optional: Revert button after 3 seconds
      setTimeout(() => {
        applyButton.style.backgroundColor = '#2196F3';
        applyButton.textContent = 'Apply Modified Form';
      }, 3000);
    }
  };
  
  // Assemble the container
  const headerDiv = document.createElement('div');
  headerDiv.style.position = 'relative';
  headerDiv.appendChild(closeButton);
  
  container.appendChild(headerDiv);
  container.appendChild(blueTextarea);
  container.appendChild(askAIButton);
  container.appendChild(greenTextarea);
  container.appendChild(applyButton);
  
  // Add container to the page
  document.body.appendChild(container);
}

// Run the extraction when the page loads
window.addEventListener('load', extractFormHTML);