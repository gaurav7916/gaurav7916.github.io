const androidScrollPathDesktop = {
	curviness: 0,
	autoRotate: false,
	values: [{ x: 15 * widthPercent, y: -30 * heightPercent }],
};

const elasticScrollPathDesktop = {
	curviness: 0,
	autoRotate: false,
	values: [
		{
			y: -30 * heightPercent,
			scale: 1,
			opacity: 1,
		},
	],
};

const logstashScrollPathDesktop = {
	curviness: 0,
	autoRotate: false,
	values: [
		{
			x: -15 * widthPercent,
			y: 15 * heightPercent,
			scale: 1,
			opacity: 1,
		},
	],
};

const kibanaScrollPathDesktop = {
	curviness: 0,
	autoRotate: false,
	values: [
		{
			x: 15 * widthPercent,
			y: 15 * heightPercent,
			scale: 1,
			opacity: 1,
		},
	],
};

const tweenTimeLineAndroidElastic = new TimelineLite();

tweenTimeLineAndroidElastic.add(
	TweenLite.to('#rotated-android', 3, {
		bezier: androidScrollPathDesktop,
		ease: Power0.easeNone,
	}),
	0
);

tweenTimeLineAndroidElastic.add(
	TweenLite.to('#elk-elastic', 3, {
		bezier: elasticScrollPathDesktop,
		ease: Power0.easeNone,
	}),
	3
);

tweenTimeLineAndroidElastic.add(
	TweenLite.to('#elk-logstash', 3, {
		bezier: logstashScrollPathDesktop,
		ease: Power0.easeNone,
	}),
	6
);

tweenTimeLineAndroidElastic.add(
	TweenLite.to('#elk-kibana', 3, {
		bezier: kibanaScrollPathDesktop,
		ease: Power0.easeNone,
	}),
	9
);

const controllerAndroidElastic = new ScrollMagic.Controller();

const sceneAndroidElastic = new ScrollMagic.Scene({
	triggerElement: '.android-elastic',
	duration: 1000,
	triggerHook: '0',
})
	.setTween(tweenTimeLineAndroidElastic)
	.setPin('.android-elastic')
	.addTo(controllerAndroidElastic);
