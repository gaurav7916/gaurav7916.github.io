// let personList = document.querySelectorAll('.person');
// window.onload = (event) => {
// 	let loader = document.getElementById('loader');
// 	loader.style.display = 'none';
// };
// let faceList = Array.from(personList).map((person) => {
// 	return person.querySelector('.face');
// });
// let armList = Array.from(personList).map((person) => {
// 	return person.querySelectorAll('.arms');
// });
// document.addEventListener('mousemove', (e) => {
// 	for (let i = 0; i < personList.length; i++) {
// 		let face = faceList[i];
// 		let faceBoundingRect = face.getBoundingClientRect();
// 		if (
// 			(faceBoundingRect.top >= 0 &&
// 				faceBoundingRect.bottom <= window.innerHeight) ||
// 			(faceBoundingRect.top < window.innerHeight &&
// 				faceBoundingRect.bottom >= 0)
// 		) {
// 			let arms = armList[i];
// 			let faceCenter = {
// 				x: faceBoundingRect.left + faceBoundingRect.width / 2,
// 				y: faceBoundingRect.top + faceBoundingRect.height / 2,
// 			};
// 			let angle =
// 				Math.atan2(e.pageX - faceCenter.x, -(e.pageY - faceCenter.y)) *
// 				(180 / Math.PI);
// 			if (angle >= 0 && angle <= 180) {
// 				face.style.transform = `rotate(${angle - 90}deg)`;
// 				for (arm of arms) {
// 					arm.style.transform = `rotate(${angle - 90}deg)`;
// 				}
// 			}

// 			if (angle > -180 && angle < 0) {
// 				face.style.transform = `rotate(${angle + 90}deg) scale(-1,1)`;
// 				for (arm of arms) {
// 					arm.style.transform = `rotate(${angle - 90}deg)`;
// 				}
// 			}
// 		}
// 	}
// });

// var entries = [
// 	{
// 		label: 'jQueryScript.net',
// 		url: 'http://www.jqueryscript.net/',
// 		target: '_top',
// 	},
// 	{ label: 'Javascript-Forum', url: 'http://forum.jswelt.de/', target: '_top' },
// 	{
// 		label: 'JSFiddle',
// 		url: 'https://jsfiddle.net/user/NiklasKnaack/fiddles/',
// 		target: '_top',
// 	},
// 	{ label: 'CodePen', url: 'http://codepen.io/', target: '_top' },
// 	{ label: 'three.js', url: 'http://threejs.org/', target: '_top' },
// 	{ label: 'WebGLStudio.js', url: 'http://webglstudio.org/', target: '_top' },
// 	{ label: 'JS Compress', url: 'http://jscompress.com/', target: '_top' },
// 	{ label: 'TinyPNG', url: 'https://tinypng.com/', target: '_top' },
// 	{ label: 'Can I Use', url: 'http://caniuse.com/', target: '_top' },
// 	{ label: 'URL shortener', url: 'https://goo.gl/', target: '_top' },
// 	{
// 		label: 'HTML Encoder',
// 		url: 'http://www.opinionatedgeek.com/DotNet/Tools/HTMLEncode/Encode.aspx',
// 		target: '_top',
// 	},
// 	{ label: 'Twitter', url: 'https://twitter.com/niklaswebdev', target: '_top' },
// 	{ label: 'deviantART', url: 'http://nkunited.deviantart.com/', target: '_top' },
// 	{ label: 'Gulp', url: 'http://gulpjs.com/', target: '_top' },
// 	{ label: 'Browsersync', url: 'https://www.browsersync.io/', target: '_top' },
// 	{ label: 'GitHub', url: 'https://github.com/', target: '_top' },
// 	{ label: 'Shadertoy', url: 'https://www.shadertoy.com/', target: '_top' },
// 	{ label: 'Starling', url: 'http://gamua.com/starling/', target: '_top' },
// 	{ label: 'jsPerf', url: 'http://jsperf.com/', target: '_top' },
// 	{ label: 'Foundation', url: 'http://foundation.zurb.com/', target: '_top' },
// 	{ label: 'CreateJS', url: 'http://createjs.com/', target: '_top' },
// 	{
// 		label: 'Velocity.js',
// 		url: 'http://julian.com/research/velocity/',
// 		target: '_top',
// 	},
// 	{
// 		label: 'TweenLite',
// 		url: 'https://greensock.com/docs/#/HTML5/GSAP/TweenLite/',
// 		target: '_top',
// 	},
// 	{ label: 'jQuery', url: 'https://jquery.com/', target: '_top' },
// 	{ label: 'jQuery Rain', url: 'http://www.jqueryrain.com/', target: '_top' },
// 	{ label: 'jQuery Plugins', url: 'http://jquery-plugins.net/', target: '_top' },
// ];

// var settings = {
// 	entries: entries,
// 	width: 480,
// 	height: 480,
// 	radius: '65%',
// 	radiusMin: 75,
// 	bgDraw: false,
// 	opacityOver: 1.0,
// 	opacityOut: 0.05,
// 	opacitySpeed: 6,
// 	fov: 800,
// 	speed: 0.3,
// 	fontFamily: 'Oswald, Arial, sans-serif',
// 	fontSize: '15',
// 	fontColor: '#fff',
// 	fontWeight: 'normal', //bold
// 	fontStyle: 'normal', //italic
// 	fontStretch: 'normal', //wider, narrower, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded
// 	fontToUpperCase: false,
// 	tooltipFontFamily: 'Oswald, Arial, sans-serif',
// 	tooltipFontSize: '11',
// 	tooltipFontColor: '#fff',
// 	tooltipFontWeight: 'normal', //bold
// 	tooltipFontStyle: 'normal', //italic
// 	tooltipFontStretch: 'normal', //wider, narrower, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded
// 	tooltipFontToUpperCase: false,
// 	tooltipTextAnchor: 'left',
// 	tooltipDiffX: 0,
// 	tooltipDiffY: 10,
// };

