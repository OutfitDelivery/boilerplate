import FontFaceObserver from "./fontfaceobserver.js";

const defaultsRemoved = () => {
  // ensure that the user has changed important tempalte metadata
  return new Promise((resolve, reject) => {
    if (!window.top.defaultsRemovedChecked) {
      window.top.defaultsRemovedChecked = true;

      if (!document.querySelector('link[href$="main.css"]')) {
        console.log(
          "%cPlease include main.css in order to ensure that export is correct",
          "background: #E41E46; color: white"
        );
      }

      let styles = Array.from(
        document.querySelectorAll(
          "style:not([data-href]):not(.injectedStyle):not(#mceDefaultStyles):not(#mceStyles):not([id^=less])"
        )
      );
      // styles = styles.filter((e) => !e.innerHTML.startsWith("\n    .mce-ico ")); // allowed injected style until the ID is added to target this
      if (styles.length > 0) {
        console.log(
          "%cIt is best practice not use styles in the html document. Please move all the styles to an external styles.css or styles.less file for constancy",
          "background: #E41E46; color: white"
        );
      }

      let scripts = Array.from(
        document.querySelectorAll("script:not(#inputInjection):not([src])")
      );
      scripts = scripts.filter(
        (e) => !e.innerHTML.startsWith("var OutfitIframeShared")
      ); // allowed injected script
      if (scripts.length > 0) {
        console.log(
          "%cIt looks like there is javascript that has been placed in the html document. Please move all javascript to a external js files for constancy",
          "background: #E41E46; color: white"
        );
      }

      let title = document.title;
      if (title === "" || title === "PUT_TEMPLATE_NAME_HERE") {
        console.log(
          "%cPlease put the name of the template in the title of the document",
          "background: #94B7BB; color: #111820"
        );
      }

      let builtBy = document.querySelector('meta[name="template-built-by"]');
      if (
        builtBy &&
        (builtBy.getAttribute("content") === "" ||
          builtBy.getAttribute("content") === "PUT_YOUR_NAME_HERE")
      ) {
        console.log(
          "%cPlease add your name in the document meta tags",
          "background: #94B7BB; color: #111820"
        );
      }

      let scopeCard = document.querySelector('meta[name="scope"]');
      if (
        scopeCard &&
        (scopeCard.getAttribute("content") === "" ||
          scopeCard.getAttribute("content") === "DTB-PUT_JIRA_NUMBER_HERE")
      ) {
        console.log(
          "%cPlease add the scope card ID in the document meta tags",
          "background: #94B7BB; color: #111820"
        );
      }

      let builtCard = document.querySelector('meta[name="build"]');
      if (
        builtCard &&
        (builtCard.getAttribute("content") === "" ||
          builtCard.getAttribute("content") === "DTB-PUT_JIRA_NUMBER_HERE")
      ) {
        console.log(
          "%cPlease add the build card ID in the document meta tags",
          "background: #94B7BB; color: #111820"
        );
      }

      // check if comment has been removed from body
      if (
        [...document.head.childNodes].some((node) => {
          if (node && node.data && node.nodeType === 8) {
            return node.data.includes("Template Admin Build Instructions");
          }
        })
      ) {
        console.log(
          "%cPlease remove the 'Template Admin Build Instructions' comment from the top of the document",
          "background: #94B7BB; color: #111820"
        );
      }
    }
    resolve();
  });
};

