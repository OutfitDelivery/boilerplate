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

`STILL WORKING ON THE BELOW STUFF`
## Included Functionality
### [Main.js](js/main.js)
- setSize()
TO WRITE

### [Main.js](js/main.js)
- setSize()
- setupPlaceholder()
- setOutfitState() | getOutfitState()
- imageCompression()
- pageHeightSetup()
- setupMutationObserver()
- validFontList()

### [Limiters.js](js/limiters.js)
- maxLineCheck()
- maxHeightCheck()
- dynamicAssign()
- charLimit()
`NOTE TO MATT - NEED TO ADD THE NEW wordLimit FUNCTION TO THIS FILE`

### Formatters

###  custom-rich-text

### hide-empty-titles

### qrcode

### textfit

### validate

### dynamic-inject

### dynamic-layout
