import { imageCompression, ensureAllImagesLoaded } from "./pageSetup.js";
import { defaultsRemoved, loadLESS, winLoad, domReady, highestZ, setBrowserType, setSize, fontsLoaded, addCropMarks, setOutfitState, hotReloadOnChange } from "./utilities.js";
import { dynamicReplace } from "./replace.js";
import setupPlaceholder from "./placeholder.js";
import textFit from "./textFit.js";
import { setupMTO } from "./mto.js";
import {
  charLimit,
  dynamicAssign,
  minLineCheck,
  maxHeightCheck,
  maxLineCheck,
  getHeight,
  getWidth,
  countLines,
  lineClamp,
  calculateTextMetrics,
} from "./limiters";


export default class boilerplate {
  constructor(config = {}) {
    this.state = setOutfitState(config.trimMarks || false);
    if (config.hotReloadOnChange) {
      hotReloadOnChange();
    }
    this._events = {};
    this.fonts = config.fonts || [];
    this.overflows = false;
    this.browser = setBrowserType();
    this.trimMarks = config.trimMarks || false;
    this.exportReduceFont = config.exportReduceFont || 0; 
    this.allowNoMetaData = config.allowNoMetaData || false;
    this.ensureImagesLoad = true;
    if (typeof config.ensureImagesLoad === 'boolean' && config.ensureImagesLoad === false) {
      this.ensureImagesLoad = false;
    }
    if (config.trimMarks) {
      document.body.setAttribute("data-trim", config.trimMarks);
    }
    if (config.cssVariables) {
      this.addStyle(`:root{${config.cssVariables}}`);
    }
    if (!(typeof config.addCrop === 'boolean' && config.addCrop === false)) {
      addCropMarks(config.trimMarks || false, config.allowLegacyRendering || false);
    }
    setSize(config.trimMarks || false,  config.exportReduceFont || 0);
   
    if (config.showPlaceholder) {
      setupPlaceholder(config.showPlaceholder, config.setupPlaceholder);
    }
    console.clear();
    try {
      if (config.templateProps) {
        this.templateProps = JSON.parse(JSON.stringify(config.templateProps));
      } else {
        this.templateProps = JSON.parse("{}");
      }
    } catch (e) {
      this.templateProps = JSON.parse("{}");
      console.log(`templateProps is not a valid JSON object`);
    }

    // all these checks need to be done before the tempalte code can be run
    let checkList = [
      domReady,
      loadLESS(),
      fontsLoaded(this.fonts),
    ];
    if (config.waitForImages) {
      checkList.push(ensureAllImagesLoaded());
    }
    Promise.all(checkList)
      .then(() => {
        this.emit("run", this.templateProps);
        this.emit("inputs-change", this.templateProps);
        if (typeof window.inputsChange === "function") {
          window.inputsChange(this.templateProps);
        }
        if (state !== "preview") {
          window.addEventListener("resize", (e) => {
            setSize(
              this.trimMarks,
              this.exportReduceFont
            );
            this.emit("inputs-change", this.templateProps);
            if (typeof window.inputsChange === "function") {
              window.inputsChange(this.templateProps);
            }
          });
        }
        
      // OutfitIframeShared.eventEmitter.addListener(
      //   'token-value:change',
      //   (e) => {
      //     console.log(e)
      //     // this.templateProps = JSON.parse(JSON.stringify(e.details));
      //     // this.emit("inputs-change", this.templateProps);
      //   }
      // );

      // setInterval(() => {
      //   this.getOverflows();
      // }, 1000)
              
      if (state === "document") {
        imageCompression();
      }
    })
  }
  start() {
    console.log('there is no need to call start. just create a template.on("inputs-change", (e) => {}) event')
  }
  // on creates a callback event
  on(name, listener) {
    if (!this._events[name]) {
      this._events[name] = [];
    }

    this._events[name].push(listener);
  }

  // removeListener(name, listenerToRemove) {
  //   if (!this._events[name]) {
  //     throw new Error(`Can't remove a listener. Event "${name}" doesn't exits.`);
  //   }

  //   const filterListeners = (listener) => listener !== listenerToRemove;

  //   this._events[name] = this._events[name].filter(filterListeners);
  // }
  
  // emit sends a message to a callback
  emit(name, data) {
    if (this._events[name]) {
      const fireCallbacks = (callback) => {
        callback(data);
      };

      this._events[name].forEach(fireCallbacks);
    }
  }


  // textValidation(callback)
  addStyle(styles = "") {
    var css = document.createElement("style");
    css.classList = "injectedStyle";
    if (css.styleSheet) {
      css.styleSheet.cssText = styles;
    } else {
      css.appendChild(document.createTextNode(styles));
    }
    document.getElementsByTagName("head")[0].appendChild(css);
  }
  // send a event to stop a render
  completeRender(checkList = []) {
    checkList.push(winLoad);
    if (this.ensureImagesLoad) {
      checkList.push(ensureAllImagesLoaded);
    }
    Promise.all(checkList)
      .then(() => {
        if (this.getOverflows()) {
          console.log(
           `%c This will export with overflow errors`, 'background: #1F2A44; color: white'
          );
        }
        let loadTime = Date.now() - window.performance.timing.navigationStart;
        console.info(`Document has finished rendering in ${loadTime}ms`);
        document.dispatchEvent(new Event("printready"));

        if (state === "document" || state === "template") {
          // set timeout is used here to push this to the end of the heap which means it will load after everything else
          setTimeout(() => {
            if (!this.allowNoMetaData) {
              defaultsRemoved();
            }
          }, 2000)
        };
      })
      .catch((err) => {
        console.error(err);
        throw "⚠️ Render failed for logged reason ⤴️";
      });
  }

 
  getOverflows () {
    let overflows = document.querySelectorAll(".overflow, [data-overflow]");
    if (overflows.length > 0) {
      this.overflows = overflows
      this.emit("overflow", overflows);
    } else {
      this.overflows = false;
    }
    return this.overflows;
  }
  dynamicReplace() {
    return dynamicReplace.apply(this, arguments);
  }
 
  textFit() {
    textFit.apply(this, arguments);
    this.getOverflows();
  }
  maxLineCheck() {
    maxLineCheck.apply(this, arguments);
    this.getOverflows();
  }
  minLineCheck() {
    minLineCheck.apply(this, arguments);
    this.getOverflows();
  }
  maxHeightCheck() {
    maxHeightCheck.apply(this, arguments);
    this.getOverflows();
  }
  charLimit() {
    charLimit.apply(this, arguments);
    this.getOverflows();
  }
  highestZindex() {
    return highestZ();
  }
  ensureAllImagesLoaded() {
    return ensureAllImagesLoaded.apply(this, arguments);
  }
  setupMTO() {
    return setupMTO.apply(this, arguments);
  }
  getWidth() {
    return getWidth.apply(this, arguments);
  }
  getHeight() {
    return getHeight.apply(this, arguments);
  }
  countLines() {
    return countLines.apply(this, arguments);
  }
  calculateTextMetrics() {
    return calculateTextMetrics.apply(this, arguments);
  }
  lineClamp() {
    return lineClamp.apply(this, arguments);
  }
}
