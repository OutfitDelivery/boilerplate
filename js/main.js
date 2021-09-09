// Please put all config needed for the tempate into the array bellow
const template = new boilerplate({
  fonts: ['PUT_ALL_FONT_NAMES_HERE'],
  trimMarks: templateProps['trim-marks'] === 'true',
  cssVariables,
  templateProps,
  hotReloadOnChange: true,
  placeholderVisibility: templateProps['placeholder-visibility'],
  placeholderImages: templateProps['placeholder-1'],
});

// This function will run whenever there is a change to any text input, resize and on inital load
template.on('inputs-change', async (inputs) => {
  console.log(inputs);

  document.querySelector('h1').innerHTML = `Hello, ${inputs.user.name}!<br>I appreciate you`;
  template.textFit(document.querySelectorAll('h1'), { fontUnit: 'rem', minFontSize: 0.5, maxFontSize: 1.5 });

  await template.ensureAllImagesLoaded();

  // template.dynamicReplace();
  // template.maxHeightCheck();
  // template.maxLineCheck();
  // template.charLimit();
  template.completeRender();
});

// template.on('overflow', () => {
//   console.log(template.overflows)
// })
