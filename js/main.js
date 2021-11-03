// Please put all config needed for the tempate into the array bellow
const template = new boilerplate({
  fonts: ['PUT_ALL_FONT_NAMES_HERE'],
  hotReloadOnChange: true,
});

// template.on('overflow', () => {
//   console.log(template.overflows)
// })

// This function will run whenever there is a change to any text input, resize and on inital load
template.on('inputs-change', async (inputs) => {
  const { accounts, team, user } = inputs;
  console.log(inputs);

  template.trimMarks = inputs.trimMarks;
  template.setupPlaceholder(inputs['placeholder-1']); // remove this line if you are not using a placeholder image
  // This is where you can do all your magic
  document.querySelectorAll('h1').forEach((element) => {
    element.innerText = `Welcome to ${accounts.name}!`;
  });
  template.textFit(document.querySelectorAll('h1'), {
		fontUnit: '%',
		minFontSize: 50,
		maxFontSize: 100,
		widthOnly: true,
		maxLine: 1,
	}); // this code will use textfit to keep the element on a single line or overflow if it can't at half the font-size

  await template.ensureAllImagesLoaded();
  template.maxHeightCheck(document.querySelectorAll('.container'));
  template.maxLineCheck(document.querySelectorAll('.body-copy'), 4);
  // template.dynamicReplace();
  // template.charLimit();
  template.completeRender();
});
