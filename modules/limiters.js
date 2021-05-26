import LineClamp from "./lineClamp.js"

function hasHeightValue(el) {
  if (el.classList.contains('textFitted')) {
    return el;
  }
  if (['inline','inline-block'].includes(window.getComputedStyle(el).display) || isNaN(getHeight(el))) {
    return hasHeightValue(el.parentElement)
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
      let e = hasHeightValue(parentElement)
      console.log(e)
      if (!a.includes(e) && e) {
        a.push(e);
      }
    }
  }
  return a;
}

// some elemnets don't have height values set correctly so we need to drill down 
function findTextNode(target) {
  // if (child && ['SPAN','TOKEN-VALUE','STRONG','P','EM',''].includes(child.tagName)) {
  if (target.firstElementChild && !['BR'].includes(target.firstElementChild.tagName)) {
    target = findTextNode(target.firstElementChild);
  }
  return target
}
// not so simple rounding for line counting purposes
function simpleRounding(num) {
  if (num > 10) {
    return Math.round(num);
    // return num.toFixed(0).replace(/(\.0+|0+)$/, '');
  }
  return Math.round(num)//.replace(/(\.0+|0+)$/, '');
}
// count the number of lines inside of the current direct element
function countLines(elements) {
  var elType = Object.prototype.toString.call(elements);
  if (
    elType !== "[object Array]" &&
    elType !== "[object NodeList]" &&
    elType !== "[object HTMLCollection]"
  ) {
    elements = [elements];
  }
  let result = [...elements].map(target => {
    // if (1 == 2) {
    //   target.classList.add('countingLines');
    //   let testBox = document.createElement("div");
    //   let counterTarget = findTextNode(target)
    //   console.log(counterTarget)
    //   // let targetFix = target.firstChild ? target.firstChild.classList === "textFitted" ? target.firstChild : target : target; 
    //   testBox.classList = "lineCounter";
    //   // testBox.style.fontFamily = "-webkit-pictograph";
    //   // testBox.style.display = "block";
    //   // testBox.style.fontSize = targetFix.style.fontSize;
    //   testBox.innerText = "​";
    //   counterTarget.insertAdjacentElement('afterbegin', testBox) 
    //   let oneLineHeight = getHeight(testBox);
    //   testBox.remove();
    //   let lineCount = getHeight(target) / oneLineHeight;
    //   target.classList.remove('countingLines')
    //   let lineCountRounded = simpleRounding(lineCount)
    //   target.dataset.calculatedLinesCount = lineCountRounded; // adds property for CSS targeting
    //   target.dataset.rawLinesCount = lineCount; // adds property for CSS targeting
    //   return lineCountRounded;
    // } else {
      let muiltCount = 0;
      let textNodes = textNodesUnder(target);

      // let test = textNodes.forEach((s) => {
      //   console.log(s)
      // })
      console.log(textNodes, 'textNodes that have height')

      textNodes.forEach(el => {
        // let inlineElement = 
        // if (el.nodeName ==)
        // let displayType = window.getComputedStyle(el).display;
        // if (displayType == "inline" || displayType == "inline-block") {
        //   el = el.parentElement
        // }
        
        // if (hasHeightValue(el)) {
          let metrics = calculateTextMetrics(el);
          let line = simpleRounding(metrics.lineCount)
          console.log(el, metrics)
          if (line) {
            el.dataset.rawLinesCount = line;
            muiltCount += line;
          }
        // }

      })
      // console.log(target.innerText.substring(0, 10), muiltCount)
      let lineCountRounded = simpleRounding(muiltCount)
      target.dataset.calculatedLinesCount = lineCountRounded // adds property for CSS targeting
      return lineCountRounded
      // let metrics = calculateTextMetrics(target);
      // if (metrics.lineCount) {
      //   let lineCountRounded = simpleRounding(metrics.lineCount)
      //   target.dataset.calculatedLinesCount = lineCountRounded // adds property for CSS targeting
      //   target.dataset.rawLinesCount = metrics.lineCount; // adds property for CSS targeting
      //   return lineCountRounded
      // }
      // return null
    // }
  });
  if (result.length == 1) {
    return result[0];
  }
  return result;
}