const setOutfitState = () => {
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
  return mode;
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

// display a message to block rendering for major issues
// const blockRender = () => {
//   document.querySelector("body").outerHTML = `
//     <style>body{ background: #D1D3D4!important; color: #111820!important; } #ujmjuBlock { position: absolute; background: #D1D3D4!important; color: #111820!important; font-family: sans-serif; font-size: 1rem; z-index: ${highestZ()}; height: 100%; width: 100%;} #sdsgfdgsBlock { margin: 1rem; width: 80%!important; background: #D1D3D4!important; color: #111820!important; } #sdsgfdgsBlock p { font-size: 0.4rem; background: #D1D3D4!important; color: #111820!important; } </style>
//     <div id="ujmjuBlock">
//       <div id="sdsgfdgsBlock">
//         <h2>⚠️ Rendering error detected</h2>
//         <h4>Please update to use a supported renderer or provide a reason for needing to use a legacy renderer and add the following change to the boilerplate config to allow rendering: <br><code>{ allowLegacyRendering: true }</code><br>
//         <br>
//         <p>This template is rendered with ${detectRender()}</p>
//         <p>Please contact support if you see this message.</p>
//       </div>
//     </div>`;
// };

const detectRender = () => {
  let agent = navigator.userAgent;
  if (agent.includes("OPTION 2.1")) {
    return "2.1";
  } else if (agent.includes("OPTION 1.1")) {
    return "1.1";
  } else if (agent.includes("OPTION 1.0")) {
    return "1.0";
  } else if (agent.includes("OPTION 2.0")) {
    return "2.0";
  } else {
    return "unknown";
  }
};
// There is an error on render 2 where an extra pixel is added to the end of a template
// this casues a new page to be made. This fuction removes that extra pixel
const pageHeightSetup = () => {
  let render = detectRender();
  if (render === "2.1") {
      return "calc(100vh - 1px)";
  } else if (render === "1.1") {
    return "100vh";
  } else if (render === "1.0") {
    return "100vh";
  } else if (render === "2.0") {
    return "calc(100vh - 1px)";
  } else {
    return "100vh";
  }
};

// Fix for the resizable background images - fullscreen and digital vairaitons only
const addCropMarks = (trimMarks) => {
  // crop and bleed
  var cropSVG = `<svg class="crop-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.6 21.6" xmlns:v="https://vecta.io/nano"><path d="M21 15V0m-6 21H0" fill="none" stroke="#000" stroke-width="0.25" stroke-miterlimit="10.0131"/></svg>`;

  let pageHeight = pageHeightSetup();
  let pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
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
  return pageHeight;
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
  const finalCalc =
    window.state === "exports"
      ? preliminaryCalc - (exportReduceFont / 100) * preliminaryCalc
      : preliminaryCalc;

  document.documentElement.style.fontSize = `${finalCalc}px`;
  return finalCalc;
};

const setBrowserType = () => {
   const browser = {
     isAndroid: /Android/.test(navigator.userAgent),
     isOpera: /OPR/.test(navigator.userAgent),
     isFirefox: /Firefox/.test(navigator.userAgent),
     isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
     isEdge: /Edge/.test(navigator.userAgent),
     isIE: /Trident/.test(navigator.userAgent),
     isChrome: /Google Inc/.test(navigator.vendor),
     isChromiumBased: !!window.chrome && !/Edge/.test(navigator.userAgent),
     isTouchScreen: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
     isIOS: /(iPhone|iPad|iPod)/.test(navigator.platform),
     isWebComponentsSupported: 'registerElement' in document && 'import' in document.createElement('link') && 'content' in document.createElement('template'),
     isMac: window.navigator.appVersion.includes("Mac"),
   };
 
  Object.keys(browser)
    .filter((key) => {
      return browser[key];
    })
    .forEach((el) => document.body.classList.add(el));

  window.browser = browser;
  return browser;
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

const loadLESS = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (document.querySelector('[type="text/less"]') !== null) {
        window.less = {
          async: true,
          env: 'development'
        } 
        let less = await require('./less.js')
        await less.refresh();
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

const hotReloadOnChange = () => {
  if (
    (state === "document" || state === "template") &&
    typeof BroadcastChannel === "function"
  ) {
    let bc = new BroadcastChannel("hot-reload");
    bc.onmessage = (ev) => {
      if (!window.top.reloading) {
        window.top.reloading = true;
        window.top.location.reload();
      }
    };
    let bc2 = new BroadcastChannel("fs-sync");
    bc2.onmessage = (ev) => {
      if (!window.top.reloading) {
        window.top.reloading = true;
        window.top.location.reload();
      }
    };
  }
};


export {
  defaultsRemoved,
  hotReloadOnChange,
  loadLESS,
  winLoad,
  domReady,
  highestZ,
  setBrowserType,
  setSize,
  fontsLoaded,
  addCropMarks,
  setOutfitState
};
