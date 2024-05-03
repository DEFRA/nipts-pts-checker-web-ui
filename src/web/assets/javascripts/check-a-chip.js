//core function for processing ajax requests

function coreAjaxRequestPOST(ajaxfunction, data) {
  var httpRequest;

  if (window.XMLHttpRequest) {
    //Moxilla, Safari, ...
    httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    //IE
    try {
      httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {}
    }
  }

  if (!httpRequest) {
    alert("Giving up :( Cannot create and XMLHTTP instance");
    return false;
  }

  switch (ajaxfunction) {
    case "CHECKACHIP":
      httpRequest.onreadystatechange = function() {
        checkAChipOut(httpRequest, data);
      };
      break;
    case "SUBMITCONTACT":
      httpRequest.onreadystatechange = function() {
        contactFormValidateOut(httpRequest, data);
      };
      break;
    case "SUBMITOVERSEASREG":
      httpRequest.onreadystatechange = function() {
        overseasRegValidateOut(httpRequest, data);
      };
      break;
  }

  if (ajaxfunction == "CHECKACHIP") {
    var url = "/ajax/makeChecks.aspx";
  } else {
    var url = "/ajax/index.aspx";
  }

  var ajaxURL = url + "?function=" + ajaxfunction;

  //send request
  httpRequest.open("POST", ajaxURL, true);
  httpRequest.setRequestHeader("Content-Type", "text/plain");
  httpRequest.send(data);
}

function checkAChip(strInputField) {
  //hide error from any previous attempts
  $("#divError").hide();

  var varSearchData = $("#" + strInputField).val();

  if (varSearchData != "") {
    if (checkChipLength(varSearchData)) {
      //disable button
      $("#btnSearch i").attr("class", "fa fa-spinner fa-spin");
      $("#btnSearch span").text("Searching");
      $("#btnSearch").prop("disabled", true);
      $("#chipSearch").prop("disabled", true);

      var varChipSearch = new Object();

      varChipSearch.process = "CHECKACHIP";
      varChipSearch.strMicroChip = $("#" + strInputField).val();

      var varJSONChipSearch = JSON.stringify(varChipSearch);
      coreAjaxRequestPOST("CHECKACHIP", varJSONChipSearch);
    } else {
      $("#divError").show();
      $("#divError").html(
        "Incorrect Length - A MicroChip will usually be 15 digits long"
      );
    }
  } else {
    $("#divError").show();
    $("#divError").html("Please enter a microchip number to search");
  }
}

function checkAChipOut(httpRequest, data) {
  if (httpRequest.readyState == 4) {
    if (httpRequest.status == 500) {
      //error making the request
    } else if (httpRequest.status == 200) {
      //reset button and clear search box
      $("#divSearch").hide();
      $("#divResultsCard").show();

      if (httpRequest.responseText != "ERROR") {
        $("#divSearchResults").html(httpRequest.responseText);
      } else {
        $("#divSearchResults").html(httpRequest.responseText);
        //error
      }
    }
  }
}

function isChipValid(varCheckOnly) {
  var varItem = "#" + event.target.id;
  var varEntry = $(varItem).val();

  //remove other chars
  varEntry = varEntry
    .replace(".", "")
    .replace("*", "")
    .toUpperCase();

  if (checkChipLength(varEntry)) {
    $(varItem).addClass("is-valid");
    $(varItem).removeClass("is-invalid");

    //if varCheckOnly = true then don't disable the button, just deal with the class
    if (varCheckOnly != "true") {
      $(".btn").prop("disabled", false);
    }
  } else {
    $(varItem).addClass("is-invalid");
    $(varItem).removeClass("is-valid");

    //if varCheckOnly = true then don't disable the button, just deal with the class
    if (varCheckOnly != "true") {
      $(".btn").prop("disabled", true);
    }
  }
}

function checkChipLength(chipnumber) {
  var varEntry = chipnumber;
  var varResponse = "false";

  //remove other chars
  varEntry = varEntry
    .replace(".", "")
    .replace("*", "")
    .toUpperCase();

  switch (varEntry.length) {
    case 10:
      if (isNaN(varEntry)) {
        varResponse = "true";
      }
      break;
    case 13:
      if (varEntry.substring(0, 4) === "AVID") {
        varResponse = "true";
      }
      break;
    case 15:
      if (!isNaN(varEntry)) {
        varResponse = "true";
      }
      break;
    case 16:
      if (varEntry.substring(0, 1) === "0") {
        varResponse = "true";
      }
      break;
  }

  if (varResponse == "true") {
    return true;
  } else {
    return false;
  }
}

