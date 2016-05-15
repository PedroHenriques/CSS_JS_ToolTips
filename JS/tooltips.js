/************************************************************
*															*
* CSS & JS ToolTips v1.0.0									*
*															*
* Copyright 2016, PedroHenriques 							*
* http://www.pedrojhenriques.com 							*
* https://github.com/PedroHenriques 						*
*															*
* Free to use under the MIT license.			 			*
* http://www.opensource.org/licenses/mit-license.php 		*
*															*
************************************************************/

// this function will add the event listeners to all the tooltips on the page
function addTooltipEventListeners() {
	// grab a reference to all the tooltip elements on the page
	var elems = document.querySelectorAll(".tooltip");

	// variable used in the loop when creating the arrow element
	var arrow_elem = null;

	// loop through each of the tooltip elements and add the event listener
	for (var i = 0; i < elems.length; i++) {
		if (elems[i].addEventListener) {
			elems[i].addEventListener("mouseover", function(e) {showTooltip(e);}, false);
			elems[i].addEventListener("mouseout", function(e) {hideTooltip(e);}, false);
		}else if (elems[i].attachEvent){
			elems[i].attachEvent("onmouseover", function(e) {showTooltip(e);});
			elems[i].attachEvent("onmouseout", function(e) {hideTooltip(e);});
		}

		// if this tooltip will be using an arrow, create the arrow element
		if (elems[i].classList.contains("with_arrow")) {
			// create the arrow HTML element
			arrow_elem = document.createElement("span");
			arrow_elem.className = "tooltip_arrow";

			// add the arrow_elem to the tooltip wrapper
			elems[i].appendChild(arrow_elem);
		}
	};
}

