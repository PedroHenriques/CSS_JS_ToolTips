# CSS & JS ToolTips - Dynamic and Completely Customizable

An easy to use ToolTip, built in CSS and JS, that will be dynamically positioned and can be fully customizable by you.

The code will show the tooltip when an HTML element is hovered over and will dynamically adjust the tooltip's position and size to make sure it fits the viewport.

You can find a **DEMO** at [www.pedrojhenriques.com/samples/CSS_JS_ToolTips](http://www.pedrojhenriques.com/samples/CSS_JS_ToolTips/).

## Instructions

### Setup

1. Copy the `tooltips.css` and `tooltips.js` files into your project, or their respective minimized versions.
2. Add a link to the CSS file inside the `<head></head>` tags, on the webpages you wish to use the tooltips, using `<link rel='stylesheet' type='text/css' href='path/to/tooltips.css'/>`.
3. Add a link to the JS file and call the starting function before the `</body>` tag, on the webpages you wish to use the tooltips, using `<script type='text/javascript' src='path/to/tooltips.js'></script>
<script>addTooltipEventListeners();</script>`.

### Using the ToolTips

In order to use the tooltips, add the `tooltip` css class to a wrapper html element (NOTE: this HTML element must be able to have inner HTML elements. If need be create a span element for this purpose).

Then create another HTML element, inside the wrapper element, with the `tooltip_text` css class. Inside this element insert the text you want displayed on the tooltip.

As an example, the following code will use the default tooltip:
```
<span class="tooltip">
	<span class="tooltip_text">Tooltip text goes here!</span>
	Hover Me!
</span>
```
On the webpage there will be the text `Hover Me!` that will trigger the tooltip.

If you want to, it's possible to have an arrow pointing to where the tooltip is coming from.  
To display the arrow, add the `with_arrow` css class to the wrapper element.  
As an example:
```
<span class="tooltip with_arrow">
	<span class="tooltip_text">Tooltip text goes here!</span>
	Hover Me!
</span>
```

The arrow's color will be the same as the tooltip_text's border color.

### Customizing the ToolTips

**Changing the tooltip's text style**

These tooltips are completely customizable by you.  
In order to change the style of the tooltip, add to the HTML element with the `tooltip_text` css class your own custom css classes.

As an example, the tooltip
```
<span class="tooltip with_arrow">
	<span class="tooltip_text alt_style">Tooltip text goes here!</span>
	Hover Me!
</span>
```
will use whatever styles are set for the custom `alt_style` css class.

**Using icons as the triggers for the tooltips**

This repository comes with 2 icons and their respective CSS code, which serve as an example of how to set up icons as the tooltip triggers.

Create a CSS class with the `after` pseudo-element and set its `content` css property to the icon's url.

As an example, the information icon that is available with this repository has the following CSS:
```
.tooltip_info:after {
	cursor: help;
	content: url("path/to/info.png");
}
```

And to use it:
```
<span class="tooltip tooltip_info">
	<span class="tooltip_text">Tooltip text goes here!</span>
</span>
```
Note that there is no need to have any text to hover over, since there will be an icon instead.

### Demo

A demo can be found at [www.pedrojhenriques.com/samples/CSS_JS_ToolTips](http://www.pedrojhenriques.com/samples/CSS_JS_ToolTips/).

## Technical Information

### Placement of the ToolTip

By default the tooltip will be placed below the respective wrapper element and aligned with it's west border.  

However, if there isn't enough space on the viewport for the default placement, the code will try moving the tooltip around the wrapper element to check if it fits on the viewport.  
If no position can be found, then the tooltip will try using the entire viewport width, i.e., it will no longer be aligned with the wrapper element's west border.  
If it still doesn't fit the viewport, then the code will start reducing the font size of the tooltip text until it either fits or the font size reaches 1px.
