import { imageCompression, ensureAllImagesLoaded } from "./pageSetup.js";
import { dynamicReplace } from "./replace.js";
import setupPlaceholder from "./placeholder.js";
import textFit from "./textFit.js";
import { setupMTO } from "./mto.js";
import { defaultsRemoved, emit, loadLESS, winLoad, domReady, highestZ, setBrowserType, setSize, fontsLoaded, addCrop, setOutfitState } from "./utilities.js";
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
  constructor({
    fonts = [],
    ensureImagesLoad = true,
    allowLegacyRendering = false,
    exportReduceFont = 0,
    waitForImages = false,
    trimMarks = false,
    allowNoMetaData = false,
    cssVariables = "",
    runAddCrop = true,
    templateProps = '{}',
  } = {}) {
    this.fonts = fonts || "";
    this.waitForImages = waitForImages;
    this.ensureImagesLoad = ensureImagesLoad;
    this.allowLegacyRendering = allowLegacyRendering;
    this.exportReduceFont = exportReduceFont;
    this.trimMarks = trimMarks;
    this.allowNoMetaData = allowNoMetaData;
    this.overflows = false;
    this.state = setOutfitState(trimMarks);
    this.browser = setBrowserType();
    this.addStyle(`:root{${cssVariables}}`);
    if (runAddCrop) {
      addCrop(trimMarks, allowLegacyRendering);
    }
    setSize(trimMarks, exportReduceFont);
    this._events = {};
    console.clear();
    try {
      this.templateProps = JSON.parse(templateProps);
    } catch (e) {
      this.templateProps = {};
      console.log(`templateProps is not a valid JSON object`);
    }
  }
  start() {
    return new Promise((resolve, reject) => {
      // all these checks need to be done before the tempalte code can be run
      let checkList = [
        domReady,
        loadLESS(),
        fontsLoaded(this.fonts),
      ];
      if (this.waitForImages) {
        checkList.push(ensureAllImagesLoaded());
      }
      Promise.all(checkList)
        .then(() => {
          this.emit("inputsChange", this.templateProps);
          if (typeof window.onTextChange === "function") {
            window.onTextChange();
          }
          window.addEventListener("resize", async (e) => {
            await setSize(
              this.trimMarks,
              this.exportReduceFont
            );
            if (state !== "preview") {
              this.emit("inputsChange");
              if (typeof window.onTextChange === "function") {
                window.onTextChange("resize", this.templateProps);
              }
            }
          });
          // setInterval(() => {
          //   this.getOverflows();
          // }, 1000)
          
          if (state === "document") {
            imageCompression();
          }
          resolve(this);
        })
        .catch(reject);
    });
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
  completeRender() {
    let checkList = [winLoad];
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

  hotReloadOnChange() {
    if ((this.state === "document" || state === "template") && typeof BroadcastChannel === "function") {
      let bc = new BroadcastChannel("fs-sync");
      bc.onmessage = (ev) => {
        if (!window.top.reloading) {
          window.top.reloading = true;
          window.top.location.reload();
        }
      };
    }
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
  setupPlaceholder() {
    return setupPlaceholder.apply(this, arguments);
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
