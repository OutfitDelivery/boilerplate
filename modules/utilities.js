import FontFaceObserver from "./fontfaceobserver.js";

const defaultsRemoved = () => {
  // ensure that the user has changed important tempalte metadata
  return new Promise((resolve, reject) => {
    if (!document.querySelector('link[href$="main.css"]')) {
      console.log(
        "%c Please include main.css in order to ensure that export is correct", 'background: #E41E46; color: white'
      );
    }
    if (document.querySelector("style:not(data-href):not(.injectedStyle):not(#mceDefaultStyles)")) {
      console.log(
        "%c It is best practice not use styles in the html document. Please move all the styles to an extenal styles.css or styles.less file for constancy", 'background: #E41E46; color: white'
      );
    }
    let title = document.title;
    if (title === "" || title === "PUT_TEMPLATE_NAME_HERE") {
      reject(
        "Please put the name of the template in the title of the document"
      );
    }
    let builtBy = document
      .querySelector('meta[name="template-built-by"]')
      .getAttribute("content");
    if (builtBy === "" || builtBy === "PUT_YOUR_NAME_HERE") {
      reject("Please add your name in the document meta tags");
    }
    let scopeCard = document
      .querySelector('meta[name="scope"]')
      .getAttribute("content");
    if (scopeCard === "" || scopeCard === "DTB-PUT_JIRA_NUMBER_HERE") {
      reject("Please add the scope card ID in the document meta tags");
    }
    let builtCard = document
      .querySelector('meta[name="build"]')
      .getAttribute("content");
    if (builtCard === "" || builtCard === "DTB-PUT_JIRA_NUMBER_HERE") {
      reject("Please add the build card ID in the document meta tags");
    }

    if (
      [...document.head.childNodes].some((node) => {
        if (node && node.data && node.nodeType === 8) {
          return node.data.includes("Template Admin Build Instructions");
        }
      })
    ) {
      reject(
        'Please remove the "Template Admin Build Instructions" comment from the top of the document'
      );
    }
    resolve();
  });
};

const setOutfitState = (trimMarks) => {
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
  document.body.setAttribute("data-trim", trimMarks);
  window.state = mode;
  return mode;
};


// display a message to block rendering for major issues
const blockRender = (v) => {
  document.querySelector("body").innerHTML = `
    <style>.ujmju { position: absolute; background: #111820; color: white; font-family: sans-serif; font-size: 0.5rem; z-index: ${highestZ()}; height: 100%; width: 100%;}  .rsdie { margin: 1rem; width: 80%!important; } .rsdie p { font-size: 0.4rem; } </style>
    <div class="ujmju">
      <div class="rsdie">
        <h2>⚠️ Rendering error detected</h2>
        <h4>⚠Please enable <code>{ allowLegacyRendering: true }</code>
        in the boilerplate or update this template to version 1.1 or 2.1</h4>
        <p>This template is using renderer ${v}</p>
        <p>Please contact support if you see this message.</p>
      </div>
    </div>`;
};

// There is an error on render 2 where an extra pixel is added to the end of a template
// this casues a new page to be made. This fuction removes that extra pixel
const pageHeightSetup = (trimMarks, allowLegacyRendering) => {
  let agent = navigator.userAgent;
  if (agent.includes("OPTION 2.1")) {
    console.info("Renderer 2.1 Set");
    if (!trimMarks) {
      return "calc(100vh - 1px)";
    }
    return "100vh";
  } else if (agent.includes("OPTION 1.1")) {
    console.info("Renderer 1.1 Set");
    return "100vh";
  } else if (agent.includes("OPTION 1.0")) {
    if (!allowLegacyRendering) {
      blockRender("1.0");
    }
    return "100vh";
  } else if (agent.includes("OPTION 2.0")) {
    if (!allowLegacyRendering) {
      blockRender("2.0");
    }
    if (!trimMarks) {
      return "calc(100vh - 1px)";
    }
    return "100vh";
  } else {
    // console.error("Renderer Not Set");
    return "100vh";
  }
};

// Fix for the resizable background images - fullscreen and digital vairaitons only
const addCrop = (trimMarks, allowLegacyRendering) => {
  // crop and bleed
  var cropSVG = `<svg class="crop-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.6 21.6" xmlns:v="https://vecta.io/nano"><path d="M21 15V0m-6 21H0" fill="none" stroke="#000" stroke-width="0.25" stroke-miterlimit="10.0131"/></svg>`;

  let pageHeight = pageHeightSetup(trimMarks, allowLegacyRendering);
  document.querySelectorAll(".page").forEach((page) => {
    page.style.height = pageHeight;
    if (trimMarks) {
      page.insertAdjacentHTML(
        "afterbegin",
        `<div class="crop-marks">
  <div class="crop-mark top-left">${cropSVG}</div>
  <div class="crop-mark top-right">${cropSVG}</div>
  <div class="crop-mark bottom-left">${cropSVG}</div>
  <div class="crop-mark bottom-right">${cropSVG}</div>
  </div>`
      );
    }
  });

  Array.prototype.slice
    .call(document.querySelectorAll(".bleed"))
    .forEach((bleed) => {
      bleed.style.cssText = trimMarks
        ? "position: absolute; top: 4.41mm; right: 4.41mm; bottom: 4.41mm; left: 4.41mm;"
        : "position: absolute; top: -3mm; right: -3mm; bottom: -3mm; left: -3mm";
    });
  if (!trimMarks) {
    document.querySelectorAll(".outfit-resizable-background").forEach((el) => {
      el.parentNode.style.left = "0";
      el.parentNode.style.right = "0";
      el.parentNode.style.top = "0";
      el.parentNode.style.bottom = "0";
      el.parentNode.style.width = "100%";
      el.parentNode.style.height = "100%";
    });
  }
};

