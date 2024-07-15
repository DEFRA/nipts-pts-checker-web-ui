document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('searchResultForm');
    const errorSummary = document.getElementById('error-summary');
    const radioCheckError = document.getElementById('radio-check-error');
    const searchRadioGroup = document.getElementById('searchradio-group');
    const errorList = document.getElementById('error-summary-list');
    const errorSummaryInner = document.getElementById('error-summary-Inner');

   form.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorList.innerHTML = '';
        errorSummary.hidden = true;
        if(radioCheckError)
            radioCheckError.hidden = true;
        searchRadioGroup.classList.remove('govuk-form-group--error');

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(form.action, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });
    
            const result = await response.json();
            if (response.ok) {
              window.location.href = result.redirectTo;
            }
            else if (response.status === 400 && result.status === 'fail' && result.details) {
                const displayedErrors = new Set();
                result.details.forEach(error => {
                  if (!displayedErrors.has(error.message)) {
                    displayedErrors.add(error.message);
                    if(error.fieldId === 'unexpected')
                    {
                      const li = document.createElement('li');
                      li.innerText = error.message;
                      errorList.appendChild(li);
                      form.hidden = true;
                    }
                    else{                      
                      const li = document.createElement('li');
                      const anchorTag = document.createElement('a');
                      anchorTag.href = `#${error.context.key}`;
                      anchorTag.innerText = error.message;
                      li.appendChild(anchorTag);
                      errorList.appendChild(li);
    
                      // Show specific error for route radio group
                      if (error.context.key === 'checklist') {
                        if(radioCheckError)
                          radioCheckError.hidden = false;
                        searchRadioGroup.classList.add('govuk-form-group--error');
                      }
                    }
                   }
                });
                errorSummary.hidden = false;
                
                // Ensure the error summary is focusable and then focus it
                errorSummaryInner.setAttribute('tabindex', '-1');
                errorSummaryInner.focus();
              }
          } catch (error) {
            console.error('Unexpected error:', error);
          }

    });

});