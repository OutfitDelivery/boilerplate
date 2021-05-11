  // get sidebar element on the current page
  const getSidebar = () => {
    let sidebar = window.top.document.querySelectorAll(".sidebar .current-list");
    if (sidebar.length > 0) {
      return [...sidebar].pop();
    } else {
      return undefined;
    }
  }
  const hideInput = (inputValue) => {
    getSidebar().querySelectorAll(".sidebar-items")
    .forEach((input) => {
      if (input.querySelector(".field-variable-tag").innerText === inputValue) {
        input.style.display = 'none';
      }
    })
  }
  const setupMTO = (teamMetadata, teamsAllowed = '', inputName = 'Team metadata') => {
    return new Promise((resolve, reject) => {
      try {
        // const sidebar = getSidebar();
        // state isn't global in v2 so this line is needed for that version but shouldn't be included in v3
        // const state = document.body.getAttribute("document-state");
        if (!state) {
          reject('please set the state attribute')
        }
        // if we are on any other page then we don't need to do anything to the sidebar and we can skip everything
        if (state === "template") {
          let mtoNotSupported = () => {
            if (getSidebar().firstChild.firstChild.lastChild.innerText == inputName) {
                getSidebar().querySelector('.choice-variable').innerHTML = `<p>${inputName} functionality is not available on a template level.</p>`;
            }
          }
          setInterval(() => mtoNotSupported(), 500)
        }
        if (state === "document") {
        // turn teamsAllowed from string into array
          teamsAllowed = teamsAllowed.toLowerCase().split("_").join(" ").split(',').filter(n => n)
            let hideTeamsThatAreNotAllowed = () => {
              if (teamsAllowed.length > 0) {
                // if we are only allowing the user to select some of the teams then we should remove the ones that the user hasn't got access to. 
                if (getSidebar().firstChild.firstChild.lastChild.innerText == inputName) {
                  getSidebar().querySelectorAll('.search-bar-wrapper').forEach(el => el.remove())
                  getSidebar().querySelectorAll('.action-buttons').forEach(el => el.remove())
                  getSidebar().querySelectorAll('.choice-variable .multichoice-edit-row').forEach((inputOption) => {
                    if (!teamsAllowed.includes(inputOption.querySelector("input").value)) {
                      inputOption.remove();
                    } else {
                      let span = inputOption.querySelector("span");
                      // remove 4 digit number from start of input
                      if (span.innerText.match(/^[0-9]{4}/g)) {
                        span.innerText = span.innerText.substring(7);
                      }
                    }
                  });
                } else {
                  // This means we are not on the MTO sidebar 
                }
              } else {
                // getSidebar().querySelector('.choice-variable').innerHTML = `<p>${inputName} is not available for your team. Please click back to continue editing your document.</p>`;
                hideInput(inputName)
              }
            }
            setInterval(() => hideTeamsThatAreNotAllowed(), 500)
            hideTeamsThatAreNotAllowed();
          }
          if (state === "template") {
            getSidebar().querySelectorAll('.choice-variable').innerHTML = `<p>${inputName} is only available on the edit page.</p>`;
          }
          if (['document', 'export'].includes(state)) {
            if (typeof window.handleMTOData === 'function') {
              window.handleMTOData(teamMetadata);
            }
            resolve(teamMetadata);
          }
      } catch (error) {
        console.error("An MTO error has occurred. Please try again later. If the issue still persists please contact Outfit Support");
        reject(error);
      }
    })
  }


export { setupMTO, getSidebar };
