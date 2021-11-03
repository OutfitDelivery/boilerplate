/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-cycle
import LineClamp from './lineClamp';

function hasHeightValue(el, target) {
  if (el.isSameNode(target)) {
    return el;
  }
  if (el.classList.contains('textFitted')) {
    return el;
  }
  // eslint-disable-next-line no-use-before-define
  // eslint-disable-next-line no-restricted-globals
  if (['inline', 'inline-block'].includes(window.getComputedStyle(el).display) || isNaN(getHeight(el))) {
    return hasHeightValue(el.parentElement, target);
  }
  return el;
}
// find all text nodes under a given element
function textNodesUnder(el) {
  let n = null; let a = []; const
    walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
  // eslint-disable-next-line no-cond-assign
  while (n = walk.nextNode()) {
    if (n.textContent.trim()) {
      const { parentElement } = n;

      const e = hasHeightValue(parentElement, el);
      // console.log(e)

      // if (e) exits and ins't already returned then add it to the list of elements to line check
      if (e && !a.includes(e)) {
        // if (e) has got a child in (a) then we need to remove the child
        // this is done to prevent the child from being counted twice
        a = a.filter((i) => !e.contains(i));
        a.push(e);
      }
    }
  }
  return a;
}

function simpleRounding(num) {
  return Math.ceil(num);
}
function simpleLineRounding(num) {
  return Math.round(num);
}

// returns lineCount and line hieght info from this libaray https://github.com/tvanc/lineclamp
function calculateTextMetrics(elements, config) {
  const elType = Object.prototype.toString.call(elements);
  if (
    elType !== '[object Array]'
    && elType !== '[object NodeList]'
    && elType !== '[object HTMLCollection]'
  ) {
    elements = [elements];
  }
  const result = [].slice.call(elements)
    .map((element) => new LineClamp(element, config).calculateTextMetrics());
  if (result.length === 1) {
    return result[0];
  }
  return result;
}

// count the number of lines inside of the current direct element
function countLines(elements) {
  const elType = Object.prototype.toString.call(elements);
  if (
    elType !== '[object Array]'
    && elType !== '[object NodeList]'
    && elType !== '[object HTMLCollection]'
  ) {
    elements = [elements];
  }
  const result = [].slice.call(elements).map((target) => {
    target.classList.add('countingLines');
    let multiCount = 0;
    const textNodes = textNodesUnder(target);
    // console.log(textNodes, 'textNodes that have height')
    textNodes.forEach((el) => {
      const metrics = calculateTextMetrics(el);

      const line = simpleLineRounding(metrics.lineCount);
      // console.log(el, metrics)
      if (line) {
        el.dataset.rawLinesCount = line;
        multiCount += line;
      }
    });
    multiCount = simpleLineRounding(multiCount);
    target.dataset.calculatedLinesCount = multiCount; // adds property for CSS targeting
    target.classList.remove('countingLines');
    return multiCount;
  });
  // eslint-disable-next-line eqeqeq
  if (result.length == 1) {
    return result[0];
  }
  return result;
}

const clampDefaults = {
  maxLines: 1, minFontSize: 18, useSoftClamp: true, ellipsis: '...',
};
function lineClamp(elements, config) {
  // eslint-disable-next-line no-param-reassign
  config = Object.assign(clampDefaults, config);
  // config = { ...clampDefaults, ...config }
  const elType = Object.prototype.toString.call(elements);
  if (
    elType !== '[object Array]'
    && elType !== '[object NodeList]'
    && elType !== '[object HTMLCollection]'
  ) {
    // eslint-disable-next-line no-param-reassign
    elements = [elements];
  }
  return [].slice.call(elements).map((element) => {
    const clamp = new LineClamp(element, config);
    clamp.apply();
    clamp.watch();

    return clamp;
  });
}

