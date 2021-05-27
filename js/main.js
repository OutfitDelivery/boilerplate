let template = new boilerplate({
    fonts: ['PUT_ALL_FONT_NAMES_HERE'],
    cssVariables,
    templateProps
  })

  // Please put all fonts needed for the tempate into the array bellow
  template.start().then(() => {
    template.hotReloadOnChange() // remove hotReloadOnChange after you have finished editing the template

    // template.setupPlaceholder("{{placeholder-visibility}}", ["{{{placeholder-1}}}", "{{{placeholder-2}}}"]);
    template.completeRender()
  }).catch(console.trace)

  // This function will run whenever there is a change to any text input, resize and on inital load
  template.on('inputs-change', (inputs) => {
    console.table(inputs)
    // template.textFit(document.querySelectorAll('p'), { fontUnit: 'rem', minFontSize: 0.5, maxFontSize: 1.5 })
    // template.maxLineCheck();
    // template.maxHeightCheck();
    // template.charLimit();
    // template.dynamicReplace();
  })

  // template.on('overflow', () => {
  //   console.log(template.overflows)
  // })