// this function will be called when one of the event listeners added above is triggered
// and will make any adjustments needed to the position and dimension of the tooltip, in order
// to guarantee it fits on the viewport without overflowing
function showTooltip(e) {
	// sanity check
	if (e == null) {
		return;
	}

	// grab the viewport's width and height
	var window_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	var window_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

	// grab a reference to the tooltip wrapper element and it's enclosing rectangle
	var src_elem = e.srcElement || e.target;
	var src_rect = src_elem.getBoundingClientRect();

	// find and grab a reference to the child element with the tooltip text and arrow
	var tt_text = null;
	var arrow_elem = null;
	for (var i = 0; i < e.target.children.length; i++) {
		var child_classes = e.target.children[i].classList;

		if (child_classes.contains("tooltip_text")) {
			// found the tooltip text element
			tt_text = e.target.children[i];
		}

		if (child_classes.contains("tooltip_arrow")) {
			// found the tooltip text element
			arrow_elem = e.target.children[i];
		}

		// if we've found all the necessary elements exit the loop
		if (tt_text != null && arrow_elem != null) {
			break;
		}
	};
	// sanity check
	if (tt_text == null) {
		return;
	}

	// grab the root font size
	var root_elem = document.querySelector(":root");
	var root_elem_styles = root_elem.currentStyle || window.getComputedStyle(root_elem);
	var root_font_size = parseFloat(root_elem_styles.fontSize);

	// variables used to control the position of the tooltip around the tooltip wrapper element
	var offset_x = 0; // default horizontally offset
	var offset_y = 0.5 * root_font_size; // default vertical offset is 0.5rem

	// check if we want to add an arrow to this tooltip
	var use_arrow = false; // by default, don't use the arrow
	if (src_elem.classList.contains("with_arrow")) {
		// sanity check
		if (arrow_elem == null) {
			return;
		}

		// yes, we want the arrow
		use_arrow = true;

		// adjust the offset_y to compensate for the arrow
		offset_y += 0.5 * root_font_size;
	}

	// grab all the current styles being applied to the tooltip text
	var tt_text_styles = tt_text.currentStyle || window.getComputedStyle(tt_text);

	// grab the required width for the tooltip
	var tt_text_raw_width = getTooltipRawWidth(tt_text, tt_text_styles);

	// calculate the minimum width allowed for the tooltip
	if (tt_text_styles.minWidth != "none" && parseInt(tt_text_styles.minWidth) != 0) {
		// if a CSS minimum width is set use it, unless it's greater than the viewport's width
		// in which case use the viewport's width
		var tt_min_width = Math.min(parseInt(tt_text_styles.minWidth), window_width);
	}else{
		// if no CSS minimum width is set, default to zero
		var tt_min_width = 0;
	}

	// calculate the maximum width allowed for the tooltip
	if (tt_text_styles.maxWidth != "none" && parseInt(tt_text_styles.maxWidth) != 0) {
		// if a CSS maximum width is set use it, unless it's greater than the viewport's width
		// in which case use the viewport's width
		var tt_max_width = Math.min(parseInt(tt_text_styles.maxWidth), window_width);
	}else{
		// if no CSS maximum width is set, default to the viewport's width
		var tt_max_width = window_width;
	}

	// determine the default minimum and maximum X positions for the tooltip
	var min_x = Math.max(src_rect.left + offset_x, 0);
	var max_x = Math.min(min_x + tt_max_width, window_width);

	// variable to know if we'v found a configuration where the tooltip fits the viewport without overflowing
	var done = false;

	// calculate the tooltip's configuration that fits the viewport without overflowing
	// loop untill we find a valid configuration or we reach a font size for the tooltip's
	// text of 1px, at which point we conclude that it isn't possible to fit the viewport
	while (!done && parseFloat(tt_text_styles.fontSize) > 1) {
		// by default we'll assume this iteration will find a configuration that fit the viewport
		done = true;

		// calculate the required width for the tooltip, given it's current applied styles
		var tt_req_width = Math.max(tt_min_width, Math.min(tt_max_width, tt_text_raw_width + parseInt(tt_text_styles.paddingLeft) + parseInt(tt_text_styles.paddingRight) + parseInt(tt_text_styles.marginLeft) + parseInt(tt_text_styles.marginRight) + parseInt(tt_text_styles.borderLeftWidth) + parseInt(tt_text_styles.borderRightWidth)));

		// check if the tooltip fits horizontally, given the min_x and max_x
		if (min_x + tt_req_width > max_x) {
			// it doesn't fit
			// check if it will fit if we shift the tooltip left, i.e., ending on the parent element's E edge
			if (src_rect.right - offset_x - tt_req_width >= 0) {
				// it fits if we shift the tooltip left

				// update min_x and max_x
				min_x = src_rect.right - offset_x - tt_req_width;
				max_x = min_x + tt_req_width;
			}else{
				// it doesn't fit if we shift the tooltip left
				// at this point, we'll be using the entire width of the viewport

				// update min_x and max_x
				min_x = 0;
				max_x = window_width;
			}
		}

		// move the tooltip into position
		tt_text.style.left = min_x + "px";

		// calculate the required height for the tooltip, given it's current applied styles
		var tt_req_height = parseInt(tt_text_styles.height) + parseInt(tt_text_styles.paddingTop) + parseInt(tt_text_styles.paddingBottom) + parseInt(tt_text_styles.marginTop) + parseInt(tt_text_styles.marginBottom) + parseInt(tt_text_styles.borderTopWidth) + parseInt(tt_text_styles.borderBottomWidth);

		// check if the tooltip fits in the viewport vertically in the default position
		if (src_rect.bottom + offset_y + tt_req_height > window_height) {
			// it doesn't fit
			// check if it will fit if we shift the tooltip up, i.e., ending on the parent element's N edge
			if (src_rect.top - offset_y - tt_req_height >= 0) {
				// move the tooltip into position
				tt_text.style.top = (src_rect.top - offset_y - tt_req_height) + "px";
			}else{
				// it doesn't fit if we shift the tooltip up
				done = false;

				// if we aren't using the entire viewport's width, do so
				if (min_x > 0 || max_x < window_width) {
					// update min_x and max_x
					min_x = 0;
					max_x = window_width;
				}else{
					// at this point we're using the entire viewport's width, so start reducing the font size
					// untill we find a configuration that fits without overflowing or font size reaches 1px
					tt_text.style.fontSize = (parseFloat(tt_text_styles.fontSize) - 1) + "px";

					// grab the new required width, given the new font size
					tt_text_raw_width = getTooltipRawWidth(tt_text, tt_text_styles);
				}
			}
		}else{
			// it fits
			// move the tooltip into position
			tt_text.style.top = (src_rect.bottom + offset_y) + "px";
		}
	}

	// if we're using the arrow, move it into position
	if (use_arrow) {
		// position the arrow horizontally
		// start by positioning the arrow in the middle of the parent element
		var arrow_x = (src_rect.left + src_rect.right) / 2;

		// if the tooltip ends before the arrow's position, move the arrow to the
		// middle of the tooltip
		if (parseFloat(tt_text.style.left) + tt_req_width <= arrow_x + root_font_size) {
			arrow_x = (2 * parseFloat(tt_text.style.left)  + tt_req_width) / 2 - 0.5 * root_font_size;
		}

		// commit the horizontal position
		arrow_elem.style.left = arrow_x + "px";

		// position the arrow vertically -> depends if we shifted the tooltip up or not
		if (parseFloat(tt_text.style.top) > src_rect.top) {
			// the tooltip is below the parent element

			// give the arrow's border the same color as the tooltip_text's border-top-color
			arrow_elem.style.borderTopColor = tt_text_styles.borderTopColor;

			// add the class that rotates 180deg the arrow
			arrow_elem.classList.add("tooltip_arrow_rotate");

			// move the arrow into position
			arrow_elem.style.top = (parseFloat(tt_text.style.top) - root_font_size) + "px";
		}else{
			// the tooltip is above the parent element

			// give the arrow's border the same color as the tooltip_text's border-Bottom-color
			arrow_elem.style.borderTopColor = tt_text_styles.borderBottomColor;

			// move the arrow into position
			arrow_elem.style.top = (src_rect.top - offset_y) + "px";
		}
	}
}

