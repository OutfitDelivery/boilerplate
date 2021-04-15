// import './less.js';
var less = require('less');
import './prefixfree.js';
import FontFaceObserver from './fontfaceobserver.js'
import { setSize, setOutfitState, addCrop, imageCompression } from './pageSetup.js'
import { dynamicReplace } from './replace.js';
import setupPlaceholder from './placeholder.js';
import textFit from './textFit.js';
import { charLimit, dynamicAssign, maxHeightCheck, maxLineCheck, innerWidth, innerHeight, countLines } from './limiters';

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
  // ensure that the user has changed important tempalte metadata
  const defaultsRemoved = () => {
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
  // ensure that all fonts are loaded check
  const fontsLoaded = (fontsListed) => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(fontsListed)) {
        fontsListed = [fontsListed]
    }
    if (
      !fontsListed ||
      (fontsListed && fontsListed.length < 1) ||
      fontsListed[0] === "PUT_ALL_FONT_NAMES_HERE"
    ) {
      reject("No fonts were listed in the run function");
    } else {
        Promise.all(fontsListed.map((font) => {
            return new FontFaceObserver(font).load();
          }))
          .then(resolve)
          .catch(reject);
    }
  });
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

const loadCSS = (variables) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await fetch('./css/styles.less');
      res = await res.text();
      let cssOutput = await less.render(res, { globalVars: variables })

      let styleCode = document.createElement('link');
      styleCode.setAttribute('type', 'text/css');
      styleCode.setAttribute('rel', 'stylesheet');
      styleCode.setAttribute('href', 'https://cdn.jsdelivr.net/gh/OutfitDelivery/boilerplate@2.5/css/main.min.css');
      document.head.insertAdjacentElement('beforeEnd', styleCode);

      document.head.insertAdjacentHTML('beforeEnd', `<style>${cssOutput.css}</style>`);

      resolve()
    } catch (e) { reject(e) }
  });
}

export default class boilerplate {
  constructor({ 
    fonts = [],
    ensureImagesLoad = true,
    allowLegacyRendering = false,
    reduceExportFontSizeByPercent = 0,
    reduceFirefoxFontSizeByPercent = 0,
    variables = {}
   } = {}) {
    this.fonts = fonts || '';
    this.ensureImagesLoad = ensureImagesLoad;
    this.allowLegacyRendering = allowLegacyRendering;
    this.reduceExportFontSizeByPercent = reduceExportFontSizeByPercent;
    this.reduceFirefoxFontSizeByPercent = reduceFirefoxFontSizeByPercent;
    this.variables = variables;
  }
  async start() {
    return new Promise((resolve, reject) => {
      // all these checks need to be done before the tempalte code can be run 
      let checkList = [domReady, defaultsRemoved(), fontsLoaded(this.fonts), setSize(), setOutfitState(), addCrop(this.allowLegacyRendering)];
      Promise.all(checkList)
        .then(() => {
          console.log("DOMContentLoaded + Fonts loaded");
  
          window.addEventListener("resize", () => {
            setSize();
            if (state !== "preview" && typeof onTextChange === "function") {
              onTextChange();
            }
          });
          if (state !== "preview" && typeof onTextChange === "function") {
              onTextChange();
          }
          if (state === "document") {
            imageCompression();
          }
          resolve();
        })
        .catch(reject);
    });
  }
  // send a event to stop a render 
  async completeRender() {
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
        throw '⚠️ Render failed for above reason ⤴️'
    });
  }

  async dynamicReplace () {
    dynamicReplace.apply(null, arguments);
  }
  async textFit () {
    textFit.apply(null, arguments);
  }
  async setupPlaceholder () {
    setupPlaceholder.apply(null, arguments);
  }
  async maxLineCheck () {
    maxLineCheck.apply(null, arguments);
  }
  async maxHeightCheck () {
    maxHeightCheck.apply(null, arguments);
  }
  async charLimit () {
    charLimit.apply(null, arguments);
  }
  async dynamicAssign () {
    dynamicAssign.apply(null, arguments);
  }
  async countLines () {
    countLines.apply(null, arguments);
  }
}
