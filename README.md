[![](https://data.jsdelivr.com/v1/package/gh/OutfitDelivery/boilerplate/badge)](https://www.jsdelivr.com/package/gh/OutfitDelivery/boilerplate)

# Outfit Template Build Boilerplate
The standard template build boilerplate used by Outfit's Delivery Team.

If this is your first template maybe have a look at Delivery Academy for a great tutorial and tips/tricks

## Usage in Outfit
It's pretty simple. Navigate to `Releases` on the right sidebar. Select the Latest Release. Under the `Assets` Accordion and download the `vX.X.X Boilerplate.zip` (not the Source Code).

Then just upload this zip file under the `New Template` section in Outfit! 

## Getting Started
Before you start building the template there are few things that you need to do.
1. Add a Template Name in the `<title>` Tag 
2. Fill out the four metadata tags in the head `template-built-by`, `scope`, `build`, `updates`. In each of them just fill out the data in the `content` attribute.
3. Import all of your required fonts as `<link>` tags. Then list out all of your fonts in the `fonts` array. By default this will occur on line 50.
4. Choose your renderer. By default the renderer is set to `2` (this is for both Renderer 2 and 2.1). If you need to use Renderer 1 please change the following attribute on the body to `data-renderer="1"`. This sets the page height correctly to get around the renderer rounding error.

You are ready to get building. You will see a bunch of JS scripts calls. We are using JSDelivr for delivery and versioning. If you do notice that the version of the scripts does not match the Boilerplate version that you downloaded please chat with Matt.

By default there will be a bunch of scripts commented out. This is simply to save of resourses, not loading files that are not required by the template. Feel free to uncomment files as required.

## Included Functionality

## [Main.js](js/main.js)
Note: the main.js file needs to be included in every template as it contains necessary utilities which are documented below:
- `setSize()`
    * Sets the font size based on the window width & height, and some other factors
- `setupPlaceholder()`
    * If certain conditions are met, this function creates and inserts a div class="placeholderImage" at the beginning of the `<page>`
- `setOutfitState()`
    * Determines if the window is in mode of exports, templates, projects, preview or localhost, adds a correspdonding HTML attribute "document-state" with that value, e.g. document-state="exports", and returns that value
- `imageCompression()`
    * Selects any img element with a `[data-custom-compression]` attribute and adds a query flag to the image URL so that large images don't affect performance in preview mode
- `pageHeightSetup()`
    * Based on the renderer (either "1" or "2"), returns the appropriate page height
    * For renderer 1, or if renderer is not set, this is `100vh`
    * For renderer 2, this is `calc(100vh - 1px)` to adjust for the "magic pixel" error
- `setupMutationObserver()`
    * Creates a new MutationObserver from the provided parameters
- `invalidFontList()`
    * Checks if there were no fonts listed or if the placeholder "PUT_ALL_FONT_NAMES_HERE" is still present, and if either of these is true, returns true (i.e. the font list IS invalid)


## [Limiters.js](js/limiters.js)
- `maxLineCheck()`
    * Selects all elements with a `[data-max-line]` attribute. 
    * For each of those elements, counts its lines and compares that count against the max-line value provided from the element's dataset. 
    * If counted lines exceeds max-line value, an overflow class is added to the element.
- `maxHeightCheck()`
    * Selects all elements with a `[data-max-height]` attribute. 
    * For each of those elements, it gets their .scrollHeight. 
    * It then gets the max-height: if the max-height value from the attribute is "css", then it takes takes the max-height from the element using .getComputedStyle(), otherwise it takes the value provided directly from the `[data-max-height]` attribute. 
    * If the height of the element exceeds the max-height, an overflow class is added to the element.
- `dynamicAssign()`
    * Sets an element's data-max-height attribute equal to the parent element's height minus the height of any other children of that parent that have a class of "js-subtrahend". 
    * Also sets an attribute on the element of `max-height-dynamic="true"`, and sets the parent element's overflow to visible.
- `charLimit()`
    * Selects all elements with a `[data-char-limit]` attribute.
`NOTE TO MATT - NEED TO ADD THE NEW wordLimit FUNCTION TO THIS FILE`


## formatters
`NOTE TO MATT/SAM - SHOULD WE ADD replaceData() (banks function) to this file?`
- `dynamicReplaceSingle()`
    * Takes no arguments
    * Selects all elements with a `[data-replace-from]` attribute
    * For each of those elements, replaces all instances in the element of the value of `data-replace-from=` with the value of `data-replace-to=`
- `dynamicReplaceMulti(target, data)`
    * Replaces more than one text element inside of a DOM selector
    * param {string} target - DOM selector
    * param {array} data - an array with nested arrays holding pairs of strings
        * The 1st string is what the text will be replaced with, aka "replace-to"
        * The 2nd string is what the function will look for to replace, aka "replace-from"
    * e.g. `dynamicReplaceMulti('.output.multi', [['cats', 'dogs'], ['dinosaurs', 'birds']]);`
- `dynamicReplace()`
    * This function calls either `dynamicReplaceMulti()` or `dynamicReplaceSingle()` depending on whether arguments are passed to it
    * e.g. calling `dynamicReplaceMulti()` via `dynamicReplace`:
        * `dynamicReplace('.output.multi', [['cats', 'dogs'], ['dinosaurs', 'birds']]);`
    * e.g. calling `dynamicReplaceSingle()` via `dynamicReplace`:
        * `dynamicReplace();`


## custom-rich-text
    * Allows users to use rich text formatting inside spreadsheet inputs
    * Selects all elements with a `js-customRichText-src` class
    * Hides those elements
    * Maps particular character combinations to html tages with a map object, e.g. `'{b': '<strong>', 'b}': '</strong>', '{h1': '<h1>', 'h1}': '</h1>'`
    * For each of the selected elements, uses regex and the map object to run the required replacements
    * Creates and appends a new element with a `js-customRichText-target` class

## dynamic-flowing-content
    * Creates a column structure, allowing even individual elements (e.g. a `<p>`) to flow between columns

## fontfaceobserver
    * External web font loader
    * Load a font by creating a new FontFaceObserver instance and calling its load method
    * This will load the font and return a promise that is resolved when the font has loaded, or rejected if the font fails to load
    * This allows us to load all fonts and only then run other functions (see `index.html.mst` for usage)

## hide-empty-tiles
    * A temporary solution used because conditional tags for text inputs that include heading formatting don't (or weren't) working in some instances
    * Selects all elements with a clase of 'u-heading-patch'
    * For each of those elements, it then selects the element's child nodes and hides any of those that are empty by adding a class of 'u-hide'

## qrcode
    * An external javascript library for creating QRCodes

## textfit
    *

## validate
    * An external javascript library for validating javascript objects

## prefixfree
    * External tool for adding the current browser’s prefix to any CSS code, only when it’s needed.

## [mto.js](js/mto.js) [ALPHA - DO NOT USE]
`setupMTO("{{{team.mto}}}", {{{account.snippets.mtoV3-params}}}{{^account.snippets.mtoV3-params}}{}{{/account.snippets.mtoV3-params}}, `{{{mto-v3}}}{{^mto-v3}}[]{{/mto-v3}}`);`

The purpose of this function is to implement MTO v3 into a template. Not sure what MTO is, well then you probably shouldn't be using it in the template. Essentially MTO enables Multi-Team Owners (MTO) functionality. It makes use of the Team-Metadata input type from Outfit. The Team-Metadata input type lists out all the teams within a specific account and allows a user to select one or more team/s, then the input returns an array of the team/s meta-data. The MTO function comes in and hides all the teams listed within the input except the ones listed in the team.mto team metadata field. It also disables the input functionality on templates.

This function requires:
- A input defined in the account as `{{{mto-v3}}}` configured to Team Metadata
- Outfit Account snippet called `mtoV3-params` which contains the following `{'inputName': 'Bakery Selection', 'inputListClassList': '.sidebar-content .form-group .choice-variable .input-options .multichoice-edit-row.p-t-2', 'formGroupClassList': '.sidebar-content .form-group'}` (the inputName can be updated to be account specific)
- A handleMTOData() function - a function that takes in the array of team metadata and outputs it to a certain template. It is recommended that this be located in Account Snippets)
- [getOutfitState()](js/main.js#L188)
- [setOutfitState()](js/main.js#L173)
- [debounce()](js/main.js#L275)
