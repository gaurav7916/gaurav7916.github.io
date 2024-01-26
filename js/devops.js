const tweenTimeLineDevOps = new TimelineLite();

const nodeScrollPathDesktop = {
	curviness: 0.5,
	autoRotate: true,
	values: [
		{
			x: 10 * widthPercent,
			y: 10 * heightPercent,
			scaleX: 1.3,
			scaleY: 1.3,
			opacity: 1,
		},
		{
			x: 80 * widthPercent,
			y: -10 * heightPercent,
			scaleX: 0.8,
			scaleY: 0.8,
			opacity: 1,
		},
		{
			x: 60 * widthPercent,
			y: -60 * heightPercent,
			scaleX: 0.7,
			scaleY: 0.7,
			opacity: 1,
		},
		{
			x: 40 * widthPercent,
			y: -40 * heightPercent,
			scaleX: 0.5,
			scaleY: 0.5,
			opacity: 1,
		},
		{
			x: 52 * widthPercent,
			y: -24 * heightPercent,
			scaleX: 0.3,
			scaleY: 0.3,
			opacity: 0,
		},
	],
};

const pythonScrollPathDesktop = {
	curviness: 0.5,
	autoRotate: false,
	values: [
		{
			x: -10 * widthPercent,
			y: 10 * heightPercent,
			scaleX: 1.3,
			scaleY: 1.3,
			opacity: 1,
		},
		{
			x: -80 * widthPercent,
			y: -10 * heightPercent,
			scaleX: 0.8,
			scaleY: 0.8,
			opacity: 1,
		},
		{
			x: -60 * widthPercent,
			y: -60 * heightPercent,
			scaleX: 0.7,
			scaleY: 0.7,
			opacity: 1,
		},
		{
			x: -40 * widthPercent,
			y: -40 * heightPercent,
			scaleX: 0.5,
			scaleY: 0.5,
			opacity: 1,
		},
		{
			x: -52 * widthPercent,
			y: -24 * heightPercent,
			scaleX: 0.3,
			scaleY: 0.3,
			opacity: 0,
		},
	],
};

tweenTimeLineDevOps.add(
	TweenLite.to('#server-node', 3, {
		bezier: nodeScrollPathDesktop,
		ease: Power0.easeNone,
	}),
	0
);

tweenTimeLineDevOps.add(
	TweenLite.to('#server-python', 3, {
		bezier: pythonScrollPathDesktop,
		ease: Power0.easeNone,
	}),
	0
);

const controllerDevOps = new ScrollMagic.Controller();

const sceneDevOps = new ScrollMagic.Scene({
	triggerElement: '.devops',
	duration: 1000,
	triggerHook: '0',
})
	.setTween(tweenTimeLineDevOps)
	.setPin('.devops')
	.addTo(controllerDevOps);
