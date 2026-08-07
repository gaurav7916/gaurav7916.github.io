let flightPathDesktopGsap;
let samuraiPathDesktopScroll;
let flightPathDesktopScroll;

const computeIntroPaths = () => {
	flightPathDesktopGsap = {
		curviness: 0.5,
		autoRotate: true,
		values: [
			{ x: 0 * widthPercent, y: 0 * heightPercent, scaleX: 4, scaleY: 4 },
			{ x: 80 * widthPercent, y: -30 * heightPercent, scaleX: 3.5, scaleY: 3.5 },
			{ x: 90 * widthPercent, y: -70 * heightPercent, scaleX: 3, scaleY: 3 },
			{ x: 40 * widthPercent, y: -70 * heightPercent, scaleX: 2.5, scaleY: 2.5 },
			{ x: 40 * widthPercent, y: -40 * heightPercent, scaleX: 2, scaleY: 2 },
			{ x: 55 * widthPercent, y: -30 * heightPercent, scaleX: 1.5, scaleY: 1.5 },
			{ x: 70 * widthPercent, y: -40 * heightPercent, scaleX: 1.2, scaleY: 1.2 },
			{ x: 80 * widthPercent, y: -47 * heightPercent, scaleX: 1, scaleY: 1 },
		],
	};

	samuraiPathDesktopScroll = {
		curviness: 1,
		autoRotate: false,
		values: [{ x: -400 }],
	};

	flightPathDesktopScroll = {
		curviness: 0,
		autoRotate: false,
		values: [
			{
				x: 150 * widthPercent,
				y: -40 * heightPercent,
				scaleX: 0,
				scaleY: 0,
			},
		],
	};
};

computeIntroPaths();

/* MOBILE SUPPORT — ADDED
   The scroll-driven half of the intro, split out of addIntroAnimations() so it
   can be rebuilt on resize. The one-shot half (loader removal, the samurai/plane
   hand-off, the flight) must never re-run, so it stays where it was. */
let introTweenTimeLine;
let introController;
let introScene;

const buildIntroScrollScene = (isRebuild) => {
	/* MOBILE SUPPORT — ADDED — rewind and replace the timeline, keep the scene. */
	const previousIntro = introTweenTimeLine;
	if (introScene && previousIntro) {
		introScene.removeTween(true);
		previousIntro.kill();
	}

	/* MOBILE SUPPORT — ADDED
	   Re-establish the start state for the new viewport BEFORE the replacement
	   timeline records it. The samurai has a CSS start (translateX(20vw)) so
	   clearing the inline transform is enough. The plane does not: it sits
	   wherever the intro flight left it, as an inline px transform, so re-apply
	   that flight's final waypoint (80vw / -47vh, scale 1) recomputed for the new
	   viewport. Rebuild-only — on first run the hand-off in addIntroAnimations
	   has just set this. */
	if (isRebuild) {
		if (window.HXRebuild) {
			window.HXRebuild.clear('.img-samurai-scroll', 'transform');
		}
		TweenLite.set('.img-plane-scroll', {
			x: 80 * widthPercent,
			y: -47 * heightPercent,
			scaleX: 1,
			scaleY: 1,
		});
	}

	introTweenTimeLine = new TimelineLite();

	introTweenTimeLine.add(
		TweenLite.to('.img-samurai-scroll', 2, {
			bezier: samuraiPathDesktopScroll,
			ease: Power1.easeOut,
		})
	);
	introTweenTimeLine.add(
		TweenLite.to('.img-plane-scroll', 1, {
			bezier: flightPathDesktopScroll,
			ease: Power1.easeIn,
		}),
		0
	);
	/* MOBILE SUPPORT — ADDED */
	if (introScene) {
		introScene.setTween(introTweenTimeLine);
		introScene.refresh();
		return;
	}

	introController = new ScrollMagic.Controller();

	introScene = new ScrollMagic.Scene({
		triggerElement: 'header',
		duration: 1000,
		triggerHook: '0',
	})
		.setTween(introTweenTimeLine)
		// .addIndicators()
		.addTo(introController);
};

const addIntroAnimations = () => {
	// remove loader
	let loadingPage = document.getElementById('loading-page');
	loadingPage.parentElement.removeChild(loadingPage);

	// Intro Animation
	let introElem = document.getElementById('intro');
	introElem.classList.add('animate-intro');

	// Samurai animation
	let imgSamurai = document.getElementById('img-samurai-animate');
	imgSamurai.classList.add('animate-samurai');
	setTimeout(() => {
		// if (!isPhone()) {
		let imgSamuraiAnimate = document.getElementById('img-samurai-animate');
		imgSamuraiAnimate.parentElement.removeChild(imgSamuraiAnimate);
		let imgSamuraiScroll = document.getElementById('img-samurai-scroll');
		imgSamuraiScroll.style.display = 'block';
		// }
	}, 2000);

	// PaperPlane Animation
	// isPhone()
	// ? TweenLite.to('#img-plane-animate', 2, {
	// 		bezier: flightPathMobile,
	// 		ease: Power1.easeOut,
	//   }):
	TweenLite.to('#img-plane-animate', 2, {
		bezier: flightPathDesktopGsap,
		ease: Power1.easeOut,
	});

	setTimeout(() => {
		let imgPlaneAnimate = document.getElementById('img-plane-animate');
		let imgPlaneScroll = document.getElementById('img-plane-scroll');
		imgPlaneScroll.style.transform = imgPlaneAnimate.style.transform;
		imgPlaneAnimate.parentElement.removeChild(imgPlaneAnimate);
		imgPlaneScroll.style.display = 'block';
	}, 2000);

	buildIntroScrollScene(); /* MOBILE SUPPORT — ADDED (was inline here) */
};

/* MOBILE SUPPORT — ADDED */
if (window.HXRebuild) {
	window.HXRebuild.register('intro', () => {
		computeIntroPaths();
		if (!introScene) return; // the intro has not run yet; nothing to rebuild
		buildIntroScrollScene(true);
	});
}

// addIntroAnimations();

// window.onload clustered here
window.onload = (event) => {
	// after 1 sec
	setTimeout(() => {
		addIntroAnimations();
	}, 1000);
};
