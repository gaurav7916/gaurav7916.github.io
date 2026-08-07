(function () {
	var registry = [];
	var rebuilding = false;
	var lastWidth = window.innerWidth;
	var resizeTimer = null;

	var HXRebuild = {
		/* index.js checks this flag: while the rebuild path is live, the
		   "Window Resized — open on Desktop" reload prompt is redundant. */
		enabled: true,

		register: function (name, rebuild) {
			registry.push({ name: name, rebuild: rebuild });
		},

		/* GSAP writes its tween output as an inline transform. Clearing it
		   returns the element to the base state its stylesheet describes, so a
		   rebuilt tween starts from the same place it would on a fresh load. */
		clear: function (selector, props) {
			if (window.TweenLite) {
				TweenLite.set(selector, { clearProps: props || 'transform,opacity' });
			}
		},

		run: function () {
			if (rebuilding) return;
			rebuilding = true;

			var scrollY = window.pageYOffset;

			/* These are the `let` globals declared in js/index.js — every
			   registered path recomputes off them. */
			widthPercent = window.innerWidth / 100;
			heightPercent = window.innerHeight / 100;

			for (var i = 0; i < registry.length; i++) {
				try {
					registry[i].rebuild();
				} catch (err) {
					// one broken module must not take the rest of the page down
					console.warn('[responsive-rebuild] "' + registry[i].name + '" failed', err);
				}
			}

			/* Pin spacers are recreated during the rebuild, so restore the
			   reading position on the next frame, once layout has settled. */
			window.requestAnimationFrame(function () {
				window.scrollTo(0, scrollY);
				rebuilding = false;
			});
		},
	};

	window.HXRebuild = HXRebuild;

	window.addEventListener('resize', function () {
		if (window.innerWidth === lastWidth) return; // URL bar / height-only
		lastWidth = window.innerWidth;
		window.clearTimeout(resizeTimer);
		resizeTimer = window.setTimeout(HXRebuild.run, 250);
	});
})();