let clampDefaults = { maxLines: 1, minFontSize: 18, useSoftClamp: true, ellipsis: '...' }
function lineClamp(elements, config)  {
  config = { ...clampDefaults, ...config }
  var elType = Object.prototype.toString.call(elements);
  if (
    elType !== "[object Array]" &&
    elType !== "[object NodeList]" &&
    elType !== "[object HTMLCollection]"
  ) {
    elements = [elements];
  }
  return [...elements].map(element => {
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
  let result = [...elements].map(element => {
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
  return width;
}

function maxLineCheck(element = null) {
  const isExportMode = window.location.href.indexOf("exports") > -1;
  const isLocalDev = window.location.href.indexOf("localhost") > -1;
  const preventExportOverflow =
    document.body.dataset.preventExportOverflow === "true";
  const isProjectKit = isLocalDev
    ? undefined
    : window.parent.document.querySelector(".preview-frame");

  if ((isExportMode && preventExportOverflow) || isProjectKit) return;

  const blocks = document.querySelectorAll("[data-max-line]");
  blocks.forEach((block) => {
    const lineCount = countLines(block);
    // Getting the data-max-line attribute value (max number of lines allowed) 
    const maxLine = block.dataset.maxLineAlt || block.dataset.maxLine;

    lineCount > maxLine
      ? block.classList.add("overflow")
      : block.classList.remove("overflow");
  });
  return true;
}

function minLineCheck(element = null) {
  const isExportMode = window.location.href.indexOf("exports") > -1;
  const isLocalDev = window.location.href.indexOf("localhost") > -1;
  const preventExportOverflow =
    document.body.dataset.preventExportOverflow === "true";
  const isProjectKit = isLocalDev
    ? undefined
    : window.parent.document.querySelector(".preview-frame");

  if ((isExportMode && preventExportOverflow) || isProjectKit) return;

  const blocks = document.querySelectorAll("[data-min-line]");
  blocks.forEach((block) => {
    const lineCount = countLines(block);
    // Getting the data-max-line attribute value (max number of lines allowed) 
    const minLine = block.dataset.minLineAlt || block.dataset.maxLine;

    lineCount <= minLine
      ? block.classList.add("overflow")
      : block.classList.remove("overflow");
  });
  return true;
}

/**
*Detailed instruction can be found here:
 https://github.com/aleks-frontend/max-height-check
*/
function maxHeightCheck(element = null) {
  const isExportMode = window.location.href.indexOf("exports") > -1;
  const isLocalDev = window.location.href.indexOf("localhost") > -1;
  const preventExportOverflow =
    document.body.dataset.preventExportOverflow === "true";
  const isProjectKit = isLocalDev
    ? undefined
    : window.parent.document.querySelector(".preview-frame");

  if ((isExportMode && preventExportOverflow) || isProjectKit) return;

  const blocks = document.querySelectorAll("[data-max-height]");
  blocks.forEach((block) => {
    if (block.dataset.maxHeight === "dynamic" || block.dataset.maxHeight === "parent" || block.dataset.maxHeightDynamic === "true") {
      dynamicAssign(block);
    }
    const blockHeight = getHeight(block);
    const maxHeight = block.dataset.maxHeight;

    // TODO improve this 
    if (block.dataset.maxHeight === "css") {
      const computedBlockStyle = window.getComputedStyle(block);
      const cssMaxHeight = parseFloat(computedBlockStyle.maxHeight);
      if (!cssMaxHeight) {
        console.error('There needs to be a max height set on the element if you want to use data-max-height="css"')
      }
      maxHeight = cssMaxHeight
    } else {
      // Setting the element's max-height
      block.style.maxHeight = maxHeight + block.dataset.maxHeightUnit || "px";

      // Recalculating maxHeight in case 'rem' is set as a unit
      if (block.dataset.maxHeightUnit === "rem") {
        maxHeight = maxHeight * parseFloat(window.getComputedStyle(document.body).fontSize);
      }
    }

    // Adding an 'overflow' class to an element if it's offset height exceedes the max-line-height
    blockHeight > maxHeight
      ? block.classList.add("overflow")
      : block.classList.remove("overflow");
  });
  return true;
}

function dynamicAssign(element = null) {
  const container = element.parentNode;
  container.style.overflow = "hidden";
  // const containerComputed = {
  //   height: parseFloat(window.getComputedStyle(container).height),
  //   top: parseFloat(window.getComputedStyle(container).paddingTop),
  //   bottom: parseFloat(window.getComputedStyle(container).paddingBottom),
  // };
  // const containerHeight = Math.floor(
  //   containerComputed.height - containerComputed.top - containerComputed.bottom
  // );
  const containerHeight = getHeight(container)
  // TODO work out what subtrahend is 
  const subtrahends = [...container.querySelectorAll(".js-subtrahend")];

  const subtrahendsHeight = subtrahends.reduce((totalHeight, subtrahend) => {
    const subtrahendMargins = {
      top: parseFloat(window.getComputedStyle(subtrahend).marginTop),
      bottom: parseFloat(window.getComputedStyle(subtrahend).marginBottom),
    };
    return (
      totalHeight +
      subtrahend.offsetHeight +
      subtrahendMargins.top +
      subtrahendMargins.bottom
    );
  }, 0);

  const dynamicHeight = containerHeight - subtrahendsHeight;

  element.dataset.maxHeightDynamic = "true";
  element.dataset.maxHeight = dynamicHeight;
  container.style.overflow = "visible";
  return dynamicHeight;
}

// Adding limit for the word length
function charLimit(element = null) {
  const blocks = document.querySelectorAll("[data-char-limit]");
  blocks.forEach((element) => {
    const limit = element.dataset.charLimit;

    if (element === null) {
      return;
    }
    var tokenValue = element.querySelectorAll(".token-value");

    if (tokenValue.length != 0) {
      element = tokenValue.item(0);
    }
    var code = element.innerText;
    element.dataset.calculatedCharCount = code.length;
    if (code.length > limit) {
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
  return true;
}

export { charLimit, dynamicAssign, maxHeightCheck, maxLineCheck, getWidth, getHeight, countLines, calculateTextMetrics, lineClamp, minLineCheck }