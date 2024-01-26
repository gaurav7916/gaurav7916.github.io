const amplifyScrollPathDesktop = {
	curviness: 0,
	autoRotate: false,
	values: [{ x: 50 * widthPercent, y: 25 * heightPercent }],
};

const npmPackageScrollPathDesktop = {
	curviness: 0,
	autoRotate: false,
	values: [
		{ x: -3 * widthPercent, y: -5 * heightPercent },
		{ x: 35 * widthPercent, y: -15 * heightPercent },
	],
};

const phpScrollPathDesktop = {
	curviness: 0,
	autoRotate: false,
	values: [
		{ x: -10 * widthPercent, y: 5 * heightPercent },
		{ x: 20 * widthPercent, y: -35 * heightPercent },
	],
};

const firebaseCloudFnsScrollPathDesktop = {
	curviness: 0,
	autoRotate: false,
	values: [
		{ x: -15 * widthPercent, y: 5 * heightPercent },
		{ x: 0 * widthPercent, y: -55 * heightPercent },
	],
};
const firebaseAuthScrollPathDesktop = {
	curviness: 0,
	autoRotate: false,
	values: [
		{ x: 10 * widthPercent, y: 5 * heightPercent },
		{ x: -20 * widthPercent, y: -25 * heightPercent },
	],
};

const awsCognitoScrollPathDesktop = {
	curviness: 0,
	autoRotate: false,
	values: [{ x: -45 * widthPercent, y: -25 * heightPercent }],
};

const reactScrollPathDesktop = {
	curviness: 0,
	autoRotate: false,
	values: [{ x: -20 * widthPercent, y: 95 * heightPercent }],
};

const serverlessScrollPathDesktop = {
	curviness: 0,
	autoRotate: false,
	values: [
		{ x: -10 * widthPercent, y: 0 * heightPercent },
		{ x: 0 * widthPercent, y: 66 * heightPercent },
	],
};

const tweenTimeLineFrontend = new TimelineLite();

tweenTimeLineFrontend.add(
	TweenLite.to('#cover-amplify', 3, {
		bezier: amplifyScrollPathDesktop,
		ease: Power0.easeNone,
	})
);

tweenTimeLineFrontend.add(
	TweenLite.to('#cover-react', 3, {
		bezier: reactScrollPathDesktop,
		ease: Power0.easeNone,
	}),
	0
);

tweenTimeLineFrontend.add(
	TweenLite.to('#cover-firebase-auth', 3, {
		bezier: firebaseAuthScrollPathDesktop,
		ease: Power0.easeNone,
	}),
	0
);

tweenTimeLineFrontend.add(
	TweenLite.to('#cover-firebase-cloud-fns', 3, {
		bezier: firebaseCloudFnsScrollPathDesktop,
		ease: Power0.easeNone,
	}),
	0
);

tweenTimeLineFrontend.add(
	TweenLite.to('#cover-aws-cognito', 3, {
		bezier: awsCognitoScrollPathDesktop,
		ease: Power0.easeNone,
	}),
	0
);

tweenTimeLineFrontend.add(
	TweenLite.to('#cover-serverless', 3, {
		bezier: serverlessScrollPathDesktop,
		ease: Power0.easeNone,
	}),
	0
);

tweenTimeLineFrontend.add(
	TweenLite.to('#cover-npm-package', 3, {
		bezier: npmPackageScrollPathDesktop,
		ease: Power0.easeNone,
	}),
	0
);

tweenTimeLineFrontend.add(
	TweenLite.to('#cover-php', 3, {
		bezier: phpScrollPathDesktop,
		ease: Power0.easeNone,
	}),
	0
);

const controllerFrontend = new ScrollMagic.Controller();

const sceneFrontend = new ScrollMagic.Scene({
	triggerElement: '.frontend',
	duration: 1000,
	triggerHook: '0',
})
	.setTween(tweenTimeLineFrontend)
	.setPin('.frontend')
	.addTo(controllerFrontend);