function contactFormValidate() {
  //hide error from any previous attempts
  $("#divError").hide();

  if (("" + $("#enquiry").val()).length > 15) {
    if ($("#email").val() != "" || $("#telephone").val() != "") {
      //disable button
      $("#contact i").attr("class", "fa fa-spinner fa-spin");
      $("#contact span").text("Sending");
      $("#contact").prop("disabled", true);

      var varContactEnquiry = new Object();

      varContactEnquiry.strMicroChip = $("#microchip").val();
      varContactEnquiry.strName = $("#name").val();
      varContactEnquiry.strEmail = $("#email").val();
      varContactEnquiry.strTelephone = $("#telephone").val();
      varContactEnquiry.strAddress = $("#address").val();
      varContactEnquiry.strEnquiry = $("#enquiry").val();
      varContactEnquiry.strHiddenVal = $("#txtHiddenValue").val();

      var varJSONContactEnquiry = JSON.stringify(varContactEnquiry);
      coreAjaxRequestPOST("SUBMITCONTACT", varJSONContactEnquiry);
    } else {
      $("#modalContact").animate({ scrollTop: 0 }, "slow");
      $("#divError").show();
      $("#divError").html(
        "Missing Fields - Please enter an email address or contact number"
      );
    }
  } else {
    $("#modalContact").animate({ scrollTop: 0 }, "slow");
    $("#divError").show();
    $("#divError").html(
      "Missing Fields - Please enter a message describing your query, this needs to be more than just the MicroChip number"
    );
  }
}

function contactFormValidateOut(httpRequest, data) {
  if (httpRequest.readyState == 4) {
    if (httpRequest.status == 500) {
      //error making the request
    } else if (httpRequest.status == 200) {
      if (httpRequest.responseText != "ERROR") {
        $("#divSuccess").html(httpRequest.responseText);
      } else {
        //error
        $("#modalContact").animate({ scrollTop: 0 }, "slow");
        $("#divError").show();
        $("#divError").html(httpRequest.responseText);
      }
    }
  }
}

function overseasRegValidate() {
  //hide error from any previous attempts
  $("#divOverseasError").hide();

  var varMicroChip = $("#overseasMicrochip")
    .val()
    .replace(".", "")
    .replace("*", "")
    .toUpperCase();

  if (varMicroChip != "" && checkChipLength(varMicroChip)) {
    if (varMicroChip == $("#txtHiddenChip").val()) {
      if (
        $("#overseasEmail").val() != "" &&
        $("#overseasEmail")
          .val()
          .indexOf("@") > -1 &&
        $("#overseasEmail")
          .val()
          .indexOf(".") > -1
      ) {
        if (
          $("#overseasName").val() != "" &&
          $("#overseasTelephone").val() != ""
        ) {
          if ($("#overseasCountry").val() != "") {
            //disable button
            $("#contact i").attr("class", "fa fa-spinner fa-spin");
            $("#contact span").text("Sending");
            $("#contact").prop("disabled", true);

            var varOverseasRegistration = new Object();

            varOverseasRegistration.strMicroChip = $("#overseasMicrochip")
              .val()
              .replace("|", "");
            varOverseasRegistration.strName = $("#overseasName")
              .val()
              .replace("|", "");
            varOverseasRegistration.strEmail = $("#overseasEmail")
              .val()
              .replace("|", "");
            varOverseasRegistration.strTelephone = $("#overseasTelephone")
              .val()
              .replace("|", "");
            varOverseasRegistration.strCountryOfOrigin = $("#overseasCountry")
              .val()
              .replace("|", "");
            varOverseasRegistration.strHiddenVal = $("#txtHiddenValue").val();

            var varJSONOverseasEnquiry = JSON.stringify(
              varOverseasRegistration
            );
            coreAjaxRequestPOST("SUBMITOVERSEASREG", varJSONOverseasEnquiry);
          } else {
            $("#modalOverseasReg").animate({ scrollTop: 0 }, "slow");
            $("#divOverseasError").show();
            $("#divOverseasError").html(
              "Please ensure you have entered the country your animal was implanted in.<br> If you are not sure, please enter 'Unknown'"
            );
          }
        } else {
          $("#modalOverseasReg").animate({ scrollTop: 0 }, "slow");
          $("#divOverseasError").show();
          $("#divOverseasError").html(
            "Please ensure you have entered your name and contact number and try again"
          );
        }
      } else {
        $("#modalOverseasReg").animate({ scrollTop: 0 }, "slow");
        $("#divOverseasError").show();
        $("#divOverseasError").html(
          "Please enter a valid email address and try again"
        );
      }
    } else {
      $("#modalOverseasReg").animate({ scrollTop: 0 }, "slow");
      $("#divOverseasError").show();
      $("#divOverseasError").html(
        "The microchip number entered is different than the one you searched for. Please double check the chip number and search again."
      );
    }
  } else {
    $("#modalOverseasReg").animate({ scrollTop: 0 }, "slow");
    $("#divOverseasError").show();
    $("#divOverseasError").html(
      "Please check and enter the microchip number again as it appears to be incorrect"
    );
  }
}