// reset a tooltip to it's default configuration, removing any changes made in
// previous display of this tooltip
function hideTooltip(e) {
	// sanity check
	if (e == null) {
		return;
	}

	// find and grab a reference to the child span element with the tooltip text
	var tt_text = null;
	var arrow_elem = null;
	for (var i = 0; i < e.target.children.length; i++) {
		var child_classes = e.target.children[i].classList;

		if (child_classes.contains("tooltip_text")) {
			// found the tooltip text element
			tt_text = e.target.children[i];
		}

		if (child_classes.contains("tooltip_arrow")) {
			// found the tooltip text element
			arrow_elem = e.target.children[i];
		}

		// if we've found all the necessary elements exit the loop
		if (tt_text != null && arrow_elem != null) {
			break;
		}
	};
	// sanity check
	if (tt_text == null) {
		return;
	}

	// reset the tooltip to it's default configuration
	tt_text.style.left = "";
	tt_text.style.top = "";
	tt_text.style.fontSize = "";

	// reset the arrow to it's default configuration, if it exists
	if (arrow_elem != null) {
		arrow_elem.style.left = "";
		arrow_elem.style.top = "";
		arrow_elem.style.borderTopColor = "";
		arrow_elem.classList.remove("tooltip_arrow_rotate");
	}
}

// this function will calculate the required width for the tooltip, using only the line breaks
// present on the raw string
function getTooltipRawWidth(tt_text, tt_text_styles) {
	// temporarily set the tooltip text element to width:auto and height:auto
	// so we can get the required width and height for the text as is
	var tt_text_classes = tt_text.classList;
	tt_text_classes.add("tooltip_auto_size");

	// store the width under this configuration
	var result = parseFloat(tt_text_styles.width);

	// now that we've got the sizes, remove the helper class
	tt_text_classes.remove("tooltip_auto_size");

	return(result);
}
