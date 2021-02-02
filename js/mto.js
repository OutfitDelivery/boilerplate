function setupMTO(mtoList, mtoParams, inputData, additionalData = null) {
  try {
    let mtoInputName = mtoParams["inputName"];
    let formGroupClassList = mtoParams["formGroupClassList"];

    if (mtoInputName == "") {
      throw "MTO Input Name Not Defined";
    }

    mtoList = mtoList.split("_").join(" ").toLowerCase();

    var sidebar = getSidebar();
    var state = getOutfitState();
    if ((mtoList == "" || mtoList == null) && state != "template") {
      if (correctInputName(mtoInputName)) {
        //The user has selected into the MTO input, however some their team is not allowed to use MTO, show an error.
        showMTOMessage("MTO is not available for your team. Please click back to continue editing your document.", formGroupClassList);
      } else {
        hideInput(mtoInputName);
      }

      return;
    }

    if (state == "export" || sidebar == null) {
      handleMTOData(JSON.parse(inputData), additionalData);
      return;
    }

    if (state === "template") {
      if (correctInputName(mtoInputName)) {
        showMTOMessage("MTO functionality is not available on a template level.", formGroupClassList);
      }

      return;
    }

    let inputList = sidebar.querySelectorAll(inputListClass);
    inputList.forEach((inputOption) => {
      let teamName = inputOption.querySelector("span").innerText.toLowerCase();
      if (!mtoList.includes(teamName)) {
        inputOption.remove();
      }
    });

    handleMTOData(JSON.parse(inputData), additionalData);
  } catch (error) {
    console.error("An MTO error has occurred. Please try again later. If the issue still persists please contact Outfit Support");
    console.error("MTO Error: " + error);
    return;
  }
}

function showMTOMessage(message, formGroupClassList) {
  var sidebar = getSidebar();
  var formGroup = sidebar.querySelector(formGroupClassList);
  var inputList = formGroup.querySelector("div");

  if (inputList != null) {
    inputList.remove();
  }

  if (getSidebar().querySelector(`${formGroupClassList} div`) == null) {
    formGroup.innerHTML = message;
  }
}
