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
  
  // Set blue textarea content with the first form's HTML
  blueTextarea.value = firstForm.outerHTML;
  
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
  
  // Ask AI Button Click Handler (Simulated AI Response)
  askAIButton.onclick = async () => {
    // In a real implementation, this would call an actual AI API
    const simulatedAIResponse = blueTextarea.value.replace(
      /(<input\s+type="(radio|checkbox)"[^>]*)\s*(checked)?([^>]*>)/gi, 
      '$1 checked="checked"$4'
    );
    
    greenTextarea.value = simulatedAIResponse;
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