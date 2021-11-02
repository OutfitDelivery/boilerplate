// Please put all config needed for the tempate into the array bellow
const template = new boilerplate({
  fonts: ['PUT_ALL_FONT_NAMES_HERE'],
  trimMarks: window.payload['trim-marks'],
  hotReloadOnChange: true,
});

// template.on('overflow', () => {
//   console.log(template.overflows)
// })

// This function will run whenever there is a change to any text input, resize and on inital load
template.on('inputs-change', async (inputs) => {
  let { team, user, accounts } = inputs;
  console.log(inputs);

  template.setupPlaceholder('show', inputs['placeholder-1']);
  // This is where you can do all your magic
  document.querySelector('h1').innerHTML = `Welcome to , ${accounts.name}!`;
  template.textFit(document.querySelectorAll('h1'), {
    fontUnit: '%', minFontSize: 60, maxFontSize: 100, widthOnly: true,
  });

  await template.ensureAllImagesLoaded();
  // template.dynamicReplace();
  // template.maxHeightCheck();
  // template.maxLineCheck();
  // template.charLimit();
  template.completeRender();
});
