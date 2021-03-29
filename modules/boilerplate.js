import './prefixfree.js';
import FontFaceObserver from './fontfaceobserver.js'
import { setSize, setOutfitState, addCrop } from './pageSetup.js'



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

class boilerplate {
  constructor({ fonts, ensureImagesLoad = true }) {
    this.fonts = fonts;
    this.ensureImagesLoad = ensureImagesLoad;
  }
  async start() {
    return new Promise((resolve, reject) => {
      // all these checks need to be done before the tempalte code can be run 
      let checkList = [domReady, fontsLoaded(this.fonts), setSize(), setOutfitState(), addCrop()];
  
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
      let loadTime = window.performance.timing.domContentLoadedEventEnd- window.performance.timing.navigationStart;
      console.info(`Document has finished rendering in ${loadTime}ms`);
      document.dispatchEvent(new Event('printready'))
    }).catch(err => {
        console.error(err);
        throw '⚠️ Render failed for above reason ⤴️'
    });
  }

  async dynamicReplace () {
    const module = await import('./replace.js');
    module.dynamicReplace.apply(null, arguments);
  }
  async textFit () {
    const module = await import('./textFit.js');
    module.default.apply(null, arguments);
  }
  async setupPlaceholder () {
    const module = await import('./placeholder.js');
    module.default.apply(null, arguments);
  }
  async maxLineCheck () {
    const module = await import('./limiters.js');
    module.maxLineCheck.apply(null, arguments);
  }
  async maxHeightCheck () {
    const module = await import('./limiters.js');
    module.maxHeightCheck.apply(null, arguments);
  }
  async charLimit () {
    const module = await import('./limiters.js');
    module.charLimit.apply(null, arguments);
  }
  async dynamicAssign () {
    const module = await import('./limiters.js');
    module.dynamicAssign.apply(null, arguments);
  }
  async countLines () {
    const module = await import('./limiters.js');
    module.countLines.apply(null, arguments);
  }
}


export default boilerplate;
