// Header enhancements — additive only, no existing behaviour is touched.
(function () {
	// Keep the "View Projects" badge in sync with the project list on the page.
	const countBadge = document.querySelector('[data-hx-project-count]');
	const projects = document.querySelectorAll('.project-list li');
	if (countBadge && projects.length) {
		countBadge.textContent = projects.length;
	}

	const prefersReducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;

	const scrollToTarget = (selector) => {
		const target = document.querySelector(selector);
		if (!target) return;
		window.scrollTo({
			top: target.getBoundingClientRect().top + window.pageYOffset,
			behavior: prefersReducedMotion ? 'auto' : 'smooth',
		});
	};

	document.querySelectorAll('[data-hx-scroll]').forEach((el) => {
		el.addEventListener('click', () => {
			scrollToTarget(el.getAttribute('data-hx-scroll'));
		});
	});

	// Fade the scroll cue away once the visitor starts exploring.
	const cue = document.querySelector('.hx-scroll-cue');
	if (cue) {
		window.addEventListener(
			'scroll',
			() => {
				cue.classList.toggle(
					'hx-hidden',
					window.pageYOffset > window.innerHeight * 0.15
				);
			},
			{ passive: true }
		);
	}
})();
