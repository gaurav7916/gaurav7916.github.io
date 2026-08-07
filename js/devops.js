/* MOBILE SUPPORT — ADDED */
let tweenTimeLineDevOps;
let nodeScrollPathDesktop;
let pythonScrollPathDesktop;
let controllerDevOps;
let sceneDevOps;

const computeDevOpsPaths = () => {
	nodeScrollPathDesktop = {
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

	pythonScrollPathDesktop = {
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
};

const buildDevOpsScene = () => {
	/* MOBILE SUPPORT — ADDED — see the note in js/frontend.js: keep the scene and
	   its pin, rewind and replace only the timeline. */
	const previousDevOps = tweenTimeLineDevOps;
	if (sceneDevOps && previousDevOps) {
		sceneDevOps.removeTween(true);
		previousDevOps.kill();
	}

	tweenTimeLineDevOps = new TimelineLite();

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

	/* MOBILE SUPPORT — ADDED */
	if (sceneDevOps) {
		sceneDevOps.setTween(tweenTimeLineDevOps);
		sceneDevOps.refresh();
		return;
	}

	controllerDevOps = new ScrollMagic.Controller();

	sceneDevOps = new ScrollMagic.Scene({
		triggerElement: '.devops',
		duration: 1000,
		triggerHook: '0',
	})
		.setTween(tweenTimeLineDevOps)
		.setPin('.devops')
		.addTo(controllerDevOps);
};

computeDevOpsPaths();
buildDevOpsScene();

/* MOBILE SUPPORT — ADDED */
if (window.HXRebuild) {
	window.HXRebuild.register('devops', () => {
		computeDevOpsPaths();
		buildDevOpsScene();
	});
}
