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
- setSize()
TO WRITE

## [Main.js](js/main.js)
- setSize()
- setupPlaceholder()
- setOutfitState() | getOutfitState()
- imageCompression()
- pageHeightSetup()
- setupMutationObserver()
- validFontList()

## [Limiters.js](js/limiters.js)
- maxLineCheck()
- maxHeightCheck()
- dynamicAssign()
- charLimit()
`NOTE TO MATT - NEED TO ADD THE NEW wordLimit FUNCTION TO THIS FILE`

## formatters
`dynamicReplaceSingle()`
replaces text inside of `data-replace-from=` with `data-replace-to=` on all elements on the page

`dynamicReplaceMulti()`
replaces more than one text element inside of a DOM selector.
The 1st element is what the text will be replaced with.
The 2nd element is what the fuction will look for to replace.

dynamicReplaceMulti({TARGET SELECTOR}, [ARRAY OF CHANGES]);

dynamicReplace('.output.multi', [['!# dogs: /}', 'dogs'], ['dinosaurs', 'birds']]);

`dynamicReplace()`
This function calls either `dynamicReplaceMulti()` or `dynamicReplaceSingle()` depending on if there are arguments

## custom-rich-text

## qrcode

## textfit

## validate

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