// Calculate height without padding.
function getHeight(el) {
  const style = window.getComputedStyle(el, null);
  let height = parseFloat(style.getPropertyValue('height'));
  const boxSizing = style.getPropertyValue('box-sizing');
  if (boxSizing === 'border-box') {
    const paddingTop = parseFloat(style.getPropertyValue('padding-top'));
    const paddingBottom = parseFloat(style.getPropertyValue('padding-bottom'));
    const borderTop = parseFloat(style.getPropertyValue('border-top-width'));
    const borderBottom = parseFloat(
      style.getPropertyValue('border-bottom-width'),
    );
    height = height - paddingTop - paddingBottom - borderTop - borderBottom;
  }
  el.dataset.calculatedHeight = height; // adds property for debuging
  if (simpleRounding(height) !== el.scrollHeight) {
    el.dataset.calculatedScrollHeight = el.scrollHeight; // adds property for debuging
  }
  return height;
}

// Calculate width without padding.
function getWidth(el) {
  const style = window.getComputedStyle(el, null);
  let width = parseFloat(style.getPropertyValue('width'));
  const boxSizing = style.getPropertyValue('box-sizing');
  if (boxSizing === 'border-box') {
    const paddingLeft = parseFloat(style.getPropertyValue('padding-left'));
    const paddingRight = parseFloat(style.getPropertyValue('padding-right'));
    const borderLeft = parseFloat(style.getPropertyValue('border-left-width'));
    const borderRight = parseFloat(
      style.getPropertyValue('border-right-width'),
    );
    width = width - paddingLeft - paddingRight - borderLeft - borderRight;
  }
  el.dataset.calculatedWidth = width; // adds property for debuging
  if (simpleRounding(width) !== el.scrollWidth) {
    el.dataset.calculatedScrollWidth = el.scrollWidth; // adds property for debuging
  }
  return width;
}

function maxLineCheck(elements = null, limit = null) {
  const elType = Object.prototype.toString.call(elements);
  if (
    elements
    && elType !== '[object Array]'
    && elType !== '[object NodeList]'
    && elType !== '[object HTMLCollection]'
  ) {
    elements = [elements];
  }

  let overflowFound = false;
  if (window.state === 'projectPreview') return false;
  const blocks = elements || document.querySelectorAll('[data-max-line]');
  blocks.forEach((block) => {
    if (limit && !block.dataset.customOverflowMessage) {
      block.dataset.customOverflowMessage = `There can't be more than ${limit} lines of content here`;
    }
    const lineCount = countLines(block);
    // Getting the data-max-line attribute value (max number of lines allowed)
    const maxLine = limit || block.dataset.maxLine;

    const overflow = lineCount > maxLine;

    if (overflow && !overflowFound) {
      overflowFound = true;
    }

    // eslint-disable-next-line no-unused-expressions
    (overflow)
      ? block.classList.add('overflow')
      : block.classList.remove('overflow');
  });
  return overflowFound;
}

function minLineCheck(elements = null, limit = null) {
  const elType = Object.prototype.toString.call(elements);
  if (
    elements
    && elType !== '[object Array]'
    && elType !== '[object NodeList]'
    && elType !== '[object HTMLCollection]'
  ) {
    elements = [elements];
  }

  let overflowFound = false;
  if (window.state === 'projectPreview') return false;
  const blocks = elements || document.querySelectorAll('[data-min-line]');
  blocks.forEach((block) => {
    if (limit && !block.dataset.customOverflowMessage) {
      block.dataset.customOverflowMessage = `There must be at least ${limit} lines of content here`;
    }

    const lineCount = countLines(block);
    // Getting the data-max-line attribute value (max number of lines allowed)
    const minLine = limit || block.dataset.maxLine;

    const overflow = lineCount <= minLine;

    if (overflow && !overflowFound) {
      overflowFound = true;
    }

    // eslint-disable-next-line no-unused-expressions
    (overflow)
      ? block.classList.add('overflow')
      : block.classList.remove('overflow');
  });
  return overflowFound;
}

