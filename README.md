[![](https://data.jsdelivr.com/v1/package/gh/OutfitDelivery/boilerplate/badge)](https://www.jsdelivr.com/package/gh/OutfitDelivery/boilerplate)

# Outfit Template Build Boilerplate
The standard template build boilerplate used by Outfit's Delivery Team.

If this is your first template maybe have a look at Delivery Academy for a great tutorial and tips/tricks

## Usage in Outfit
Download [boilerplate.zip](https://github.com/OutfitDelivery/boilerplate/blob/3.0/boilerplate.zip?raw=true) from the boilerplate repo. 

Then just upload this zip file under the `New Template` section in Outfit! 

This version of the boilerplate is recommended with external stylesheets and scripts. Please provide a comment at the top of your index.html.mst explaining why you can't place styles externally if you are going to do that (Note: if you create style tags inside index.html.mst, you'll receive error messages in your console about this.) 

## Getting Started
Before you start building the template there are few things that you need to do.
1. Add a Template Name in the `<title>` Tag.
2. Fill out the metadata tags in the head `template-built-by`, `scope`, `build`, `updates`. In each of them just fill out the data in the `content` attribute.
3. Import all of your required fonts as `<link>` tags or account snippets.
4. List out all of your fonts in the `fonts` array of the boilerplate config in `main.js`.
5. Ensure you are using external css and js files. 
6. Add your inputs to the `templateProps` object in the top script tag. The naming of these properties needs to match the input names **exactly**, e.g. ``` "placeholder-visibility": `{{{placeholder-visibility}}}` ```.
7. Add any account colours required to the cssVariables object in the top script tag. These variables will be available in your external stylesheet as normal.
8. Choose your renderer. You will need to set your renderer to 1.1 or 2.1 or pass in `allowLegacyRendering: true`. If you need to use a legacy render please document the reason why this is necessary.

We are using AWS S3 for delivery and versioning. If you do notice that the version of the scripts does not match the Boilerplate version that you downloaded please chat with Sam.

The boilerplate is set up for use with *Less*. For *Less* to compile, you will need to be using *VS Portal* (please contact Sam about this if you haven't got *VS Portal* set up).

If you prefer plain CSS, you can create your own styles.css file and link to that from index.html.mst.

Final note: if using *Less*, when you finish your build, for performance reasons, it's preferable to change your stylesheet link over to the compiled CSS file instead of maintaining the link to the .less file. 

## Scripts
There are two key scripts imported into index.html.mst:
- main.js
- boilerplate.js

### [Main.js](js/main.js)
`Main.js` runs all the vital functions for any template to function. Anything being called by default shouldn't be removed. In addition, there are various functions commented out. This is simply to save resources, not running functions that are not required by all templates. Uncomment functions as required.

**Note:** any additional functions you write or add to your template should be called in the same place as all the pre-existing functions, i.e. inside the `template.on("inputs-change"...` block:
```
template.on("inputs-change", (templateProps) => {
  console.table(templateProps);

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

###### completeRender()
This is vital to the functioning of the template. After `document.readyState` is "complete", it dispatches the "printready" event.
```
template.completeRender();
```

#### Overflow functions
###### maxLineCheck()
Adds an overflow if the number of lines is greater than data-max-line 
```
template.maxLineCheck();
```
###### minLineCheck()
Adds an overflow if the number of lines is lower than data-min-line 
```
template.minLineCheck();
```
###### maxHeightCheck()
Adds an overflow if data-max-height is larger than the element's actual height. It also supports data-max-height="css" and data-max-height="parent" if you want the hight to be set via the css value or the height of the parent 
``` 
template.maxHeightCheck();
```
###### charLimit()
Adds an overflow if the number of characters is larger than data-char-limit
```
template.charLimit();
```

#### Utilites
###### addStyle()
Can be used to add inline styles if required. It is the only safe way to add css varibles. Please pass all CSS varibles into the boilerplates cssVariables option 
```
template.addStyle('body { background: red; }')
```

### [Replace.js](modules/replace.js) (aka formatters)
- Replaces a string with another string
- The first parameter is the element the replace function will run on
- The second parameter is an array of changes
    - The 1st element is the new string to be inserted
    - The 2nd element is the string to be replaced/removed
```
template.dynamicReplace({TARGET SELECTOR}, [ARRAY OF CHANGES]);
template.dynamicReplace('.name', [
    ['sam','firstname'],
    ['henry','lastname']
])
```
If no arguments are given, the `dynamicReplace()` function will run on any elements on the page with `data-replace-from=` (i.e. the string to be replaced/removed) and `data-replace-to=` (i.e. the new string) attributes.

`<div data-replace-from="firstname" data-replace-to="sam" >Hey firstname</div>`
```
template.dynamicReplace() // => Hey sam
```
### [Textfit.js](modules/textFit.js) 
```
template.textFit(document.querySelectorAll('h1'), { minFontSize: 0.5, maxFontSize: 2 });
```

### [MTO.js](modules/mto.js) 
MTO enables Multi-Team Owners (MTO) functionality. It makes use of the Team-Metadata input type from Outfit. The Team-Metadata input type lists out all the teams within a specific account and allows a user to select one or more team/s, then the input returns an array of the team/s' meta-data. MTO hides all the teams listed within the input except the ones listed in the team.mto team metadata field. 
- Note: MTO functionality only runs on documents, not templates.

###### setupMTO()
- Does everything described above
- 1st argument - the team metadata input
- 2nd argument - the list of teams the user is allowed to access based on their team. This will come out of the team's metadata and will be in the format of a comma separated string of team ID's.
- 3rd argument -  the input name that will be used to detect when the the sidebar element is on screen and remove teams that the user is not allowed to access.
```
template.setupMTO({{{mto-v3}}}, "{{{team.mto-v3}}}", 'Branch Selection')
```
- Note: `setupMTO()` is required before attempting to use mto data in any way (e.g. by calling a function like `runMTO()` below)

###### Using MTO
You can use the data provided by `setupMTO()` and manipulate the DOM in whichever ways the template requires. There is no standard across all clients for what a template might do with MTO data. Consult squad leads or past templates for possible examples that are relevant to your client/template.
In general, you would define a function in your template and pass {{{mto-v3}}} to it, e.g.

```
let runMTO = (mtoData) => {
    console.log(mtoData)
    //your DOM manipulations
}
runMTO({{{mto-v3}}});
```

Many implementations of a function like `runMTO()` also require a `formatPhoneNumber()` function e.g. 

```
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