const fontsLoaded = (fontsListed) => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(fontsListed)) {
      fontsListed = [fontsListed];
    }
    if (
      !fontsListed ||
      (fontsListed && fontsListed.length < 1) ||
      fontsListed[0] === "PUT_ALL_FONT_NAMES_HERE"
    ) {
      reject(
        "No fonts were put in the boilerplate config. For example { fonts: ['IBM Plex Sans'] }"
      );
    } else {
      Promise.all(
        fontsListed.map((font) => {
          return new FontFaceObserver(font).load();
        })
      )
        .then((el) => {
          resolve(el);
        })
        .catch(reject);
    }
  });
};

const setSize = (trimMarks, exportReduceFont) => {
  const vw = (trimMarks ? window.innerWidth : window.innerWidth + 57.62) / 100;
  const vh =
    (trimMarks ? window.innerHeight : window.innerHeight + 57.62) / 100;
  const vmin = Math.min(vw, vh);
  const vmax = Math.max(vw, vh);

  // Saving the preliminary font size calculation
  const preliminaryCalc = vmin * 2 + vmax * 1.4 + vh * 2;

  // Reducing the preliminaryCalc value by reduceVal in export mode and in Firefox preview mode
  const finalCalc = (window.state === "exports")
    ? preliminaryCalc - (exportReduceFont / 100) * preliminaryCalc
    : preliminaryCalc;

  document.documentElement.style.fontSize = `${finalCalc}px`;
};

const setBrowserType = () => {
  let browser = {
    // Opera 8.0+
    isOpera:
      (!!window.opr && !!opr.addons) ||
      !!window.opera ||
      navigator.userAgent.indexOf(" OPR/") >= 0,
    // Firefox 1.0+
    isFirefox: typeof InstallTrigger !== "undefined",
    // Safari 3.0+ "[object HTMLElementConstructor]"
    isSafari:
      /constructor/i.test(window.HTMLElement) ||
      (function (p) {
        return p.toString() === "[object SafariRemoteNotification]";
      })(
        !window["safari"] ||
          (typeof safari !== "undefined" && window["safari"].pushNotification)
      ),
    // Internet Explorer 6-11
    isIE: /*@cc_on!@*/ false || !!document.documentMode,
    // Chrome 1 - 79
    isChrome:
      !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime),
    // mac detection
    isMac: window.navigator.appVersion.includes("Mac"),
  };
  //  Edge 20+
  browser["isEdge"] = !browser.isIE && !!window.StyleMedia;
  // Edge (based on chromium) detection
  browser["isEdgeChromium"] =
    browser.isChrome && navigator.userAgent.indexOf("Edg") != -1;
  // Blink engine detection
  browser["isBlink"] = (browser.isChrome || browser.isOpera) && !!window.CSS;

  Object.keys(browser)
  .filter((key) => {
    return browser[key];
  }).forEach(el =>  document.body.classList.add(el))

  window.browser = browser
  return browser;
};

const highestZ = () => {
  return (
    Array.from(document.querySelectorAll("body *"))
      .map((a) => parseFloat(window.getComputedStyle(a).zIndex))
      .filter((a) => !isNaN(a))
      .sort()
      .pop() + 1
  );
};

// wait for the dom to laod or continue if it has already loaded
const domReady = new Promise((resolve, reject) => {
  if (
    document.readyState === "complete" ||
    document.readyState === "loaded" ||
    document.readyState === "interactive"
  ) {
    resolve();
  } else {
    window.addEventListener("DOMContentLoaded", resolve);
    window.addEventListener("error", reject);
  }
});
// wait for the window to laod or continue if it has already loaded
const winLoad = new Promise((resolve, reject) => {
  if (document.readyState === "complete") {
    resolve();
  } else {
    window.addEventListener("load", resolve);
    window.addEventListener("error", reject);
  }
});

const loadLESS = (variables = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (document.querySelector('[type="text/less"]') !== null) {
        require("less");
        document
          .querySelectorAll('style[media=""][data-href$=".less"]:not([href])')
          .forEach((e) => e.remove());
      }

      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

function emit(instance, type, data = {}) {
  instance.element.dispatchEvent(new CustomEvent(type, {detail: data}));
}

export {
  defaultsRemoved,
  emit,
  loadLESS,
  winLoad,
  domReady,
  highestZ,
  setBrowserType,
  setSize,
  fontsLoaded,
  addCrop,
  setOutfitState,
};