/**
* Detailed instruction can be found here:
  https://github.com/aleks-frontend/max-height-check
*/
function maxHeightCheck(elements = null, inputLimit = null) {
  const elType = Object.prototype.toString.call(elements);
  if (
    elements
    && elType !== '[object Array]'
    && elType !== '[object NodeList]'
    && elType !== '[object HTMLCollection]'
  ) {
    elements = [elements];
  }

  let overflowFound = false;
  if (window.state === 'projectPreview') return false;
  const blocks = elements || document.querySelectorAll('[data-max-height]');
  blocks.forEach((block) => {
    const { scrollHeight, dataset } = block;
    const { maxHeight } = dataset;
    let elementHeight;
    block.dataset.calculatedScrollHeight = scrollHeight; // adds property for debuging
    let limit = inputLimit;

    // get limit based on what type of check is going to be done
    if (!limit) {
      if (maxHeight === 'parent') {
        limit = 'parent';
      } else if (maxHeight === 'self') {
        limit = 'self';
      } else if (maxHeight === 'css') {
        limit = 'css';
      // eslint-disable-next-line no-restricted-globals
      } else if (isNaN(limit)) {
        limit = 'self';
        // defaulting to self type if not number
      } else {
        limit = maxHeight;
      }
    }

    if (limit) {
      switch (limit) {
        case 'parent':
          elementHeight = getHeight(block.parentNode);
          break;
        case 'self':
          elementHeight = getHeight(block);
          break;
        case 'css':
          // eslint-disable-next-line no-case-declarations
          const computedBlockStyle = window.getComputedStyle(block);
          elementHeight = parseFloat(computedBlockStyle.maxHeight);
          if (!elementHeight) {
            console.error(
              block,
              'There needs to be a max height set on the element if you want to use data-max-height="css"',
            );
          }
          break;
        default:
          elementHeight = getHeight(block);
          // this means that the limit is a number passed in
          // and not based on the element scrollheight
          elementHeight = limit;
          break;
      }
      // block.dataset.limitType = limit;

      const overflow = simpleRounding(scrollHeight) > simpleRounding(elementHeight);
      if (overflow && !overflowFound) {
        overflowFound = true;
      }
      // eslint-disable-next-line no-unused-expressions
      (overflow)
        ? block.classList.add('overflow')
        : block.classList.remove('overflow');
    }
  });
  return overflowFound;
}

// Adding limit for the word length
function charLimit(elements = null, limit = null) {
  const elType = Object.prototype.toString.call(elements);
  if (
    elements
    && elType !== '[object Array]'
    && elType !== '[object NodeList]'
    && elType !== '[object HTMLCollection]'
  ) {
    elements = [elements];
  }

  let overflowFound = false;
  if (window.state === 'projectPreview') return false;
  const blocks = elements || document.querySelectorAll('[data-char-limit]');
  blocks.forEach((element) => {
    if (limit && !element.dataset.customOverflowMessage) {
      element.dataset.customOverflowMessage = `There can't be more than ${limit} characters here`;
    }

    const lettersLimit = limit || element.dataset.charLimit;

    const tokenValue = element.querySelectorAll('.token-value');

    if (tokenValue.length !== 0) {
      element = tokenValue.item(0);
    }
    const code = element.innerText;
    element.dataset.calculatedCharCount = code.length;

    const overflow = code.length > lettersLimit;

    if (overflow && !overflowFound) {
      overflowFound = true;
    }
    if (overflow) {
      // Check Token Again
      if (tokenValue.length !== 0) {
        element.parentNode.classList.add('overflow');
      } else {
        element.classList.add('overflow');
      }
    } else {
      // Check Token Again
      // eslint-disable-next-line no-lonely-if
      if (tokenValue.length !== 0) {
        element.parentNode.classList.remove('overflow');
      } else {
        element.classList.remove('overflow');
      }
    }
  });
  return overflowFound;
}

export {
  charLimit,
  maxHeightCheck,
  maxLineCheck,
  getWidth,
  getHeight,
  countLines,
  calculateTextMetrics,
  lineClamp,
  minLineCheck,
  simpleRounding,
};
