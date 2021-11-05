// Please put all config needed for the tempate into the array bellow
const template = new boilerplate({
  fonts: ['PUT_ALL_FONT_NAMES_HERE'],
  trimMarks: templateProps['trim-marks'] === 'true',
  hotReloadOnChange: true,
  placeholderVisibility: templateProps['placeholder-visibility'],
  placeholderImages: templateProps['placeholder-1'],
});

// This function will run whenever there is a change to any text input, resize and on inital load
template.on('inputs-change', async (inputs) => {
  console.log(inputs);
  // This is where you can do all your magic
  document.querySelector('h1').innerHTML = `Welcome to , ${inputs.account.name}!`;
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
