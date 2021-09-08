import LineClamp from "./lineClamp.js"
import detectElementOverflow from "./detectElementOverflow.js"
function hasHeightValue(el, target) {
  if (el.isSameNode(target)) {
    return el;
  }
  if (el.classList.contains('textFitted')) {
    return el;
  }
  if (['inline','inline-block'].includes(window.getComputedStyle(el).display) || isNaN(getHeight(el))) {
    return hasHeightValue(el.parentElement, target)
  } else {
    return el
  }
}
// find all text nodes under a given element
function textNodesUnder(el) {
  var n = null, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  while(n = walk.nextNode()) {
    if (n.textContent.trim()) {
      let { parentElement } = n
      // if (parentElement.isSameNode(el)) {
      //   return [el];
      // }
      let e = hasHeightValue(parentElement, el)
      // console.log(e)

      // if (e) exits and ins't already returned then add it to the list of elements to line check
      if (e && !a.includes(e))  {
        // if (e) has got a child in (a) then we need to remove that child to prevent double up of counting
        a = a.filter(i => {
          return !e.contains(i)
        })
        a.push(e);
      }
    }
  }
  return a;
}

// not so simple rounding for line counting purposes
function simpleRounding(num) {
  return Math.round(num)
}
// count the number of lines inside of the current direct element
function countLines(elements, advanced) {
  var elType = Object.prototype.toString.call(elements);
  if (
    elType !== "[object Array]" &&
    elType !== "[object NodeList]" &&
    elType !== "[object HTMLCollection]"
  ) {
    elements = [elements];
  }
  let result = [].slice.call(elements).map(target => {
      target.classList.add('countingLines');
      let multiCount = 0;
      let textNodes = textNodesUnder(target);
      // console.log(textNodes, 'textNodes that have height')
      textNodes.forEach(el => {
        let metrics = calculateTextMetrics(el);

        let line = simpleRounding(metrics.lineCount)
        // console.log(el, metrics)
        if (line) {
          el.dataset.rawLinesCount = line;
          multiCount += line;
        }
      })
      multiCount = simpleRounding(multiCount)
      target.dataset.calculatedLinesCount = multiCount // adds property for CSS targeting
      target.classList.remove('countingLines');
      return multiCount
  });
  if (result.length == 1) {
    return result[0];
  }
  return result;
}

let clampDefaults = { maxLines: 1, minFontSize: 18, useSoftClamp: true, ellipsis: '...' }
function lineClamp(elements, config)  {
  config = Object.assign(clampDefaults, config)
  // config = { ...clampDefaults, ...config }
  var elType = Object.prototype.toString.call(elements);
  if (
    elType !== "[object Array]" &&
    elType !== "[object NodeList]" &&
    elType !== "[object HTMLCollection]"
  ) {
    elements = [elements];
  }
  return [].slice.call(elements).map(element => {
    const clamp = new LineClamp(element, config)
    clamp.apply()
    clamp.watch()
   
    return clamp;
  });
}

// returns lineCount and line hieght info from this libaray https://github.com/tvanc/lineclamp
function calculateTextMetrics(elements, config) {
  var elType = Object.prototype.toString.call(elements);
  if (
    elType !== "[object Array]" &&
    elType !== "[object NodeList]" &&
    elType !== "[object HTMLCollection]"
  ) {
    elements = [elements];
  }
  let result = [].slice.call(elements).map(element => {
    return new LineClamp(element, config).calculateTextMetrics();
  });
  if (result.length == 1) {
    return result[0];
  }
  return result;
}

// Calculate height without padding.
function getHeight(el) {
  var style = window.getComputedStyle(el, null);
  var height = parseFloat(style.getPropertyValue("height"));
  var box_sizing = style.getPropertyValue("box-sizing");
  if (box_sizing === "border-box") {
    var padding_top = parseFloat(style.getPropertyValue("padding-top"));
    var padding_bottom = parseFloat(style.getPropertyValue("padding-bottom"));
    var border_top = parseFloat(style.getPropertyValue("border-top-width"));
    var border_bottom = parseFloat(
      style.getPropertyValue("border-bottom-width")
    );
    height = height - padding_top - padding_bottom - border_top - border_bottom;
  }
  el.dataset.calculatedHeight = height; // adds property for debuging
  if (simpleRounding(height) != el.scrollHeight) {
    el.dataset.calculatedScrollHeight = el.scrollHeight; // adds property for debuging
  }
  return height;
}

// Calculate width without padding.
function getWidth(el) {
  var style = window.getComputedStyle(el, null);
  var width = parseFloat(style.getPropertyValue("width"));
  var box_sizing = style.getPropertyValue("box-sizing");
  if (box_sizing === "border-box") {
    var padding_left = parseFloat(style.getPropertyValue("padding-left"));
    var padding_right = parseFloat(style.getPropertyValue("padding-right"));
    var border_left = parseFloat(style.getPropertyValue("border-left-width"));
    var border_right = parseFloat(style.getPropertyValue("border-right-width"));
    width = width - padding_left - padding_right - border_left - border_right;
  }
  el.dataset.calculatedWidth = width; // adds property for debuging
  if (simpleRounding(width) != el.scrollWidth) {
    el.dataset.calculatedScrollWidth = el.scrollWidth; // adds property for debuging
  }
  return width;
}

