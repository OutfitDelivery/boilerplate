  // get sidebar element on the current page
  let getSidebar = () => {
    let sidebar = window.parent.document.querySelectorAll(".sidebar .current-list");
    return [...sidebar].pop();
  }
  
  let showMTOMessage = (message) => {
    sidebar.querySelector(formGroupClassList).innerHTML = message;
  }
  let correctInputName = (name) => {
    return sidebar.querySelector(".flex.items-center .h-3.ff-open-sans.truncate").innerText === name;
  }
  
  let hideInput = (inputValue) => {
    sidebar.querySelectorAll(".sidebar-items").find((input) => {
      input.querySelector(".field-variable-tag").innerText == inputValue
    }).style.display = 'none';
  }
  // gobal varbiles to avoid needed to retreve these more than once 
  var sidebar = getSidebar();
  // get the state of the docment in order to tell if it's a template/document/export
  var state = document.body.getAttribute("document-state");
  
  var setupMTO = (mtoList, mtoParams, inputData, settings) => {
    try {
      let { inputName, inputListClassList, formGroupClassList } = mtoParams;
    
      if (inputName == "") {
        throw "MTO Input Name Not Defined";
      }
   
      mtoList = mtoList.toLowerCase().split("_").join(" ").split(',');
  
      if (!mtoList && state !== "template") {
        if (correctInputName(inputName)) {
          // The user has selected into the MTO input, however some their team is not allowed to use MTO, show an error.
          showMTOMessage("MTO is not available for your team. Please click back to continue editing your document.");
        } else {
          hideInput(inputName);
        }
        return;
      }
  
      let data = JSON.parse(inputData);
      
      if (state === "export" || !sidebar) {
        if (typeof handleMTOData == 'function')
          handleMTOData(data, settings);
        return;
      }
  
      if (state === "template") {
        if (correctInputName(inputName)) {
          showMTOMessage(
            "MTO functionality is not available on a template level."
          );
        }
        return;
      }
      let hideTeamMetadata = () => {
        getSidebar().querySelectorAll('.search-bar-wrapper').forEach(el => el.remove())
        getSidebar().querySelectorAll('.action-buttons').forEach(el => el.remove())
        getSidebar().querySelectorAll(inputListClassList).forEach((inputOption) => {
          if (!mtoList.includes(inputOption.querySelector("input").value)) {
            inputOption.remove();
          } else {
            let span = inputOption.querySelector("span");
            if (span.innerText.match(/^[0-9]{4}/g)) {
              span.innerText = span.innerText.substring(7);
            }
          }
        });
      }
      setInterval(() => hideTeamMetadata(), 500)
      hideTeamMetadata();
      if (typeof handleMTOData == 'function') 
        handleMTOData(data, settings);
    } catch (error) {
      console.error("An MTO error has occurred. Please try again later. If the issue still persists please contact Outfit Support");
      console.error("MTO Error: " + error);
      return;
    }
  }