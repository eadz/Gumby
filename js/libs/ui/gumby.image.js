/**
* Gumby Images
*/
!function() {

	'use strict';

	function Image($el) {

		this.$el = $el;
		var scope = this;

		this.$el.after("OH YEAH!");

	}

	// add initialisation
	Gumby.addInitalisation('images', function() {
		$('img[gumby-supports],img[data-supports],img[supports],img[gumby-media],img[data-media],img[media]').each(function() {
			var $this = $(this);
			// this element has already been initialized
			if($this.data('isImage')) {
				return true;
			}
			// mark element as initialized
			$this.data('isImage', true);
			new Image($this);
		});
	});

	// register UI module
	Gumby.UIModule({
		module: 'image',
		events: [],
		init: function() {
			Gumby.initialize('images');
		}
	});
}();
