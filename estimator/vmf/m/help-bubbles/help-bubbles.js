/* This jquery plugin consists of:
   1) close link
   2) overlay - highlights target
   3) paginator - paginates through target_list, shows help bubble above or below
   
   @param options = {
		target_list: [
			['target_selector1', {
				isAbove: true, // optional - help bubble above target, otherwise below
				parentClass: 'my_class1', // optional - for custom styling
				title: 'title1',
				copy: 'copy text1'
			}]
			// ...
		]
   }
   @return  (jQuery) paginator for chaining
*/
$.fn.help_bubbles_paginator = function(options) {
	var o = this.o = {};
	var gutter = 20;

	$.extend(o, {
		$paginator: this,
		$overlay: $('#help_bubbles_overlay'),
		$close_link: $('a#close_help_bubbles'),
		$bubbles : []
	}, options) // extend

	// defaulting
	o.$paginator.length || (
		o.$paginator = $('<div id="help_bubbles_paginator"/>').appendTo(
			document.body
		)
	)
	o.$overlay.length || (
		o.$overlay = $('<div id="help_bubbles_overlay"/>').appendTo(
			document.body
		).append(
			$.map(['top', 'left', 'right', 'bottom'], function(v) {
				return $('<div/>').addClass(v)
			})
		)
	)
	o.$close_link.length || (
		o.$close_link = $('<a id="close_help_bubbles" href="javascript:">&nbsp;</a>').appendTo(
			document.body
		)
	)
	// showing
	o.$overlay.one('click.help_bubbles', close).fadeIn()
	o.$close_link.one('click.help_bubbles', close).fadeIn()

	function close(){
		removeCurrentBubble();

		$(window).off('.help_bubbles');

		o.$close_link.off().fadeOut()
		o.$overlay.off().fadeOut()
		o.$paginator.empty().off().fadeOut()
	}

	function removeCurrentBubble() {
		if(o.component)
			$(o.component[0]).removeClass("target_selected");
	
		for(var i=0; i< o.$bubbles.length; i++) {
			o.$bubbles[i].remove();
		}
		o.$bubbles = [];
	}

	function resizeHandler() {
		// highlighting target
		var $target = $(o.component[0]),
			offset = $target.offset(),
			width = $target.outerWidth(),
			height = $target.outerHeight();
		o.$overlay // by using four overlays
		.find('.top').css('height', offset.top).end()
			.find('.left').css({
				top: offset.top,
				width: offset.left,
				height: height
			}).end()
			.find('.right').css({
				top: offset.top,
				left: offset.left + width,
				height: height
			}).end()
			.find('.bottom').css('top', offset.top + height).end()


		for(var i=0; i< o.component[1].length; i++) {
			var comment = o.component[1][i],
				$el = $target.find(comment.el),
				left = $target.offset().left + gutter,
				top = $target.offset().top - o.$bubbles[i].outerHeight();


			if( $el.length ) {
				//align to the center of $el
				left = $el.offset().left + ( $el.outerWidth() / 2 );
			}

			if(!comment.isAbove) {
				console.log(comment.isAbove + " - " + comment.title + " - " + $target.offset().top,  $target.outerHeight())
				top = $target.offset().top + $target.outerHeight();
			}

			o.$bubbles[i].css({left: left, top: top});
		}

	}

	function onClickPaginatorCircle() {
		if($(this).hasClass('selected')) return;
		
		removeCurrentBubble();

		// getting selected component
		o.component = o.target_list[
			o.selected_index = $(this)
			.siblings('.circle').removeClass('selected')
			.addBack().index(this)
		]
		var	$target = $( o.component[0] ),
			arrBubbles = [];

		//Add Bubbles
		for(var i=0; i< o.component[1].length; i++) {
			var comment = o.component[1][i],
				$el = $target.find(comment.el),
				$title = $('<h1/>').html(comment.title),
				$copy = $('<p/>').html(comment.copy),
				$line_indicator = $('<div class="line-indicator"/>').append('<div/>'),

				$bubble = $('<div class="help_bubble"/>')
								.addClass( comment.parentClass )
								.append(
									comment.isAbove ? [									//TO refactor
										$title, $copy, $line_indicator
									] : [
										$line_indicator, $title, $copy
									]
								)
								.appendTo ( document.body );

			o.$bubbles.push( $bubble );

			$target.addClass("target_selected");
		}

		/*

for(var i=0; i< o.component[1].length; i++) {
			var comment = o.component[1][i],
				$innerEl = $target.find(comment.target),
				targetPosition = $innerEl.offset(),
				parentX = $target.offset().left,
				x = 0,
				y = 0;

			if(targetPosition) {
				x = $innerEl.offset().left - parentX + ( $innerEl.outerWidth() / 2 ); 
			}


			var _el = $('<div class="help_bubble"><div class="line-indicator" style="position:absolute"><div></div></div></div>').appendTo( "body" ),
				_css = { "left":x };

			if(comment.isAbove) {
				_css["bottom"] = y;
			} else {
				_css["top"] = y;
			}
			_el.css( _css );

		}
		*/

		o.$paginator.triggerHandler('resize') // highlighting target

		// enabling/disabling arrows
		$('a.right.arrow', o.$paginator)[
			o.selected_index === o.target_list.length - 1 ?
			'addClass' : 'removeClass'
		]('disabled')

		$('a.left.arrow', o.$paginator)[
			o.selected_index === 0 ?
			'addClass' : 'removeClass'
		]('disabled')

		$(this).addClass('selected')
	} // onClickPaginatorCircle

	$(window).on('resize.help_bubbles', function() { // window resize
		o.$paginator.triggerHandler('resize')
	})

	return o.$paginator
		.on('click.help_bubbles', 'a.circle', onClickPaginatorCircle)
		.on('resize.help_bubbles', resizeHandler)
		.append(
			$('<a class="left arrow" href="javascript:void(0)"/>').text(' ').click(function() {
				$('.circle.selected', o.$paginator).prev('.circle').click()
			}),
			$.map(o.target_list, function(v, i) {
				return $('<a class="circle" href="javascript:void(0)"/>').text(' ');
			}),
			$('<a class="right arrow" href="javascript:void(0)"/>').text(' ').click(function() {
				$('.circle.selected', o.$paginator).next('.circle').click()
			})
		).fadeIn().find('a.circle').eq(0).click().end().end()
} // $.fn.help_bubbles_paginator