function maxLineCheck(elements = null, limit = null) {
  var elType = Object.prototype.toString.call(elements);
  if (
    elements && 
    elType !== "[object Array]" &&
    elType !== "[object NodeList]" &&
    elType !== "[object HTMLCollection]"
  ) {
    elements = [elements];
  }

  let overflowFound = false;
  if (state === 'projectPreview') return;
  const blocks = elements || document.querySelectorAll("[data-max-line]");
  blocks.forEach((block) => {
    if (limit && !block.dataset.customOverflowMessage) {
      block.dataset.customOverflowMessage = `There can't be more than ${limit} lines of content here`;
    }
    const lineCount = countLines(block);
    // Getting the data-max-line attribute value (max number of lines allowed) 
    const maxLine = limit || block.dataset.maxLine;

    let overflow = lineCount > maxLine

    if (overflow && !overflowFound) {
      overflowFound = true;
    }

    (overflow)
      ? block.classList.add("overflow")
      : block.classList.remove("overflow");
  });
  return overflowFound;
}

function minLineCheck(element = null, limit = null) {
  var elType = Object.prototype.toString.call(elements);
  if (
    elements &&
    elType !== "[object Array]" &&
    elType !== "[object NodeList]" &&
    elType !== "[object HTMLCollection]"
  ) {
    elements = [elements];
  }

  let overflowFound = false;
  if (state === 'projectPreview') return;
  const blocks = elements || document.querySelectorAll("[data-min-line]");
  blocks.forEach((block) => {
    if (limit && !block.dataset.customOverflowMessage) {
      block.dataset.customOverflowMessage = `There must be at least ${limit} lines of content here`;
    }

    const lineCount = countLines(block);
    // Getting the data-max-line attribute value (max number of lines allowed) 
    const minLine = limit || block.dataset.maxLine;

    let overflow = lineCount <= minLine

    if (overflow && !overflowFound) {
      overflowFound = true;
    }
    
    (overflow)
      ? block.classList.add("overflow")
      : block.classList.remove("overflow");
  });
  return overflowFound;
}

/**
* Detailed instruction can be found here:
  https://github.com/aleks-frontend/max-height-check
*/
function maxHeightCheck(elements = null, inputLimit = null) {
  var elType = Object.prototype.toString.call(elements);
  if (
    elements &&
    elType !== "[object Array]" &&
    elType !== "[object NodeList]" &&
    elType !== "[object HTMLCollection]"
  ) {
    elements = [elements];
  }

  let overflowFound = false;
  if (state === "projectPreview") return false;
  const blocks = elements || document.querySelectorAll("[data-max-height]");
  blocks.forEach((block) => {
    let { scrollHeight, dataset } = block;
    let { maxHeight } = dataset;
    let elementHeight;
    block.dataset.calculatedScrollHeight = scrollHeight; // adds property for debuging
    let limit = inputLimit;

    // get limit based on what type of check is going to be done
    if (!limit) {
      if (maxHeight === "parent") {
        limit = "parent";
      } else if (maxHeight === "self") {
        limit = "self";
      } else if (maxHeight === "css") {
        limit = "css";
      } else {
          if (isNaN(limit)) {
            limit = "self";
            // defaulting to self type if not number
          } else {
            limit = maxHeight;
          }
      }
    }

    if (limit) {
      switch (limit) {
        case "parent":
          var parent = block.parentNode;
          elementHeight = getHeight(parent);
          break;
        case "self":
          elementHeight = getHeight(block);
          break;
        case "css":
          const computedBlockStyle = window.getComputedStyle(block);
          elementHeight = parseFloat(computedBlockStyle.maxHeight);
          if (!elementHeight) {
            console.error(
              block,
              'There needs to be a max height set on the element if you want to use data-max-height="css"'
            );
          }
          break;
        default:
          elementHeight = getHeight(block);
          // this means that the limit is a number passed in and not based on the element scrollheight
          elementHeight = limit; 
          break;
      }
      block.dataset.limitType = limit;

      let overflow =
        simpleRounding(scrollHeight) > simpleRounding(elementHeight);
      if (overflow && !overflowFound) {
        overflowFound = true;
      }
      overflow
        ? block.classList.add("overflow")
        : block.classList.remove("overflow");
    }
  });
  return overflowFound;
}

// Adding limit for the word length
function charLimit(elements = null, limit = null) {
  var elType = Object.prototype.toString.call(elements);
  if (
    elements &&
    elType !== "[object Array]" &&
    elType !== "[object NodeList]" &&
    elType !== "[object HTMLCollection]"
  ) {
    elements = [elements];
  }
  
  let overflowFound = false;
  if (state === 'projectPreview') return;
  const blocks = elements || document.querySelectorAll("[data-char-limit]");
  blocks.forEach((element) => {
    if (limit && !element.dataset.customOverflowMessage) {
      element.dataset.customOverflowMessage = `There can't be more than ${limit} characters here`;
    }

    const lettersLimit = limit || element.dataset.charLimit;

    var tokenValue = element.querySelectorAll(".token-value");

    if (tokenValue.length != 0) {
      element = tokenValue.item(0);
    }
    var code = element.innerText;
    element.dataset.calculatedCharCount = code.length;

    let overflow = code.length > lettersLimit

    if (overflow && !overflowFound) {
      overflowFound = true;
    }
    if (overflow) {
      // Check Token Again
      if (tokenValue.length != 0) {
        element.parentNode.classList.add("overflow");
      } else {
        element.classList.add("overflow");
      }
    } else {
      // Check Token Again
      if (tokenValue.length != 0) {
        element.parentNode.classList.remove("overflow");
      } else {
        element.classList.remove("overflow");
      }
    }
  });
  return overflowFound;
}

export { charLimit, maxHeightCheck, maxLineCheck, getWidth, getHeight, countLines, calculateTextMetrics, lineClamp, minLineCheck, simpleRounding }