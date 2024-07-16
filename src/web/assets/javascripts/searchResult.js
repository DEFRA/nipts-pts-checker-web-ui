document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchResultForm");
  const errorSummary = document.getElementById("error-summary");
  const radioCheckError = document.getElementById("radio-check-error");
  const searchRadioGroup = document.getElementById("searchradio-group");
  const errorList = document.getElementById("error-summary-list");
  const errorSummaryInner = document.getElementById("error-summary-Inner");

  form.addEventListener("submit", async (event) => {
    errorList.innerHTML = "";
    errorSummary.hidden = true;
    if (radioCheckError) radioCheckError.hidden = true;
    searchRadioGroup.classList.remove("govuk-form-group--error");

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const errors = validateForm(data);

    if (errors.length > 0) {
      event.preventDefault();
      errors.forEach((error) => {
        const li = document.createElement("li");
        if (error.fieldId === "unexpected") {
          li.innerText = error.message;
          form.hidden = true;
        } else {
          const anchorTag = document.createElement("a");
          anchorTag.href = `#${error.context.key}`;
          anchorTag.innerText = error.message;
          li.appendChild(anchorTag);

          if (error.context.key === "checklist") {
            if (radioCheckError) radioCheckError.hidden = false;
            searchRadioGroup.classList.add("govuk-form-group--error");
          }
        }
        errorList.appendChild(li);
      });
      errorSummary.hidden = false;
      errorSummaryInner.setAttribute("tabindex", "-1");
      errorSummaryInner.focus();
    }
  });

  function validateForm(data) {
    const errors = [];
    if (data.radioButtonsPresent === "true" && !data.checklist) {
      errors.push({
        message: "Select an option",
        context: { key: "checklist" },
      });
    }
    return errors;
  }
});
