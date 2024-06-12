document.addEventListener('DOMContentLoaded', () => {
    const navigation = document.querySelector('.pts-checker-navigation');
    if (navigation) {
      navigation.style.display = 'none';
    }

    const form = document.getElementById('sailingForm');
    const errorSummary = document.getElementById('error-summary');
    const errorList = document.getElementById('error-summary-list');
    const routeRadioGroup = document.getElementById('routeradio-group');
    const routeRadioError = document.getElementById('routeradio-error'); 
    const timeGroup = document.getElementById('time-group');
    const timeError = document.getElementById('time-error');  
    const errorSummaryInner = document.getElementById('error-summary-Inner');    
    
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      errorSummary.hidden = true;
      errorList.innerHTML = '';
      routeRadioError.hidden = true;
      routeRadioGroup.classList.remove('govuk-form-group--error');
      timeError.hidden = true;
      timeGroup.classList.remove('govuk-form-group--error');

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
                  const li = document.createElement('li');
                  const anchorTag = document.createElement('a');
                  anchorTag.href = `#${error.context.key}`;
                  anchorTag.innerText = error.message;
                  li.appendChild(anchorTag);
                  errorList.appendChild(li);

                  // Show specific error for route radio group
                  if (error.context.key === 'routeRadio') {
                    routeRadioError.hidden = false;
                    routeRadioGroup.classList.add('govuk-form-group--error');
                  } 
                  
                  if (error.context.key === 'sailingHour' || error.context.key === 'sailingMinutes') {
                    timeError.hidden = false;
                    timeGroup.classList.add('govuk-form-group--error');
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