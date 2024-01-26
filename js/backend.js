const tweenTimeLineBackend = new TimelineLite();

const boatScrollPathDesktop = {
	curviness: 1.0,
	autoRotate: true,
	values: [
		{ x: 10 * widthPercent, y: 1 * heightPercent },
		{ x: 20 * widthPercent, y: 2 * heightPercent },
		{ x: 40 * widthPercent, y: 4 * heightPercent },
		{ x: 50 * widthPercent, y: 2 * heightPercent },
		{ x: 55 * widthPercent, y: 1.5 * heightPercent },
		{ x: 60 * widthPercent, y: 0 * heightPercent },
		{ x: 70 * widthPercent, y: 0 * heightPercent },
		{ x: 75 * widthPercent, y: 0.5 * heightPercent },
		{ x: 80 * widthPercent, y: 1 * heightPercent },
		{ x: 85 * widthPercent, y: 2 * heightPercent },
		{ x: 90 * widthPercent, y: 1.75 * heightPercent },
		{ x: 100 * widthPercent, y: 0 * heightPercent },
		{ x: 110 * widthPercent, y: 1 * heightPercent },
		{ x: 125 * widthPercent, y: 1.5 * heightPercent },
		{ x: 130 * widthPercent, y: 1.5 * heightPercent },
	],
};

tweenTimeLineBackend.add(
	TweenLite.to('#boat-node', 3, {
		bezier: boatScrollPathDesktop,
		ease: Power0.easeNone,
	}),
	0
);

tweenTimeLineBackend.add(
	TweenLite.to('#boat-python', 3, {
		bezier: boatScrollPathDesktop,
		ease: Power0.easeNone,
	}),
	1
);

tweenTimeLineBackend.add(
	TweenLite.to('#boat-nosql', 3, {
		bezier: boatScrollPathDesktop,
		ease: Power0.easeNone,
	}),
	2
);

tweenTimeLineBackend.add(
	TweenLite.to('#boat-sql', 3, {
		bezier: boatScrollPathDesktop,
		ease: Power0.easeNone,
	}),
	3
);

const controllerBackend = new ScrollMagic.Controller();

const sceneBackend = new ScrollMagic.Scene({
	triggerElement: '.backend',
	duration: 1000,
	triggerHook: '0',
})
	.setTween(tweenTimeLineBackend)
	.setPin('.backend')
	.addTo(controllerBackend);
