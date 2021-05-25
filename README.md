[![](https://data.jsdelivr.com/v1/package/gh/OutfitDelivery/boilerplate/badge)](https://www.jsdelivr.com/package/gh/OutfitDelivery/boilerplate)

# Outfit Template Build Boilerplate
The standard template build boilerplate used by Outfit's Delivery Team.

If this is your first template maybe have a look at Delivery Academy for a great tutorial and tips/tricks

## Usage in Outfit
It's pretty simple. Navigate to `Releases` on the right sidebar. Select the Latest Release. Under the `Assets` Accordion and download the `vX.X.X Boilerplate.zip` (not the Source Code).

Then just upload this zip file under the `New Template` section in Outfit! 

This version of the boilerplate is recommended with extenral stylesheets and scripts. Please provde a reason why you can't place styles extenraly if you are going to do that.

## Getting Started
Before you start building the template there are few things that you need to do.
1. Add a Template Name in the `<title>` Tag 
2. Fill out the metadata tags in the head `template-built-by`, `scope`, `build`, `updates`. In each of them just fill out the data in the `content` attribute.
3. Import all of your required fonts as `<link>` tags. Then list out all of your fonts in the `fonts` array of the boilerplate config.
4. Choose your renderer. You will need to set your renderer to 1.1 or 2.1 or pass in `allowLegacyRendering: true`. If you need to use a legacy render please document the reason why this is necessary

We are using AWS S3 for delivery and versioning. If you do notice that the version of the scripts does not match the Boilerplate version that you downloaded please chat with Sam.

You are ready to get building. You will see a few JS script calls. Anything being called by default in the boilerplate is vital for the template to run correctly and shouldn't be removed. In addition, there will be a bunch of functions commented out. This is simply to save resources, not running functions that are not required by all templates. Feel free to uncomment as required.


## [Boilerplate.js](modules/boilerplate.js)
Note: the boilerplate.js file needs to be included in every template as it contains the boilerplate class and vital functions (i.e. template.start() and template.completeRender()) plus utilities (documented further below). Here is an example of boilerplate being used in index.html.mst
```
// Please put all fonts needed for the tempate into the array below
let template = new boilerplate({
    fonts: ['IBM Plex Sans']
});

template.start().then(() => {
    // tempalte code
    template.completeRender();
}).catch(console.trace);

// This event will happen when there is a resize or first load of document
template.addEventListener("textValidation", () => {
    // template.textFit(document.querySelectorAll('p'), { fontUnit: 'rem', minFontSize: 0.5, maxFontSize: 1.5 })
    // template.maxLineCheck();
    // template.maxHeightCheck();
    // template.charLimit();
    // template.dynamicReplace();
}
```

### Vital Functions in [Boilerplate.js](modules/boilerplate.js)
#### template.start()
- runs all checks (e.g. if DOM content is loaded, if fonts are loaded) 
- after all checks, emits a `textValidation` event, which `index.html.mst` listens for (and this is where we run limiter functions like `maxHeightCheck` in `index.html.mst` - see code block above)
- runs image compression (after everything else) if state is "document"


#### completeRender()
- after `document.readyState` is "complete", dispatches "printready" event


### Other Functions/Utilities in [Boilerplate.js](modules/boilerplate.js)
#### Overflow functions
```
// max line check: adds an overflow if the number of lines is greater than data-max-line 
template.maxLineCheck();

// min line check: adds an overflow if the number of lines is lower than data-min-line 
template.minLineCheck();

// max height check: adds an overflow if data-max-height is larger than the element's actual height
// it also supports data-max-height="css" and data-max-height="parent" if you want the hight to be set via the css value or the height of the parent  
template.maxHeightCheck();

// char limit: adds an overflow if the number of characters is larger than data-char-limit
template.charLimit();
```
#### Utilites
```
// this function can be used to add inline styles if required. It is the only safe way to add css varibles. Please pass all CSS varibles into the boilerplates cssVariables option 
template.addStyle('body { background: red; }')
```

<!-- - setSize()
    Sets the font size based on the window width & height, and some other factors.
- setupPlaceholder()
    If certain conditions are met, this function creates and inserts a div class="placeholderImage" at the beginning of the <page>.
- setOutfitState()
    Determines if the window is in mode of exports, templates, projects, preview or localhost, adds a correspdonding HTML attribute "document-state" with that value, e.g. document-state="exports", and returns that value.
- imageCompression()
    Selects any img element with a [data-custom-compression] attribute and adds a query flag to the image URL so that large images don't affect performance in preview mode.
- pageHeightSetup()
    Based on the renderer (either "1" or "2"), returns the appropriate page height. For renderer 1, or if renderer is not set, this is 100vh. For renderer 2, this is calc(100vh - 1px) to adjust for the "magic pixel" error.
- setupMutationObserver()
    creates a new MutationObserver from the provided parameters.
- invalidFontList()
    checks if there were no fonts listed or if the placeholder "PUT_ALL_FONT_NAMES_HERE" is still present, and if either of these is true, returns true (i.e. the font list IS invalid) -->

## [Replace.js](modules/replace.js) (formatters)
- Replaces something in the template with something else
- The first parameter is the element the replace function will run on
- The second parameter is an array of changes
    - The 1st element is the new content to be inserted
    - The 2nd element is the content to be replaced/removed
```
template.dynamicReplace({TARGET SELECTOR}, [ARRAY OF CHANGES]);
template.dynamicReplace('.name', [
    ['sam','firstname'],
    ['henry','lastname']
])
```
If no arguments are given the function will replaces text inside of `data-replace-from=` with `data-replace-to=` on all elements on the page

`<div data-replace-from="firstname" data-replace-to="sam" >Hey firstname</div>`
```
template.dynamicReplace()
```
## [Textfit.js](modules/textFit.js) 
```
template.textFit(document.querySelectorAll('h1'), { minFontSize: 0.5, maxFontSize: 2 });
```

## [MTO.js](modules/mto.js) 
```
template.setupMTO({{{mto-v3}}}, "{{{team.mto}}}", 'Branch Selection').then(mtoData => {
    // add metadata to the template
}).catch(console.error);

or 

template.setupMTO({{{mto-v3}}}, "{{{team.mto}}}", 'Branch Selection')
handleMTOData(mtoData, settings)
```

<!-- The purpose of this function is to implement MTO v3 into a template. Not sure what MTO is, well then you probably shouldn't be using it in the template. Essentially MTO enables Multi-Team Owners (MTO) functionality. It makes use of the Team-Metadata input type from Outfit. The Team-Metadata input type lists out all the teams within a specific account and allows a user to select one or more team/s, then the input returns an array of the team/s meta-data. The MTO function comes in and hides all the teams listed within the input except the ones listed in the team.mto team metadata field. It also disables the input functionality on templates. -->

1. This function requires a team metadata input to be given as the first arugment. 
2. The second arguments is the list of teams the user is allowed to access based on there team. This will come out of the teams metadata and will bew in the format of a comma separated string of team ID's 
3. The last argument is the input name that will be used to detect when the the sidebar element is on screen and remove teams that the user is not allowed to access. 