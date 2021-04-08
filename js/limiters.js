// count the number of lines inside of the current direct element
function countLines(target) {
  let testBox = document.createElement("span");
  testBox.style.fontSize = target.style.fontSize;
  testBox.style.display = "inline-block";
  testBox.innerText = "⠀";
  target.appendChild(testBox);
  let oneLineHeight = innerHeight(testBox);
  testBox.remove();
  let lines = innerHeight(target) / oneLineHeight;
  target.dataset.lineCount = lines; // adds property for CSS targeting
  return lines;
}

// Calculate height without padding.
function innerHeight(el) {
  var style = window.getComputedStyle(el, null);
  var height = parseFloat(style.getPropertyValue("height"));
  var box_sizing = style.getPropertyValue("box-sizing");
  if (box_sizing == "border-box") {
    var padding_top = parseFloat(style.getPropertyValue("padding-top"));
    var padding_bottom = parseFloat(style.getPropertyValue("padding-bottom"));
    var border_top = parseFloat(style.getPropertyValue("border-top-width"));
    var border_bottom = parseFloat(
      style.getPropertyValue("border-bottom-width")
    );
    height = height - padding_top - padding_bottom - border_top - border_bottom;
  }
  return height;
}

// Calculate width without padding.
function innerWidth(el) {
  var style = window.getComputedStyle(el, null);
  var width = parseFloat(style.getPropertyValue("width"));
  var box_sizing = style.getPropertyValue("box-sizing");
  if (box_sizing == "border-box") {
    var padding_left = parseFloat(style.getPropertyValue("padding-left"));
    var padding_right = parseFloat(style.getPropertyValue("padding-right"));
    var border_left = parseFloat(style.getPropertyValue("border-left-width"));
    var border_right = parseFloat(style.getPropertyValue("border-right-width"));
    width = width - padding_left - padding_right - border_left - border_right;
  }
  return width;
}

function maxLineCheck(orientation = "portrait") {
  const isExportMode = window.location.href.indexOf("exports") > -1;
  const isLocalDev = window.location.href.indexOf("localhost") > -1;
  const preventExportOverflow =
    document.body.dataset.preventExportOverflow === "true";
  const isProjectKit = isLocalDev
    ? undefined
    : window.parent.document.querySelector(".preview-frame");

  if ((isExportMode && preventExportOverflow) || isProjectKit) return;

  const textBlocks = document.querySelectorAll("[data-max-line]");

  textBlocks.forEach((block) => {
    const lineCount = countLines(block);
    // Getting the data-max-line attribute value (max number of lines allowed) and letting the number of an alt if the page is landscape
    const maxLine =
      orientation == "portrait"
        ? block.dataset.maxLine
        : block.dataset.maxLineAlt || block.dataset.maxLine;

    lineCount > maxLine
      ? block.classList.add("overflow")
      : block.classList.remove("overflow");
  });
  return true;
}

/**
*Detailed instruction can be found here:
 https://github.com/aleks-frontend/max-height-check
*/
function maxHeightCheck(variation = "primary") {
  const isExportMode = window.location.href.indexOf("exports") > -1;
  const isLocalDev = window.location.href.indexOf("localhost") > -1;
  const preventExportOverflow =
    document.body.dataset.preventExportOverflow === "true";
  const isProjectKit = isLocalDev
    ? undefined
    : window.parent.document.querySelector(".preview-frame");

  if ((isExportMode && preventExportOverflow) || isProjectKit) return;

  const textBlocks = document.querySelectorAll("[data-max-height]");

  textBlocks.forEach((block) => {
    const dynamicCheck =
      block.dataset.maxHeight == "dynamic" ||
      block.dataset.maxHeightDynamic == "true";
    if (dynamicCheck) dynamicAssign(block);

    const cssCheck = block.dataset.maxHeight == "css";
    const bodyComputedStyle = window.getComputedStyle(document.body);
    const blockHeight = block.scrollHeight;
    const unit = block.dataset.maxHeightUnit || "px";
    const maxHeightAlt = block.dataset.maxHeightAlt || block.dataset.maxHeight;
    let maxHeight =
      variation == "primary" ? block.dataset.maxHeight : maxHeightAlt;

    if (cssCheck) {
      const computedBlockStyle = window.getComputedStyle(block);
      maxHeight = parseFloat(computedBlockStyle.maxHeight);
    } else {
      // Setting the element's max-height
      block.style.maxHeight = maxHeight + unit;

      // Recalculating maxHeight in case 'rem' is set as a unit
      if (unit == "rem")
        maxHeight = maxHeight * parseFloat(bodyComputedStyle.fontSize);
    }

    // Adding an 'overflow' class to an element if it's offset height exceedes the max-line-height
    blockHeight > maxHeight
      ? block.classList.add("overflow")
      : block.classList.remove("overflow");
  });
}

function dynamicAssign(element) {
  const container = element.parentNode;
  container.style.overflow = "hidden";
  const containerComputed = {
    height: parseFloat(window.getComputedStyle(container).height),
    top: parseFloat(window.getComputedStyle(container).paddingTop),
    bottom: parseFloat(window.getComputedStyle(container).paddingBottom),
  };
  const containerHeight = Math.floor(
    containerComputed.height - containerComputed.top - containerComputed.bottom
  );
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
}

// Adding limit for the word length
function charLimit() {
  const elements = document.querySelectorAll("[data-char-limit]");

  elements.forEach((element) => {
    const limit = element.dataset.charLimit;

    if (element == null) {
      return;
    }
    var tokenValue = element.querySelectorAll(".token-value");

    if (tokenValue.length != 0) {
      element = tokenValue.item(0);
    }
    var code = element.innerText;
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
}