// var svg3DTagCloud = new SVG3DTagCloud(document.getElementById('holder'), settings);

// const flightPath = {
// 	curviness: 1.25,
// 	autoRotate: true,
// 	values: [
// 		{ x: 0, y: 0, scale: 1, opacity: 0 },
// 		{ x: 100, y: 20, scale: 1, opacity: 0.1 },
// 		{ x: 300, y: 10, scale: 1.4, opacity: 0.2 },
// 		{ x: 500, y: 100, scale: 1.6, opacity: 0.3 },
// 		{ x: 750, y: -100, scale: 1.8, opacity: 0.4 },
// 		{ x: 100, y: 100, scale: 2.0, opacity: 0.5 },
// 		{ x: 700, y: 0, scale: 2.2, opacity: 0.6 },
// 		{ x: 10, y: 10, scale: 2.4, opacity: 0.7 },
// 	],
// };

// const flightPath2 = {
// 	curviness: 1.25,
// 	autoRotate: true,
// 	values: [
// 		{ x: 30, y: -20 },
// 		{ x: -300, y: 10 },
// 		{ x: -500, y: 100 },
// 		{ x: -750, y: -100 },
// 		{ x: -100, y: 100 },
// 		{ x: -700, y: 0 },
// 		{ x: -10, y: 10 },
// 	],
// };

// const tween = new TimelineLite();

// tween.add(
// 	TweenLite.to('.paper-plane', 4, {
// 		bezier: flightPath,
// 		ease: Power1.easeInOut,
// 	}),
// 	2
// );
// tween.add(
// 	TweenLite.to('.paper-plane2', 6, {
// 		bezier: flightPath2,
// 		ease: Power1.easeInOut,
// 	}),
// 	0
// );

// const controller = new ScrollMagic.Controller();

// const scene = new ScrollMagic.Scene({
// 	triggerElement: '.animation',
// 	duration: 6000,
// 	triggerHook: '0',
// })
// 	// .setTween(tween)
// 	// .addIndicators()
// 	.setPin('.animation')
// 	.addTo(controller);

// const flightPath3 = {
// 	curviness: 1.25,
// 	autoRotate: true,
// 	values: [
// 		{ x: 100, y: 20, scale: 0.2 },
// 		{ x: 100, y: 15, scale: 0.4 },
// 		{ x: 300, y: 10, scale: 0.8 },
// 		{ x: 500, y: 100, scale: 1.2 },
// 		{ x: 750, y: -100, scale: 1.6 },
// 		{ x: 100, y: 100, scale: 2.0 },
// 		{ x: 700, y: 0, scale: 2.4 },
// 		{ x: 10, y: 10, scale: 2.8 },
// 	],
// };

// const flightPath4 = {
// 	curviness: 1.25,
// 	autoRotate: true,
// 	values: [
// 		{ x: 30, y: -20 },
// 		{ x: -300, y: 10 },
// 		{ x: -500, y: 100 },
// 		{ x: -750, y: -100 },
// 		{ x: -100, y: 100 },
// 		{ x: -700, y: 0 },
// 		{ x: -10, y: 10 },
// 	],
// };
// const flightPath4 = {
// 	curviness: 1.25,
// 	autoRotate: true,
// 	values: [
// 		{ x: 85, y: 163 },
// 		{ x: 229, y: 186 },
// 		{ x: 328, y: 341 },
// 		{ x: 536, y: 506 },
// 		{ x: 700, y: 457 },
// 		{ x: 813, y: 309 },
// 		{ x: 720, y: 244 },
// 	],
// };
// const screenHeightPercent = window.innerHeight / 100;
// const screenWidthPercent = window.innerWidth / 100;

// const flightPath4 = {
// 	curviness: 1,
// 	autoRotate: true,
// 	values: [
// 		// { x: 35 * screenWidthPercent, y: 5 * screenHeightPercent },
// 		{ x: 70 * screenWidthPercent, y: 20 * screenHeightPercent },
// 		{ x: 229, y: 186 },
// 		{ x: 328, y: 341 },
// 		{ x: 536, y: 506 },
// 		{ x: 700, y: 457 },
// 		{ x: 813, y: 309 },
// 		{ x: 720, y: 244 },
// 	],
// };

// const tween2 = new TimelineLite();

// tween2.add(
// 	TweenLite.to('.paper-plane3', 4, {
// 		bezier: flightPath3,
// 		ease: Power1.easeInOut,
// 	}),
// 	2
// );
// tween2.add(
// 	TweenLite.to('.paper-plane4', 6, {
// 		bezier: flightPath4,
// 		ease: Power1.easeInOut,
// 	}),
// 	0
// );

// const controller2 = new ScrollMagic.Controller();

// const scene2 = new ScrollMagic.Scene({
// 	triggerElement: '.animation2',
// 	duration: 6000,
// 	triggerHook: '0',
// })
// 	.setTween(tween2)
// 	.addIndicators()
// 	.setPin('.animation2')
// 	.addTo(controller2);
