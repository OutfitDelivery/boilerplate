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
    firefoxReduceFont = 0,
    waitForImages = false,
    trimMarks = false,
    allowNoMetaData = false,
    cssVariables = "",
    runAddCrop = true,
  } = {}) {
    this.fonts = fonts || "";
    this.waitForImages = waitForImages;
    this.ensureImagesLoad = ensureImagesLoad;
    this.allowLegacyRendering = allowLegacyRendering;
    this.exportReduceFont = exportReduceFont;
    this.firefoxReduceFont = firefoxReduceFont;
    this.trimMarks = trimMarks;
    this.allowNoMetaData = allowNoMetaData;
    this.overflows = false;
    this.state = setOutfitState(trimMarks);
    this.browser = setBrowserType();
    this.addStyle(`:root{${cssVariables}}`);
    if (runAddCrop) {
      addCrop(trimMarks, allowLegacyRendering);
    }
    setSize(trimMarks, exportReduceFont, firefoxReduceFont);
    console.clear();
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
          emit(this, "textValidation");
          if (typeof window.onTextChange === "function") {
            window.onTextChange();
          }
          this.getOverflowsList();
          window.addEventListener("resize", async (e) => {
            await setSize(
              this.trimMarks,
              this.exportReduceFont,
              this.firefoxReduceFont
            );
            if (state !== "preview") {
              emit(this, "textValidation");
              if (typeof window.onTextChange === "function") {
                window.onTextChange("resize");
              }
            }
            this.getOverflowsList();
          });

          if (state === "document") {
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
            imageCompression();
            // set timeout is used here to push this to the end of the heap which means it will load after everything else
            setTimeout(() => {
              if (!this.allowNoMetaData) {
                defaultsRemoved();
              }
            }, 5000);
          }
          console.log("Content checks ran 😎");
          resolve();
        })
        .catch(reject);
    });
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
    // if (this.ensureNoOverflows) {
    //   checkList.push(ensureNoOverflows)
    // }
    Promise.all(checkList)
      .then(() => {
        let loadTime = Date.now() - window.performance.timing.navigationStart;
        console.info(`Document has finished rendering in ${loadTime}ms`);
        document.dispatchEvent(new Event("printready"));
      })
      .catch((err) => {
        console.error(err);
        throw "⚠️ Render failed for logged reason ⤴️";
      });
  }

  hotReloadOnChange() {
    if (this.state === "document" && typeof BroadcastChannel === "function") {
      let bc = new BroadcastChannel("fs-sync");
      bc.onmessage = (ev) => {
        if (!window.top.reloading) {
          window.top.reloading = true;
          window.top.location.reload();
        }
      };
    }
  }

  getOverflowsList() {
    let overflows = document.querySelectorAll(".overflow, [data-overflow]");
    if (overflows) {
      this.overflows = overflows;
    } else {
      this.overflows = false;
    }
    return this.overflows;
  }
  dynamicReplace() {
    return dynamicReplace.apply(this, arguments);
  }
  textFit() {
    return textFit.apply(this, arguments);
  }
  setupPlaceholder() {
    return setupPlaceholder.apply(this, arguments);
  }
  maxLineCheck() {
    return maxLineCheck.apply(this, arguments);
  }
  minLineCheck() {
    return minLineCheck.apply(this, arguments);
  }
  maxHeightCheck() {
    return maxHeightCheck.apply(this, arguments);
  }
  charLimit() {
    return charLimit.apply(this, arguments);
  }
  dynamicAssign() {
    return dynamicAssign.apply(this, arguments);
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
