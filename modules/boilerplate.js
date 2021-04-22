import FontFaceObserver from './fontfaceobserver.js'
import { imageCompression } from './pageSetup.js'
import { dynamicReplace } from './replace.js';
import setupPlaceholder from './placeholder.js';
import textFit from './textFit.js';
import { charLimit, dynamicAssign, maxHeightCheck, maxLineCheck } from './limiters';

// functionly that used to be in all-images-loaded-callback.js converted into a promise function
const imageLoadedCheck = (imagesLoaded) => {
  return new Promise((imagesLoaded, imagesFailed) => { 
    Promise.all(Array.from(document.images).map(img => {
      if (img.complete)
          if (img.naturalHeight !== 0)
              return Promise.resolve();
          else
              return Promise.reject(img);
      return new Promise((resolve, reject) => {
          img.addEventListener("load", resolve);
          img.addEventListener("error", () => reject(img));
      });
    })).then(() => {
      imagesLoaded('All images loaded!');
    }, badImg => {
      imagesFailed(`${badImg.src} didn't load`)
    });
  });
}

// display a message to block rendering for major issues
const blockRender = (v) => {
  document.querySelector("body").innerHTML = `<style>html, body { background: #111820; color: white; font-family: sans-serif; font-size: 0.5rem; z-index: 100000;}  body { margin: 1rem; width: 80%!important;} p { font-size: 0.4rem; } </style>
  <h4>⚠️ Please enable <code>allowLegacyRendering: true</code>
   on the boilerplate or update renderer to version 2.1 or 1.1 </h4>
   <p>Please contact support if you see this message saying that this template is using renderer ${v}</p>`;
   document.dispatchEvent(new Event('printready'))
}

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
      let styleCode = document.createElement('link');
      styleCode.setAttribute('type', 'text/css');
      styleCode.setAttribute('rel', 'stylesheet');
      styleCode.setAttribute('href', 'https://cdn.jsdelivr.net/gh/OutfitDelivery/boilerplate@v3.0/css/main.min.css');
      document.head.insertAdjacentElement('afterbegin', styleCode);
  
      var less = {
        globalVars: variables
      };

      require('less');
      require('prefixfree');

      document.querySelectorAll('style[media=""][data-href$=".less"]:not([href])').forEach(e => e.remove());

      resolve()
    } catch (e) { reject(e) }
  });
}

export default class boilerplate {
  constructor({ 
    fonts = [],
    ensureImagesLoad = true,
    allowLegacyRendering = false,
    exportReduceFont = 0,
    firefoxReduceFont = 0,
    trimMarks = false,
    variables = {}
   } = {}) {
    
     this.fonts = fonts || '';
     this.ensureImagesLoad = ensureImagesLoad;
     this.allowLegacyRendering = allowLegacyRendering;
     this.exportReduceFont = exportReduceFont;
     this.firefoxReduceFont = firefoxReduceFont;
     this.trimMarks = trimMarks;
     this.variables = variables;
  
    if (!this.keepConsole) {
      console.clear();
    }
    if (JSON.stringify(variables) !== '{}') {
      console.table(variables)
    }
  }
  start() {
    return new Promise((resolve, reject) => {
      // all these checks need to be done before the tempalte code can be run 
      let checkList = [
        domReady,
        loadLESS(this.variables),
        this.setOutfitState(),
        this.fontsLoaded(),
        this.setBrowserType(),
        this.setSize(),
        this.addCrop()
      ];
      Promise.all(checkList)
        .then(() => {
          window.addEventListener("resize", async (e) => {
            await this.setSize();
            if (state !== "preview" && typeof onTextChange === "function") {
              window.onTextChange('resize');
            }
          });
          if (state == 'preview') {
            // OutfitIframeShared.eventEmitter.addListener(
            //   'token-value:change', (e) => {
            //   if (state !== "preview" && typeof window.onTextChange === "function") {
            //     if (e.currentTarget.parentNode) {
            //       window.onTextChange(e.currentTarget.parentNode);
            //     } else {
            //       window.onTextChange();
            //     }
            //   }
            // });
          }
          if (state === "document") {
            this.defaultsRemoved();
            imageCompression();
          }
          if (typeof window.onTextChange === "function") {
            window.onTextChange();
          }
          console.log("DOMContentLoaded + Fonts loaded");
          resolve();
        })
        .catch(reject);
    });
  }

