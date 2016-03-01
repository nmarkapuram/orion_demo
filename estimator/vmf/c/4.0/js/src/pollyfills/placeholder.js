/**
 * Jquery placeholder Plugin
 * =======================
 * This plugin is used to show default text in text boxes when they are empty
 * You can use it to show placeholder text in Password (input type="password") fields also.
 * It keeps the default text even when the textbox is focused so that users don't need to blur out the box to  see the default text again.
 **/


(function($) {
 
	$.fn.placeholder = function() {
		// actual input object (it directly comes as jquery object)
		var inputObj = this,
			placeholderText = $(this).attr('placeholder'),
			wrappedDivObj,
			placeholderHolderSpan,
			erroImageObj,
			timeOut = 100; //($.browser.safari) ? 5 : 200; // decreasing the timeout as the safari browser has some issue (white blank space coming)


		if(!placeholderText) return;

		// wrap the input field with a div
		inputObj.wrap('<div class="placeholder-box" />');
		
		wrappedDivObj = inputObj.parent();
		
		// create a span element (which holds the placeholderText)
		wrappedDivObj.prepend('<span class="placeholder-holder" id="'+ inputObj[0].id +'_placeholder_text" />');
		placeholderHolderSpan = wrappedDivObj.children('.placeholder-holder').html( placeholderText );
		
		// onclicking the span (placeholder-text holder), take the focus to input element
		placeholderHolderSpan.click(function() {
			inputObj.focus();
		});

		// on focus and blur of input field, changing class of wrappedDiv
		inputObj.focus(function(){
			wrappedDivObj.addClass('selected');
		}).blur(function(){
			wrappedDivObj.removeClass('selected');
		});

		// handler function which has to be executed when keydown, focus, blur, change events occur over the input field..
		var handler = function() {
			setTimeout(function() {
				if( $.trim(inputObj.val()) == "") {
					placeholderHolderSpan.fadeIn();
				} else {
					placeholderHolderSpan.hide();
				}
			}, timeOut);
		};

		// attach the handler function for diff events of input field
		inputObj.keydown(handler).focus(handler).blur(handler).change(handler);

		// when the plugin is integrated for the first time and if value exists in the input element, then hide the placeholderHolderSpan
		if(inputObj.val() != "") placeholderHolderSpan.hide();
	
	};

})(jQuery);