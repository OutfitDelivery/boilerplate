[![](https://data.jsdelivr.com/v1/package/gh/OutfitDelivery/boilerplate/badge)](https://www.jsdelivr.com/package/gh/OutfitDelivery/boilerplate)

# Outfit Template Build Boilerplate
The standard template build boilerplate used by Outfit's Delivery Team.

If this is your first template maybe have a look at Delivery Academy for a great tutorial and tips/tricks

## Usage in Outfit
Download [boilerplate.zip](https://github.com/OutfitDelivery/boilerplate/raw/master/boilerplate.zip) from the boilerplate repo.

Then just upload this zip file under the `New Template` section in Outfit! 

This version of the boilerplate is recommended with external stylesheets and scripts. Please provide a comment at the top of your index.html.mst explaining why you can't place styles externally if you are going to do that (Note: if you create style tags inside index.html.mst, you'll receive error messages in your console about this.) 

## Getting Started
Before you start building the template there are few things that you need to do.
1. Add a Template Name in the `<title>` Tag.
2. Fill out the metadata tags in the head `template-built-by`, `scope`, `build`, `updates`. In each of them just fill out the data in the `content` attribute.
3. Import all of your required fonts as `<link>` tags or account snippets.
4. Ensure you are using external css and js files. 
5. Add your inputs to the `templateProps` object in the top script tag. The naming of these properties needs to match the input names **exactly**, e.g. ``` "placeholder-visibility": `{{{placeholder-visibility}}}` ```.
6. Add any account colours required to the cssVariables object in the top script tag. These variables will be available in your external stylesheet as normal.
7. Choose your renderer. You will need to set your renderer to 1.1 or 2.1

We are using AWS S3 for delivery and versioning. If you do notice that the version of the scripts does not match the Boilerplate version that you downloaded please chat with Sam.

The boilerplate is set up for use with *Less*. For *Less* to compile, you will need to be using *VS Portal* or handle this with CI tools (please contact Sam about this if you haven't got *VS Portal* set up).

If you prefer plain CSS, you can create your own styles.css file and link to that from index.html.mst.

Final note: if using *Less*, when you finish your build, for performance reasons, it's preferable to change your stylesheet link over to the compiled CSS file instead of maintaining the link to the .less file. 
## Scripts
There are two key scripts imported into index.html.mst:
- main.js
- boilerplate.js

### [Main.js](js/main.js)
`Main.js` runs all the vital functions for any template to function. Anything being called by default shouldn't be removed. In addition, there are various functions commented out. This is simply to save resources, not running functions that are not required by all templates. Uncomment functions as required.

To get started you need to import the boilerplate object. This can be done as a ES6 import modules but seeing that but seeing that is not supported in render 2.0 we will be importing the boilerpalte as a script tag and using it as follows
```javascript
let template = new boilerplate();
```
Here is a list of the available config options:
```javascript
let template = new boilerplate({
  fonts: Array, // (default: undefined) an array of fonts that need to be checked are loaded. If these fonts don't load in 3 seconds then the template will stop running. This array is used to ensure that the fonts are all loaded before we run any text validation as the font size can be effect load time of the document.  
  templateProps: Object, // (default: {}) default input values that should be passed into the input-change event before the platform injects the users changes
  trimMarks: Boolean, // (default: false) if this is true the boilerplate will add trim marks around this template. If trim marks are added then you will need to also configure trim marks in the templates format. 
  addCrop: Boolean, // (default: true) if false crop marks will not be added when crop marks are enabled
  placeholderVisibility: String, // (default: "") enables the playment of the placeholder image. Placeholders will show up unless this is set ot hide
  placeholderImages: Array, // (default: []) an array of placeholder images which will be overlayed over the template. When more than one placeholder is passed in they will be placed on sequential pages 
  domReadyLoad: Boolean, // (default: false) should the template code run after the DOMContentLoaded event or the load event. By default this is the load event and setting this to true will use the DOMContentLoaded event instead
  ensureImagesLoad: Boolean, // (default: true) should the template wait for  all images areto load before completing the export. This is useful for templates that have a lot of images or very large images
  exportReduceFont: Number, // (default: 0) should the font size be sacaled based on a factor of the export size
  camelCase: Boolean, // (default: false) should the input names passed in by the input-change event be converted to camelCased 
  hotReloadOnChange: Boolean, // (default: false) should the template reload when the fs-sync event is triggered. This is triggered by vs-portal and fs-sync
  allowNoMetaData: Boolean, // (default: false) should the template allow the user to create a template without the corret metadata
  cssVariables: String, // (default: "") a list of CSS variables that should be added to the root tag on the page. 
});
```

**Note:** any additional functions you write or add to your template should be called in the same place as all the pre-existing functions, i.e. inside the `template.on("inputs-change"...` block:
```javascript
template.on("inputs-change", (inputs) => {
  console.table(inputs);

  // CALL YOUR FUNCTIONS HERE

  template.completeRender();
});
```

The boilerplate object in `main.js` has various properties. There are a few key ones for builders:
- `hotReloadOnChange`
- `placeholderVisibility`
- `placeholderImages`: takes a single image as a string **or** an array of images.

At the end of your build, please remove these three properties entirely so they aren't left in production.

### [Boilerplate.js](modules/boilerplate.js)
`Boilerplate.js` contains the boilerplate class, vital functionality and utilities used in `main.js`. 

##### completeRender()
This is vital to the functioning of the template. After `document.readyState` is "complete", it dispatches the "printready" event.
```javascript
template.completeRender();
```
##### ensureAllImagesLoaded() 
We don't want to export until all the images are loaded. We also might not want to run limiters until images have loaded as the aspect ratio of a loaded image can change the results. 
This promise will return when all images have been loaded in a given section of the screen. (Defaults to the entire document).
It also takes a timeout (in ms) for how long to wait for images to be load. (Defaults to 60 seconds).
```javascript
await template.ensureAllImagesLoaded()
```
```javascript
let container = document.querySelector('#container');
let images = await template.ensureAllImagesLoaded(container, 5000)
console.log(images)
```

#### Overflow functions
###### maxLineCheck()
Adds an overflow if the number of lines is greater than data-max-line 
```javascript
template.maxLineCheck();
```
###### minLineCheck()
Adds an overflow if the number of lines is lower than data-min-line 
```javascript
template.minLineCheck();
```
###### maxHeightCheck()
Adds an overflow if data-max-height is larger than the element's actual height. It also supports data-max-height="css" and data-max-height="parent" if you want the hight to be set via the css value or the height of the parent 
```javascript
template.maxHeightCheck();
```
###### charLimit()
Adds an overflow if the number of characters is larger than data-char-limit
```javascript
template.charLimit();
```

###### detectElementOverflow()
Works out if elements are touching each other https://www.npmjs.com/package/detect-element-overflow
```javascript
// boolean true/false clip checks
template.detectElementOverflow(element, element.parentNode).collidedTop;
template.detectElementOverflow(element, element.parentNode).collidedBottom;
template.detectElementOverflow(element, element.parentNode).collidedLeft;
template.detectElementOverflow(element, element.parentNode).collidedRight;
template.detectElementOverflow(element, element.parentNode).collidedY;
template.detectElementOverflow(element, element.parentNode).collidedZ;
template.detectElementOverflow(element, element.parentNode).collidedAny;

// how much are they touching each other in px
template.detectElementOverflow(element, element.parentNode).overflowTop;
template.detectElementOverflow(element, element.parentNode).overflowBottom;
template.detectElementOverflow(element, element.parentNode).overflowLeft;
template.detectElementOverflow(element, element.parentNode).overflowRight;
```
#### Utilites
###### addStyle()
Can be used to add inline styles if required. It is the only safe way to add css varibles. Please pass all CSS varibles into the boilerplates cssVariables option 
```javascript
template.addStyle('body { background: red; }')
```

### [Replace.js](modules/replace.js) (aka formatters)
- Replaces a string with another string
- The first parameter is the element the replace function will run on
- The second parameter is an array of changes
    - The 1st element is the new string to be inserted
    - The 2nd element is the string to be replaced/removed
```javascript
template.dynamicReplace({TARGET SELECTOR}, [ARRAY OF CHANGES], "fallback colour");
template.dynamicReplace('.name', [
    ['sam','firstname'],
    ['henry','lastname']
], "#654534")
```
If no arguments are given, the `dynamicReplace()` function will run on any elements on the page with `data-replace-from=` (i.e. the string to be replaced/removed) and `data-replace-to=` (i.e. the new string) attributes.

`<div data-replace-from="firstname" data-replace-to="sam" >Hey firstname</div>`
```javascript
template.dynamicReplace() // => Hey sam
```
### [Textfit.js](modules/textFit.js) 
```javascript
template.textFit(document.querySelectorAll('h1'), { minFontSize: 0.5, maxFontSize: 2 });
```
Examples of textfit options 
```javascript 
template.textFit(document.querySelectorAll('h1'), {
    alignVert: Boolean, // (default: false) if true, textFit will align vertically using css tables
    alignHoriz: Boolean, // (default: false) if true, textFit will set text-align: center
    stopOverflow: Boolean, // (default: false) if true, an overlfow error we be thrown if the content is overflowing
    fontUnit: String, // (default: "rem") what unit should the final font be. using rems, % or mm is sometimes useful
    fontChangeSize: Number, // (default: 0.01) how much accuracy should be used by textfit. 0.1 and 0.01 is useful for when using a rem font unit but higher numbers have better performance 
    minFontSize: Number, // (default: 0.3) the smallest supported font size 
    maxFontSize: Number, // (default: 1) the largest supported font size 
    maxLine: Boolean, // (default: null) if set font will reduce until it is equal to or less than this many of lines. This is automaticly set if data-max-line is used 
    growInSize: Boolean, // (default: false) set the width and height of the element to 100% to allow the element to grow 
    containerChecks: Array, // (default: []) array of dom elements that also should be considered when ajusting font size. If there is an overflow on these then we are going to assume we need to reduce the font size of textfit
    reProcess: Boolean, // (default: true) if true, textFit will re-process already-fit nodes. Set to 'false' for better performance 
    widthOnly: Boolean, // (default: false) if true, textFit will fit text to element width, regardless of text height
    alignVertWithFlexbox: Boolean, // (default: false) if true, textFit will use flexbox for vertical alignment
    display: String, // (default: "inline-block") in case you need to change this but I wouldn't recommend it as the default is what is tested
  });
```

### [MTO.js](modules/mto.js) 
MTO enables Multi-Team Owners (MTO) functionality. It makes use of the Team-Metadata input type from Outfit. The Team-Metadata input type lists out all the teams within a specific account and allows a user to select one or more team/s, then the input returns an array of the team/s' meta-data. MTO hides all the teams listed within the input except the ones listed in the team.mto team metadata field. 
- Note: MTO functionality only runs on documents, not templates.

###### setupMTO()
- Does everything described above
- 1st argument - the team metadata input
- 2nd argument - the list of teams the user is allowed to access based on their team. This will come out of the team's metadata and will be in the format of a comma separated string of team ID's.
- 3rd argument -  the input name that will be used to detect when the the sidebar element is on screen and remove teams that the user is not allowed to access.
```javascript
template.setupMTO({{{mto-v3}}}, "{{{team.mto-v3}}}", 'Branch Selection')
```
- Note: `setupMTO()` is required before attempting to use mto data in any way (e.g. by calling a function like `runMTO()` below)

###### Using MTO
You can use the data provided by `setupMTO()` and manipulate the DOM in whichever ways the template requires. There is no standard across all clients for what a template might do with MTO data. Consult squad leads or past templates for possible examples that are relevant to your client/template.
In general, you would define a function in your template and pass {{{mto-v3}}} to it, e.g.

```javascript
let runMTO = (mtoData) => {
    console.log(mtoData)
    //your DOM manipulations
}
runMTO({{{mto-v3}}});
```

Many implementations of a function like `runMTO()` also require a `formatPhoneNumber()` function e.g. 

```javascript
let formatPhoneNumber = (str) => {
    str = str.replace(/[^.\d]/g, '').replace(/ /g,'');
    if (str.length === 8) {
    return str.replace(/(\d{4})(\d{4})/, "$1 $2");
    } else if (str.length === 10) {
    return str.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    } else {
    return [str.slice(0, 4), " ", str.slice(4)].join('');
    }
}
```

For a full example of `runMTO()` see [Bendigo runMTO()](https://github.com/OutfitDelivery/boilerplate/wiki/Bendigo-runMTO())



