document.addEventListener("DOMContentLoaded", () => {
  const navigation = document.querySelector(".pts-checker-navigation");
  if (navigation) {
    navigation.style.display = "none";
  }

  const form = document.getElementById("sailingForm");
  const errorSummary = document.getElementById("error-summary");
  const errorList = document.getElementById("error-summary-list");
  const routeRadioGroup = document.getElementById("routeradio-group");
  const routeRadioError = document.getElementById("routeradio-error");
  const timeGroup = document.getElementById("time-group");
  const timeError = document.getElementById("time-error");
  const errorSummaryInner = document.getElementById("error-summary-Inner");

  form.addEventListener("submit", (event) => {
    errorSummary.hidden = true;
    errorList.innerHTML = "";
    routeRadioError.hidden = true;
    routeRadioGroup.classList.remove("govuk-form-group--error");
    timeError.hidden = true;
    timeGroup.classList.remove("govuk-form-group--error");

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const errors = validateForm(data);

    if (errors.length > 0) {
      event.preventDefault();
      errors.forEach((error) => {
        const li = document.createElement("li");
        const anchorTag = document.createElement("a");
        anchorTag.href = `#${error.context.key}`;
        anchorTag.innerText = error.message;
        li.appendChild(anchorTag);
        errorList.appendChild(li);

        if (error.context.key === "routeRadio") {
          routeRadioError.hidden = false;
          routeRadioGroup.classList.add("govuk-form-group--error");
        }

        if (
          error.context.key === "sailingHour" ||
          error.context.key === "sailingMinutes"
        ) {
          timeError.hidden = false;
          timeGroup.classList.add("govuk-form-group--error");
        }
      });
      errorSummary.hidden = false;
      errorSummaryInner.setAttribute("tabindex", "-1");
      errorSummaryInner.focus();
    }
  });

  function validateForm(data) {
    const errors = [];

    if (!data.routeRadio) {
      errors.push({
        message: "Please select a route",
        context: { key: "routeRadio" },
      });
    }

    if (!data.sailingHour || !data.sailingMinutes) {
      errors.push({
        message: "Please select a valid sailing time",
        context: { key: "sailingHour" },
      });
    }

    return errors;
  }
});
