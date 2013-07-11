/**
* Gumby Images
*/
!function() {

	'use strict';

	if(!Modernizr) {
		return false;
	}

	function Images($el) {

		this.$el = $el;
		this.supports = Gumby.selectAttr.apply(this.$el, ['supports']) || false;
		this.def = Gumby.selectAttr.apply(this.$el, ['default']) || false;
		this.media = Gumby.selectAttr.apply(this.$el, ['media']) || false;

		if(this.supports) {
			this.supports = this.parseSupport(this.supports);
			this.handleSupports(this.supports);
		}
	}

	Images.prototype.handleSupports = function() {
		var scope = this,
			supported = false;

		$(this.supports).each(function(key, val) {
			if(!!Modernizr[val.test]) {
				scope.insertImage(val.img);
				supported = true;
				return false;
			}
		});

		if(!supported && this.def) {
			this.insertImage(this.def);
		}
	};

	Images.prototype.insertImage = function(img) {
		var scope = this,
			image = $(new Image());

		image.load(function() {
			scope.$el.attr('src', img);
		}).attr('src', img);
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
				'img' : splt[1]
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
