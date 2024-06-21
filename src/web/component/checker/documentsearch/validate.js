function isPtdNumber(str) {
  // A-F, 0-9
  return /^[a-fA-F0-9]+$/.test(str);
}

function isApplicationNumber(str) {
  // A-Z, 0-9
  return /^[a-zA-Z0-9]+$/.test(str);
}


const validatePtdNumber = (ptdNumber) => {
  const result = {
    isValid: true,
    error: null,
  };
  
  // Mandatory
  if (!ptdNumber || ptdNumber.length === 0) {
    result.isValid = false;
    result.error = "Enter a PTD number";
    return result;
  }

  // More or less than 6 characters
  if (ptdNumber.length !== 6) {
    result.isValid = false;
    result.error = "Enter 6 characters after 'GB826'";
    return result;
  }

  if (!isPtdNumber(ptdNumber)) {
    result.isValid = false;
    result.error =
      "Enter 6 characters after 'GB826', using only letters and numbers";
    return result;
  }

  return result;
};

const validateApplicationNumber = (applicationNumber) => {

  var result = {
    isValid: true,
    error: null,
  };

  // Mandatory
  if (!applicationNumber || applicationNumber.length === 0) {
    result.isValid = false;
    result.error = "Enter an application number";
    return result;
  }

  // More or less than 8 characters
  if (applicationNumber.length != 8) {
    result.isValid = false;
    result.error = "Enter 8 characters";
    return result;
  }

  if (!isApplicationNumber(applicationNumber)) {
    result.isValid = false;
    result.error =
      "Enter an application number, using only letters and numbers";
    return result;
  }

  return result;
};


const validateMicrochipNumber = (microchipNumber) => {
  const result = {
    isValid: true,
    error: null,
  };

  // Mandatory
  if (!microchipNumber || microchipNumber.length === 0) {
    result.isValid = false;
    result.error = "Enter a microchip number";
    return result;
  }

  // Must be 15 digits
  if (!/^\d{15}$/.test(microchipNumber)) {
    result.isValid = false;
    result.error = "Enter a 15-digit number";
    return result;
  }

  return result;
};

export { validatePtdNumber, validateApplicationNumber, validateMicrochipNumber };
