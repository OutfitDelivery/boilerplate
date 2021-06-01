// Please put all config needed for the tempate into the array bellow
let template = new boilerplate({
  fonts: ["PUT_ALL_FONT_NAMES_HERE"],
  trimMarks: templateProps['trim-marks'] === 'true',
  cssVariables,
  templateProps,
  hotReloadOnChange: true,
  placeholderVisibility: templateProps['placeholder-visibility'],
  placeholderImages: templateProps['placeholder-1'],
});

// This function will run whenever there is a change to any text input, resize and on inital load
template.on("inputs-change", (templateProps) => {
  console.table(templateProps);
  // template.textFit(document.querySelectorAll('p'), { fontUnit: 'rem', minFontSize: 0.5, maxFontSize: 1.5 })
  // template.dynamicReplace();
  // template.maxHeightCheck();
  // template.maxLineCheck();
  // template.charLimit();
  template.completeRender();
});

// template.on('overflow', () => {
//   console.log(template.overflows)
// })
