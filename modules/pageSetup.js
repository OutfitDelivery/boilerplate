const setOutfitState = () => {
    return new Promise((resolve) => {
        var mode = window.location.href.indexOf("exports") > -1 ? "export" : false;
        mode =
            !mode && window.location.href.indexOf("templates") > -1 ? "template" : mode;
        mode =
            !mode && window.location.href.indexOf("projects") > -1 ? "document" : mode;
        mode =
            !mode && window.location.href.indexOf("preview") > -1 ? "preview" : mode;
        mode =
            !mode && window.location.href.indexOf("localhost") > -1 ? "local" : mode;
        if (!mode) {
            mode = "error";
        }

        document.body.setAttribute("document-state", mode);
        window.state = mode;
        resolve(mode);
    })
}

function pageHeightSetup(trimMarks, renderer) {
    switch (renderer) {
      case "1":
        console.info("Renderer 1 Set");
        return "100vh";
      case "2":
        console.info("Renderer 2 Set");
        if(trimMarks){
              return "calc(100vh - 1px)";
        } 
        return "100vh";
      default:
        console.error("Renderer Not Set");
        return "100vh";
    }
  }

//--------------------------- crop and bleed -----------------------------------
var cropSVG =
  '<svg class="crop-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.6 21.6" xmlns:v="https://vecta.io/nano"><path d="M21 15V0m-6 21H0" fill="none" stroke="#000" stroke-width="0.25" stroke-miterlimit="10.0131"/></svg>';

const trimMarks = document.body.dataset.trim == "true" ? true : false;
const renderer = document.body.dataset.renderer;
const pages = document.querySelectorAll(".page");
pages.forEach((page) => {
  page.style.height = pageHeightSetup(trimMarks, renderer);
  if (trimMarks) {
    page.insertAdjacentHTML("afterbegin", `<div class="crop-marks">
      <div class="crop-mark top-left">${cropSVG}</div>
      <div class="crop-mark top-right">${cropSVG}</div>
      <div class="crop-mark bottom-left">${cropSVG}</div>
      <div class="crop-mark bottom-right">${cropSVG}</div>
    </div>`);
  }
});

// Fix for the resizable background images - fullscreen and digital vairaitons only
const checkCrop = () => {
  document
    .querySelectorAll("[data-trim='false'] .outfit-resizable-background")
    .forEach((el) => {
      el.parentNode.style.left = "0";
      el.parentNode.style.right = "0";
      el.parentNode.style.top = "0";
      el.parentNode.style.bottom = "0";
      el.parentNode.style.width = "100%";
      el.parentNode.style.height = "100%";
    });
}

Array.prototype.slice
  .call(document.querySelectorAll(".bleed"))
  .forEach(function (bleed) {
    bleed.style.cssText = trimMarks
      ? "position: absolute; top: 4.41mm; right: 4.41mm; bottom: 4.41mm; left: 4.41mm;"
      : "position: absolute; top: -3mm; right: -3mm; bottom: -3mm; left: -3mm";
  });

const setSize = () => {
    return new Promise((resolve) => {
      const vw = (trimMarks ? window.innerWidth : window.innerWidth + 57.62) / 100;
      const vh =
          (trimMarks ? window.innerHeight : window.innerHeight + 57.62) / 100;
      const vmin = Math.min(vw, vh);
      const vmax = Math.max(vw, vh);
  
      // Saving the preliminary font size calculation
      const preliminaryCalc = vmin * 2 + vmax * 1.4 + vh * 2;
  
      // Checking if the document is currently in export mode
      const isExportMode = window.location.href.indexOf("exports") > -1;
  
      // Checking if the active browser is Firefox
      const isFirefox = navigator.userAgent.includes("Firefox");
  
      // Grabbing the data-export-font-reduce-by-percent from the body element
      const exportReduceVal =
          document.body.dataset.reduceExportFontSizeByPercent === undefined
          ? 0
          : parseFloat(document.body.dataset.reduceExportFontSizeByPercent);
  
      // Grabbing the data-firefox-font-reduce-by-percent from the body element
      const firefoxReduceVal =
          document.body.dataset.reduceFirefoxFontSizeByPercent === undefined
          ? 0
          : parseFloat(document.body.dataset.reduceFirefoxFontSizeByPercent);
  
      const exportModeFontSize =
          preliminaryCalc - (exportReduceVal / 100) * preliminaryCalc;
      const firefoxFontSize =
          preliminaryCalc - (firefoxReduceVal / 100) * preliminaryCalc;
  
      // Reducing the preliminaryCalc value by reduceVal in export mode and in Firefox preview mode
      const finalCalc = isExportMode
          ? exportModeFontSize
          : isFirefox
          ? firefoxFontSize
          : preliminaryCalc;
  
      document.documentElement.style.fontSize = `${finalCalc}px`;
  
      resolve();
    });
  }

export { setSize, checkCrop, pageHeightSetup, setOutfitState };