  // ensure that all fonts are loaded check
  fontsLoaded() {
    return new Promise((resolve, reject) => {
      let fontsListed = this.fonts
      if (!Array.isArray(fontsListed)) {
          fontsListed = [fontsListed]
      }
      if (
        !fontsListed ||
        (fontsListed && fontsListed.length < 1) ||
        fontsListed[0] === "PUT_ALL_FONT_NAMES_HERE"
      ) {
        reject("No fonts were put in the boilerplate config. For example { fonts: ['IBM Plex Sans'] }");
      } else {
          Promise.all(fontsListed.map((font) => {
              return new FontFaceObserver(font).load();
            }))
            .then(resolve)
            .catch(reject);
      }
    });
  };

  setBrowserType () {
    return new Promise((resolve) => {
      let browser = {
        // Opera 8.0+
        isOpera: (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
        // Firefox 1.0+
        isFirefox: typeof InstallTrigger !== 'undefined',
        // Safari 3.0+ "[object HTMLElementConstructor]" 
        isSafari: /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification)),
        // Internet Explorer 6-11
        isIE: /*@cc_on!@*/false || !!document.documentMode,
        // Chrome 1 - 79
        isChrome:  !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime),
        // mac detection
        isMac: window.navigator.appVersion.includes("Mac")
      }
      //  Edge 20+
      browser['isEdge'] = !browser.isIE && !!window.StyleMedia;
      // Edge (based on chromium) detection
      browser['isEdgeChromium'] = browser.isChrome && (navigator.userAgent.indexOf("Edg") != -1);
      // Blink engine detection
      browser['isBlink'] = (browser.isChrome || browser.isOpera) && !!window.CSS;
  
      document.body.classList += ' ' + Object.keys(browser).filter((key) => {
        return browser[key]
      }).join(' ');
      this.browser = browser;
      resolve(browser)
    });
  }
  
  setOutfitState () {
    return new Promise((resolve) => {
      var mode = window.location.href.indexOf("exports") > -1 ? "export" : false;
      mode =
        !mode && window.location.href.indexOf("templates") > -1
          ? "template"
          : mode;
      mode =
        !mode && window.location.href.indexOf("projects") > -1
          ? "document"
          : mode;
      mode =
        !mode && window.location.href.indexOf("preview") > -1 ? "preview" : mode;
      mode =
        !mode && window.location.href.indexOf("localhost") > -1 ? "local" : mode;
      if (!mode) {
        mode = "error";
      }
      document.body.setAttribute("document-state", mode);
      document.body.setAttribute("data-trim", this.trimMarks);
      window.state = mode;
      this.state = mode;
      resolve(mode);
    });
  }
  
  setSize () {
    return new Promise((resolve) => {
      const vw =
        (this.trimMarks ? window.innerWidth : window.innerWidth + 57.62) / 100;
      const vh =
        (this.trimMarks ? window.innerHeight : window.innerHeight + 57.62) / 100;
      const vmin = Math.min(vw, vh);
      const vmax = Math.max(vw, vh);
  
      // Saving the preliminary font size calculation
      const preliminaryCalc = vmin * 2 + vmax * 1.4 + vh * 2;
  
      // Checking if the document is currently in export mode
      const isExportMode = window.state == "exports";
  
      // Checking if the active browser is Firefox
      const isFirefox = navigator.userAgent.includes("Firefox");
  
      const exportModeFontSize =
        preliminaryCalc - (this.exportReduceFont / 100) * preliminaryCalc;
      const firefoxFontSize =
        preliminaryCalc - (this.firefoxReduceFont / 100) * preliminaryCalc;
  
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

  pageHeightSetup() {
    let agent = navigator.userAgent;
    if (agent.includes('OPTION 2.1')) {
      console.info("Renderer 2.1 Set");
      if (!this.trimMarks) {
        return "calc(100vh - 1px)";
      }
      return "100vh";
    } else if (agent.includes('OPTION 1.1')) {
      console.info("Renderer 1.1 Set");
      return "100vh";
    } else if (agent.includes('OPTION 1.0')) {
      if (!this.allowLegacyRendering) {
        blockRender('1.0')
      }
      return "100vh";
    } else if (agent.includes('OPTION 2.0')) {
      if (!this.allowLegacyRendering) {
        blockRender('2.0')
      }
      if (!this.trimMarks) {
        return "calc(100vh - 1px)";
      }
      return "100vh";
    } else {
      // console.error("Renderer Not Set");
      return "100vh";
    }
  }
  
  // Fix for the resizable background images - fullscreen and digital vairaitons only
  addCrop() {
    return new Promise((resolve) => {
      // crop and bleed
      var cropSVG =
        '<svg class="crop-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.6 21.6" xmlns:v="https://vecta.io/nano"><path d="M21 15V0m-6 21H0" fill="none" stroke="#000" stroke-width="0.25" stroke-miterlimit="10.0131"/></svg>';

      let pageHeight = this.pageHeightSetup();

      document.querySelectorAll(".page").forEach((page) => {
        page.style.height = pageHeight;
        if (this.trimMarks) {
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
          bleed.style.cssText = this.trimMarks
            ? "position: absolute; top: 4.41mm; right: 4.41mm; bottom: 4.41mm; left: 4.41mm;"
            : "position: absolute; top: -3mm; right: -3mm; bottom: -3mm; left: -3mm";
        });

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
      resolve();
    });
  }

  // send a event to stop a render 
  completeRender() {
    let checkList = [winLoad]
    if (this.ensureImagesLoad) {
      checkList.push(imageLoadedCheck)
    }
    Promise.all(checkList).then((values) => {
      let loadTime = Date.now() - window.performance.timing.navigationStart
      console.info(`Document has finished rendering in ${loadTime}ms`);
      document.dispatchEvent(new Event('printready'))
    }).catch(err => {
        console.error(err);
        throw '⚠️ Render failed for logged reason ⤴️'
    });
  }
  defaultsRemoved () {
    // ensure that the user has changed important tempalte metadata
    return new Promise((resolve, reject) => {
      let title = document.title;
      if (title == '' || title == 'PUT_TEMPLATE_NAME_HERE') {
        reject('Please put the name of the template in the title of the document')
      }
      let builtBy = document.querySelector('meta[name="template-built-by"]').getAttribute('content');
      if (builtBy == '' || builtBy == 'PUT_YOUR_NAME_HERE') {
        reject('Please add your name in the document meta tags')
      } 
      let scopeCard = document.querySelector('meta[name="scope"]').getAttribute('content');
      if (scopeCard == '' || scopeCard == 'DTB-PUT_JIRA_NUMBER_HERE') {
        reject('Please add the scope card ID in the document meta tags')
      }
      let builtCard = document.querySelector('meta[name="build"]').getAttribute('content');
      if (builtCard == '' || builtCard == 'DTB-PUT_JIRA_NUMBER_HERE') {
        reject('Please add the build card ID in the document meta tags')
      } 
      if ([...document.head.childNodes].some(node => {
        if (node && node.data && node.nodeType  == 8) {
          return node.data.includes('Template Admin Build Instructions')
        }
      })) {
        reject('Please remove the "Template Admin Build Instructions" comment from the top of the document')
      }
      resolve();
    });
  }
  hotReloadOnChange () {
    if (this.state == 'document' && typeof BroadcastChannel === 'function') {
      let bc = new BroadcastChannel('fs-sync');
      bc.onmessage = (ev) => {
        if (!window.top.reloading) {
          window.top.reloading = true;
          window.top.location.reload()
        }
      }
    }
  }
  dynamicReplace () {
    dynamicReplace.apply(null, arguments);
  }
  textFit () {
    textFit.apply(null, arguments);
  }
  setupPlaceholder () {
    setupPlaceholder.apply(null, arguments);
  }
  maxLineCheck () {
    maxLineCheck.apply(null, arguments);
  }
  maxHeightCheck () {
    maxHeightCheck.apply(null, arguments);
  }
  charLimit () {
    charLimit.apply(null, arguments);
  }
  dynamicAssign () {
    dynamicAssign.apply(null, arguments);
  }
}
