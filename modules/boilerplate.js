import camelcaseKeys from 'camelcase-keys';
import {
  defaultsRemoved,
  loadLESS,
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
import detectElementOverflow from './detectElementOverflow.js';

export default class boilerplate {
  constructor(config = {}) {
    console.clear();
    this.trimMarks = config.trimMarks || false;
    this.state = setOutfitState(this.trimMarks);
    if (config.hotReloadOnChange) {
      hotReloadOnChange();
    }
    this.events = {};
    this.overflows = false;
    this.browser = setBrowserType();
    this.camelCase = config.camelCase || false;
    this.exportReduceFont = config.exportReduceFont || 0;
    this.allowNoMetaData = config.allowNoMetaData || false;
    this.ensureImagesLoad = true;
    if (
      typeof config.ensureImagesLoad === 'boolean'
      && config.ensureImagesLoad === false
    ) {
      this.ensureImagesLoad = false;
    }
    if (config.trimMarks) {
      document.body.setAttribute('data-trim', config.trimMarks);
    }

    if (!(typeof config.addCrop === 'boolean' && config.addCrop === false)) {
      addCropMarks(this.trimMarks);
    }
    setSize(config.trimMarks || false, config.exportReduceFont || 0);

    if (config.placeholderVisibility) {
      setupPlaceholder(config.placeholderVisibility, config.placeholderImages);
    }
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
        this.templateProps = {};
      }
    } catch (e) {
      this.templateProps = {};
      console.log('templateProps is not a valid JSON object');
    }

    // all these checks need to be done before the tempalte code can be run
    const checkList = [loadLESS()];
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
      this.emit('run', this.templateProps);
      this.emit('inputs-change', this.templateProps);
      if (typeof window.inputsChange === 'function') {
        window.inputsChange(this.templateProps);
      }
      window.addEventListener('resize', () => {
        setSize(this.trimMarks, this.exportReduceFont);
        this.emit('inputs-change', this.templateProps);
        if (typeof window.inputsChange === 'function') {
          window.inputsChange(this.templateProps);
        }
      });
      window.addEventListener('message', (e) => {
        try {
          if (e && e.data) {
            let data = JSON.parse(e.data);
            // check if there is json data and that it's not a message event from "app.fullstory.com"
            if (data && !data.__fs) {
              if (this.camelCase) {
                data = camelcaseKeys(data);
              }
              this.templateProps = { ...this.templateProps, ...data };
              this.emit('inputs-change', this.templateProps);
              if (typeof window.inputsChange === 'function') {
                window.inputsChange(this.templateProps);
              }
            }
          }
        } catch (e) {
          console.error('input update error', e);
        }
      });

      if (state === 'document') {
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

  // removeListener(name, listenerToRemove) {
  //   if (!this.events[name]) {
  //     throw new Error(`Can't remove a listener. Event "${name}" doesn't exits.`);
  //   }

  //   const filterListeners = (listener) => listener !== listenerToRemove;

  //   this.events[name] = this.events[name].filter(filterListeners);
  // }

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
  addStyle(styles = '') {
    const css = document.createElement('style');
    css.classList = 'injectedStyle';
    if (css.styleSheet) {
      css.styleSheet.cssText = styles;
    } else {
      css.appendChild(document.createTextNode(styles));
    }
    document.getElementsByTagName('head')[0].appendChild(css);
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
        if (this.getOverflows()) {
          console.log(
            '%cThis will export with overflow errors',
            'background: #1F2A44; color: white;font-size:16px;',
          );
        }
        const loadTime = Date.now() - window.performance.timing.navigationStart;
        console.info(`Document has finished rendering in ${loadTime}ms`);
        document.dispatchEvent(new Event('printready'));

        if (
          this.state === 'document'
          || this.state === 'template'
          || this.state === 'local'
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
        throw 'Render failed for logged reason';
      });
  }

  getOverflows() {
    const overflows = document.querySelectorAll('.overflow, [data-overflow]');
    if (overflows.length > 0) {
      this.overflows = overflows;
      this.emit('overflow', overflows);
    } else {
      this.overflows = false;
    }
    return this.overflows;
  }

  dynamicReplace() {
    return dynamicReplace.apply(this, arguments);
  }

  textFit() {
    const t = textFit.apply(this, arguments);
    this.getOverflows();
    return t;
  }

  maxLineCheck() {
    const t = maxLineCheck.apply(this, arguments);
    this.getOverflows();
    return t;
  }

  minLineCheck() {
    const t = minLineCheck.apply(this, arguments);
    this.getOverflows();
    return t;
  }

  maxHeightCheck() {
    const t = maxHeightCheck.apply(this, arguments);
    this.getOverflows();
    return t;
  }

  charLimit() {
    const t = charLimit.apply(this, arguments);
    this.getOverflows();
    return t;
    ß;
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

  detectElementOverflow() {
    return detectElementOverflow.apply(this, arguments);
  }
}
