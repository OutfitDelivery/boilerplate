import camelcaseKeys from 'camelcase-keys';
import {
  defaultsRemoved,
  winLoad,
  domReady,
  highestZ,
  setBrowserType,
  setSize,
  fontsLoaded,
  addCropMarks,
  setOutfitState,
  hotReloadOnChange,
} from './utilities';
import { dynamicReplace } from './replace';
import setupPlaceholder from './placeholder';
import textFit from './textFit';
import { setupMTO } from './mto';
import {
  charLimit,
  minLineCheck,
  maxHeightCheck,
  maxLineCheck,
  getHeight,
  getWidth,
  countLines,
  lineClamp,
  calculateTextMetrics,
} from './limiters';
import { imageCompression, ensureAllImagesLoaded } from './images';
import detectElementOverflow from './detectElementOverflow';

export default class boilerplate {
  #trim = 0;
  #bleed = 0;
  constructor(config = {}) {
    console.clear();
    this.state = setOutfitState();
    this.exportReduceFont = config.exportReduceFont || 0;
    this.trim = config.trimMarks;

    this.bleed = config.bleed || 3;
    if (config.hotReloadOnChange) {
      hotReloadOnChange();
    }
    this.events = {};
    this.browser = setBrowserType();
    this.camelCase = config.camelCase || false;
    this.allowNoMetaData = config.allowNoMetaData || false;
    this.ensureImagesLoad = true;
    if (
      typeof config.ensureImagesLoad === "boolean" &&
      config.ensureImagesLoad === false
    ) {
      this.ensureImagesLoad = false;
    }

    if (config.placeholderVisibility) {
      setupPlaceholder(config.placeholderImages, config.placeholderVisibility);
    }
    addCropMarks();
    if (config.cssVariables) {
      this.addStyle(`:root{${config.cssVariables}}`);
    }

    try {
      if (config.templateProps) {
        this.templateProps = JSON.parse(JSON.stringify(config.templateProps));
        if (this.camelCase) {
          this.templateProps = camelcaseKeys(this.templateProps, {
            deep: true,
          });
        }
      } else {
        this.templateProps = window.payload || {};
      }
    } catch (e) {
      this.templateProps = {};
      console.log("templateProps is not a valid JSON object");
    }

    // all these checks need to be done before the tempalte code can be run
    const checkList = [];
    if (config.fonts) {
      this.fonts = config.fonts;
      if (!Array.isArray(this.fonts)) {
        this.fonts = [this.fonts];
      }
      checkList.push(fontsLoaded(this.fonts));
    }
    if (config.domReadyLoad) {
      checkList.push(domReady);
    } else {
      checkList.push(winLoad);
    }

    Promise.all(checkList).then(() => {
      this.emit("run", this.templateProps);
      this.emit("inputs-change", this.templateProps);
      if (typeof window.inputsChange === "function") {
        window.inputsChange(this.templateProps);
      }
      window.addEventListener("resize", () => {
        setSize(this.trimMarks, this.exportReduceFont);
        this.emit("inputs-change", this.templateProps);
        if (typeof window.inputsChange === "function") {
          window.inputsChange(this.templateProps);
        }
      });
      window.addEventListener("message", (e) => {
        try {
          if (e && e.data) {
            let { data } = e;
            if (data && data._OUTFIT_POST_MESSAGE) {
              delete data._OUTFIT_POST_MESSAGE;
              if (this.camelCase) {
                data = camelcaseKeys(data);
              }
              this.templateProps = { ...this.templateProps, ...data };
              this.emit("inputs-change", this.templateProps);
              if (typeof window.inputsChange === "function") {
                window.inputsChange(this.templateProps);
              }
            }
          }
        } catch (e) {
          console.error("input update error", e);
        }
      });

      if (this.state === "document") {
        imageCompression();
      }
    });
  }

  // on creates a callback event
  on(name, listener) {
    if (!this.events[name]) {
      this.events[name] = [];
    }

    this.events[name].push(listener);
  }

  // emit sends a message to a callback
  emit(name, data) {
    if (this.events[name]) {
      const fireCallbacks = (callback) => {
        callback(data);
      };

      this.events[name].forEach(fireCallbacks);
    }
  }

  // textValidation(callback)
  addStyle(styles = "") {
    const css = document.createElement("style");
    css.classList = "injectedStyle";
    if (css.styleSheet) {
      css.styleSheet.cssText = styles;
    } else {
      css.appendChild(document.createTextNode(styles));
    }
    document.getElementsByTagName("head")[0].appendChild(css);
    return css;
  }

  // send a event to stop a render
  completeRender(checkList = []) {
    checkList.push(winLoad);
    if (this.ensureImagesLoad) {
      checkList.push(ensureAllImagesLoaded);
    }
    Promise.all(checkList)
      .then(() => {
        if (this.overflows) {
          console.log(
            "%cThis will export with overflow errors",
            "background: #1F2A44; color: white;font-size:16px;"
          );
        }
        const loadTime = Date.now() - window.performance.timing.navigationStart;
        console.info(`Document has finished rendering in ${loadTime}ms`);
        document.dispatchEvent(new Event("printready"));

        if (
          this.state === "document" ||
          this.state === "template" ||
          this.state === "local"
        ) {
          // set timeout is used here to push this to the end of the heap which means it will load after everything else
          setTimeout(() => {
            if (!this.allowNoMetaData) {
              defaultsRemoved();
            }
          }, 5000);
        }
      })
      .catch((err) => {
        console.error(err);
        throw "Render failed for logged reason";
      });
  }

  showOverflows() {
    if (this.overflows) {
      this.overflows[0].scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }

  get bleed() {
    return this.#bleed;
  }

  set bleed(value) {
    if (value !== this.#bleed) {
      this.#bleed = value;
      document.body.style.setProperty("--bleed", this.#bleed);
    }
  }

  get trim() {
    return this.#trim;
  }

  set trim(value) {
    if (value !== this.#trim) {
      if (!value) {
        this.#trim = 0;
      } else {
        if (typeof value == "boolean") {
          this.#trim = 7.41;
        } else {
          this.#trim = value;
        }
      }
      document.body.style.setProperty("--trim", this.#trim);
      document.body.setAttribute("data-trim", Boolean(this.#trim));
      setSize(Boolean(this.#trim) || false, this.exportReduceFont || 0);
    }
  }

  get overflows() {
    const o = document.querySelectorAll(".overflow, [data-overflow]");

    if (o.length > 0) {
      this.emit("overflow", o);
      return o;
    }
  }

  dynamicReplace() {
    return dynamicReplace.apply(this, arguments);
  }

  textFit() {
    const t = textFit.apply(this, arguments);
    this.overflows;
    return t;
  }

  maxLineCheck() {
    const t = maxLineCheck.apply(this, arguments);
    this.overflows;
    return t;
  }

  minLineCheck() {
    const t = minLineCheck.apply(this, arguments);
    this.overflows;
    return t;
  }

  maxHeightCheck() {
    const t = maxHeightCheck.apply(this, arguments);
    this.overflows;
    return t;
  }

  charLimit() {
    const t = charLimit.apply(this, arguments);
    this.overflows;
    return t;
  }

  highestZindex() {
    return highestZ();
  }

  setupPlaceholder() {
    return setupPlaceholder.apply(this, arguments);
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

  detectElementOverflow() {
    return detectElementOverflow.apply(this, arguments);
  }
}
