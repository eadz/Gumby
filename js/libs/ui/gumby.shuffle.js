/**
* Gumby Shuffle
*/
!function() {

	'use strict';

	function Shuffle($el) {

		this.$el = $el;

		this.children = $.makeArray(this.$el.children('.columns,.column'));
		this.shuffles = this.parseAttrValue(Gumby.selectAttr.apply(this.$el, ['shuffle']));

		var scope = this;

		this.handleTests();
		$(window).on('resize', function() {
			scope.handleTests();
		});
	}

	Shuffle.prototype.handleTests = function() {

	};

	Shuffle.prototype.parseAttrValue = function(str) {
		var supp = str.split(','),
			res = [], splt = [];

		// multiple can be supplied so loop round and create object 
		$(supp).each(function(key, val) {
			splt = val.split('|');
			if(splt.length !== 2) {
				return true;
			}

			// object containing Modernizr test or media query and image url
			res.push({
				'test' : splt[0],
				'sequence' : splt[1]
			});
		});

		return res;
	};

	// add initialisation
	Gumby.addInitalisation('shuffle', function() {
		$('[data-shuffle],[gumby-shuffle],[shuffle]').each(function() {
			var $this = $(this);
			// this element has already been initialized
			if($this.data('isShuffle')) {
				return true;
			}
			// mark element as initialized
			$this.data('isShuffle', true);
			new Shuffle($this);
		});
	});

	// register UI module
	Gumby.UIModule({
		module: 'shuffle',
		events: [],
		init: function() {
			Gumby.initialize('shuffle');
		}
	});
}();
