/**
* Gumby Images
*/
!function() {

	'use strict';

	function Images($el) {

		this.$el = $el;
		this.supports = Gumby.selectAttr.apply(this.$el, ['supports']) || false;
		this.media = Gumby.selectAttr.apply(this.$el, ['media']) || false;

		console.log($('html').attr('class'));

		if(this.supports) {
			this.supports = this.parseSupport(this.supports);
			this.handleSupports(this.supports);
		}
	}

	Images.prototype.handleSupports = function() {
		var scope = this;
		$(this.supports).each(function(key, val) {
			if(scope.checkSupport(val.test)) {
				scope.$el.after("You do support "+val.test+"!");
				return false;
			} else {
				scope.$el.after("You don't support "+val.test+"!");
				return true;	
			}
		});
	};

	Images.prototype.checkSupport = function(test) {
		console.log(test, Modernizr[test]);
		return !!Modernizr[test];
	};

	Images.prototype.parseSupport = function(support) {
		var supp = support.split(','),
			res = [], splt = [];

		$(supp).each(function(key, val) {
			splt = val.split(':');
			if(splt.length !== 2) {
				return true;
			}

			res.push({
				'test' : splt[0],
				'file' : splt[1]
			});
		});

		return res;
	};

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
			new Images($this);
		});
	});

	// register UI module
	Gumby.UIModule({
		module: 'images',
		events: [],
		init: function() {
			Gumby.initialize('images');
		}
	});
}();
