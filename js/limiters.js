function maxLineCheck(orientation = 'portrait') {
    const isExportMode = window.location.href.indexOf('exports') > -1;
    const preventExportOverflow = document.body.dataset.preventExportOverflow === 'true';
    const isProjectKit = window.parent.document.querySelector(".preview-frame");
  
    if ( ( isExportMode && preventExportOverflow ) || isProjectKit ) return;
      
    const textBlocks = document.querySelectorAll('[data-max-line]');
    
    textBlocks.forEach(block => {
      const computedStyle = window.getComputedStyle(block);
      // Checking if line-height is not set and has a normal value set by default
      const isNormal = computedStyle.getPropertyValue('line-height') == 'normal';
      // Getting the font-size of an element that will help us calculate the line-height
      // if the line-height is set to 'normal'
      const fontSize = parseFloat(computedStyle.getPropertyValue('font-size'));
      // If line-height is normal, we multiply the element's font-size with 1.14
      if ( isNormal ) block.style.lineHeight = (fontSize * 1.14) + 'px';
      const lineHeight = parseFloat(computedStyle.getPropertyValue('line-height'));
      const blockHeight = block.scrollHeight;
      // Getting the data-max-line attribute value (max number of lines allowed)
      const maxLineAlt = block.dataset.maxLineAlt || block.dataset.maxLine;
      const maxLine = (orientation == 'portrait') ? block.dataset.maxLine : maxLineAlt;
      // Setting the element's max-height 
      const limitHeight = (lineHeight * maxLine) + (lineHeight / 2);
      
      block.style.maxHeight = limitHeight + 'px';
      ( blockHeight > limitHeight ) ? block.classList.add('overflow') : block.classList.remove('overflow');
    });
  }
  
  /**
    *Detailed instruction can be found here:
     https://github.com/aleks-frontend/max-height-check
  */
  
  function maxHeightCheck(variation = 'primary') {
    const isExportMode = window.location.href.indexOf('exports') > -1;
    const preventExportOverflow = document.body.dataset.preventExportOverflow === 'true';
    const isProjectKit = window.parent.document.querySelector(".preview-frame");
  
    if ( ( isExportMode && preventExportOverflow ) || isProjectKit ) return;
      
    const textBlocks = document.querySelectorAll('[data-max-height]');
  
    textBlocks.forEach(block => {
      const dynamicCheck = block.dataset.maxHeight == 'dynamic' || block.dataset.maxHeightDynamic == 'true';
      if ( dynamicCheck ) dynamicAssign(block);
  
      const cssCheck = block.dataset.maxHeight == 'css';
      const bodyComputedStyle = window.getComputedStyle(document.body);
      const blockHeight = block.scrollHeight;
      const unit = block.dataset.maxHeightUnit || 'px';
      const maxHeightAlt = block.dataset.maxHeightAlt || block.dataset.maxHeight;
      let maxHeight = (variation == 'primary') ? block.dataset.maxHeight : maxHeightAlt;    
  
      if ( cssCheck ) {
        const computedBlockStyle = window.getComputedStyle(block);
        maxHeight = parseInt(computedBlockStyle.maxHeight);
      } else {
        // Setting the element's max-height
        block.style.maxHeight = maxHeight + unit;
  
        // Recalculating maxHeight in case 'rem' is set as a unit
        if ( unit == 'rem' ) maxHeight = maxHeight * parseFloat(bodyComputedStyle.fontSize);      
      }
  
      // Adding an 'overflow' class to an element if it's offset height exceedes the max-line-height
      ( blockHeight > maxHeight ) ? block.classList.add('overflow') : block.classList.remove('overflow');
    });
  }
  
  function dynamicAssign(element) {
    const container = element.parentNode;
    container.style.overflow = 'hidden';
    const containerComputed = {
      height: parseFloat(window.getComputedStyle(container).height),
      top: parseFloat(window.getComputedStyle(container).paddingTop),
      bottom: parseFloat(window.getComputedStyle(container).paddingBottom)
    };
    const containerHeight = Math.floor(containerComputed.height - containerComputed.top - containerComputed.bottom);
    const subtrahends = [...container.querySelectorAll('.js-subtrahend')];
  
    const subtrahendsHeight = subtrahends.reduce((totalHeight, subtrahend) => {
      const subtrahendMargins = {
        top: parseFloat(window.getComputedStyle(subtrahend).marginTop),
        bottom: parseFloat(window.getComputedStyle(subtrahend).marginBottom)
      };
      return totalHeight + subtrahend.offsetHeight + subtrahendMargins.top + subtrahendMargins.bottom;
    }, 0);
    
    const dynamicHeight = containerHeight - subtrahendsHeight;
  
    element.dataset.maxHeightDynamic = 'true';
    element.dataset.maxHeight = dynamicHeight;
    container.style.overflow = 'visible';
  }
  
  // Adding limit for the word length
  function charLimit() {
    const elements = document.querySelectorAll("[data-char-limit]");
  
    elements.forEach(element => {
      const limit = element.dataset.charLimit;
  
      if(element == null) { return }
      var tokenValue = element.querySelectorAll(".token-value");
  
      if(tokenValue.length != 0) {
        element = tokenValue.item(0);
      }
      var code = element.innerText;
      if(code.length > limit) {
        // Check Token Again
        if(tokenValue.length != 0) {
          element.parentNode.classList.add("overflow");  
        }
        else {
          element.classList.add("overflow");
        }
      }
      else {
        // Check Token Again
        if(tokenValue.length != 0) {
          element.parentNode.classList.remove("overflow");  
        }
        else {
          element.classList.remove("overflow");
        }
      }
    })
  }    
  