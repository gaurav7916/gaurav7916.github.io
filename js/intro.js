// const flightPathMobile = {
// 	curviness: 0.5,
// 	autoRotate: true,
// 	values: [
// 		{ x: 0 * widthPercent, y: 0 * heightPercent, scaleX: 4, scaleY: 4 },
// 		{ x: 80 * widthPercent, y: -30 * heightPercent, scaleX: 3.5, scaleY: 3.5 },
// 		{ x: 90 * widthPercent, y: -70 * heightPercent, scaleX: 3, scaleY: 3 },
// 		{ x: 40 * widthPercent, y: -80 * heightPercent, scaleX: 2.5, scaleY: 2.5 },
// 		{ x: 10 * widthPercent, y: -70 * heightPercent, scaleX: 2.5, scaleY: 2.5 },
// 		{ x: 20 * widthPercent, y: -30 * heightPercent, scaleX: 2, scaleY: 2 },
// 		{ x: 70 * widthPercent, y: -30 * heightPercent, scaleX: 1.2, scaleY: 1.2 },
// 	],
// };

const flightPathDesktopGsap = {
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

const samuraiPathDesktopScroll = {
	curviness: 1,
	autoRotate: false,
	values: [{ x: -400 }],
};

const flightPathDesktopScroll = {
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

	const tweenTimeLine = new TimelineLite();

	tweenTimeLine.add(
		TweenLite.to('.img-samurai-scroll', 2, {
			bezier: samuraiPathDesktopScroll,
			ease: Power1.easeOut,
		})
	);
	tweenTimeLine.add(
		TweenLite.to('.img-plane-scroll', 1, {
			bezier: flightPathDesktopScroll,
			ease: Power1.easeIn,
		}),
		0
	);
	const controller = new ScrollMagic.Controller();

	const scene = new ScrollMagic.Scene({
		triggerElement: 'header',
		duration: 1000,
		triggerHook: '0',
	})
		.setTween(tweenTimeLine)
		// .addIndicators()
		.addTo(controller);
};

// addIntroAnimations();

// window.onload clustered here
window.onload = (event) => {
	// after 1 sec
	setTimeout(() => {
		addIntroAnimations();
	}, 1000);
};