function overseasRegValidateOut(httpRequest, data) {
  if (httpRequest.readyState == 4) {
    if (httpRequest.status == 500) {
      //error making the request
    } else if (httpRequest.status == 200) {
      if (httpRequest.responseText != "ERROR") {
        $("#divOverseasSuccess").html(httpRequest.responseText);
      } else {
        //error
        $("modalOverseasReg").animate({ scrollTop: 0 }, "slow");
        $("divOverseasError").show();
        $("divOverseasError").html(httpRequest.responseText);
      }
    }
  }
}

//hides element
function hideElement(strElement) {
  document.getElementById(strElement).style.display = "none";
}

//show element
function showElement(strElement) {
  document.getElementById(strElement).style.display = "";
}

//toggle visibility
function showHideElement(strElement) {
  if (document.getElementById(strElement).style.display == "none") {
    document.getElementById(strElement).style.display = "";
  } else {
    document.getElementById(strElement).style.display = "none";
  }
}

function functionOnEnter(field, event, data) {
  var keyCode = event.keyCode
    ? event.keyCode
    : event.which
    ? event.which
    : event.charCode;
  if (event.keyCode === 13) {
    event.preventDefault(); // Ensure it is only this code that runs and not form submission

    //now fire an event based on the id of the item firing the event
    switch (field.id) {
      case "chipSearch":
        checkAChip("chipSearch");
        break;
    }
  }
}

function noReturn(field, event) {
  var keyCode = event.keyCode
    ? event.keyCode
    : event.which
    ? event.which
    : event.charCode;
  if (keyCode == 13) {
    return false;
  } else {
    return true;
  }
}




function isChipValid(varCheckOnly) {
  var varItem = "#" + event.target.id;
  var varEntry = $(varItem).val();

  //remove other chars
  varEntry = varEntry
    .replace(".", "")
    .replace("*", "")
    .toUpperCase();

  if (checkChipLength(varEntry)) {
    $(varItem).addClass("is-valid");
    $(varItem).removeClass("is-invalid");

    //if varCheckOnly = true then don't disable the button, just deal with the class
    if (varCheckOnly != "true") {
      $(".btn").prop("disabled", false);
    }

    if ($("#lblMicroChipErrorMessage").length) {
      hideElement("lblMicroChipErrorMessage");
    }
  } else {
    $(varItem).addClass("is-invalid");
    $(varItem).removeClass("is-valid");

    //if varCheckOnly = true then don't disable the button, just deal with the class
    if (varCheckOnly != "true") {
      $(".btn").prop("disabled", true);
    }

    if (varEntry.length > 13) {
      if ($("#lblMicroChipErrorMessage").length) {
        showElement("lblMicroChipErrorMessage");
      }
    }
  }
}

function checkChipLength(chipnumber) {
  var varEntry = chipnumber;
  var varResponse = "false";

  //remove other chars
  varEntry = varEntry
    .replace(".", "")
    .replace("*", "")
    .replace(" ", "")
    .toUpperCase();

  switch (varEntry.length) {
    case 10:
      varResponse = "true";
      break;
    case 13:
      if (varEntry.substring(0, 4) === "AVID") {
        varResponse = "true";
      }
      break;
    case 15:
      varResponse = "true";
      break;
    case 16:
      if (varEntry.substring(0, 1) === "0") {
        varResponse = "true";
      }
      break;
  }

  if (varResponse == "true") {
    return true;
  } else {
    return false;
  }
}