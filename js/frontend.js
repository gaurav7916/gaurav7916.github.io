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
	TweenLite.to('#cover-ADF', 3, {
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
	TweenLite.to('#cover-JS', 3, {
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


/* ========== FX MODE ========== */
const FX = {
	mode: "full",
	viewportTier: "desktop",
	particles: true,
	particleCount: 40,
	linkRadius: 120,
	particleLinks: true,
	pageVisible: true,
  };
  
  const TIER_FX = {
	desktop: { particles: true, particleCount: 40, particleLinks: true },
	laptop: { particles: true, particleCount: 30, particleLinks: true },
	tablet: { particles: true, particleCount: 18, particleLinks: true },
	mobile: { particles: true, particleCount: 12, particleLinks: false },
	compact: { particles: true, particleCount: 8, particleLinks: false },
  };
  
  const canvasRuntimes = {
	particles: null,
  };
  
  function detectViewportTier() {
	const width = window.innerWidth;
	if (width >= 1200) return "desktop";
	if (width >= 992) return "laptop";
	if (width >= 768) return "tablet";
	if (width > 420) return "mobile";
	return "compact";
  }
  
  function detectFxMode() {
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "minimal";
	const tier = FX.viewportTier || detectViewportTier();
	if (tier === "compact") return "minimal";
	if (tier === "mobile") return "lite";
	if (tier === "tablet" || tier === "laptop") return "lite";
	return "full";
  }
  
  function applyTierSettings(tier) {
	const settings = TIER_FX[tier] || TIER_FX.desktop;
	FX.particles = settings.particles;
	FX.particleCount = settings.particleCount;
	FX.particleLinks = settings.particleLinks;
  }
  
  function applyFxMode(mode) {
	FX.mode = mode;
	const tier = FX.viewportTier || detectViewportTier();
  
	if (mode === "minimal") {
	  FX.particles = false;
	  FX.particleCount = 0;
	  FX.particleLinks = false;
	} else {
	  applyTierSettings(tier);
	}
  
	canvasRuntimes.particles?.syncMode();
  }
  
  function syncResponsiveState() {
	FX.viewportTier = detectViewportTier();
	applyFxMode(detectFxMode());
  }
  
  function setupFxLifecycle() {
	syncResponsiveState();
  
	window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", () => {
	  syncResponsiveState();
	});
  
	document.addEventListener("visibilitychange", () => {
	  FX.pageVisible = !document.hidden;
	  if (FX.pageVisible) {
		canvasRuntimes.particles?.start();
	  } else {
		canvasRuntimes.particles?.stop();
	  }
	});
  
	let resizeTimer;
	window.addEventListener("resize", () => {
	  window.clearTimeout(resizeTimer);
	  resizeTimer = window.setTimeout(() => syncResponsiveState(), 200);
	});
  }
  
  document.addEventListener("DOMContentLoaded", () => {
	setupFxLifecycle();
	canvasRuntimes.particles = setupParticlesCanvas();
  });
  
  function setupParticlesCanvas() {
	const canvas = document.querySelector("#particles-canvas");
	if (!(canvas instanceof HTMLCanvasElement)) return null;
  
	const context = canvas.getContext("2d");
	if (!context) return null;
  
	let particles = [];
	let animationId = null;
	let mouseX = 0;
	let mouseY = 0;
	let mouseKnown = false;
	const mouseRadius = 150;
  
	window.addEventListener(
	  "mousemove",
	  (event) => {
		mouseX = event.clientX;
		mouseY = event.clientY;
		mouseKnown = true;
	  },
	  { passive: true },
	);
  
	const resize = () => {
	  canvas.width = window.innerWidth;
	  canvas.height = window.innerHeight;
	  const count = FX.particleCount;
  
	  particles = Array.from({ length: count }, () => ({
		x: Math.random() * canvas.width,
		y: Math.random() * canvas.height,
		vx: (Math.random() - 0.5) * 0.6,
		vy: (Math.random() - 0.5) * 0.6,
		radius: Math.random() * 2 + 1,
	  }));
	};
  
	const drawLinks = () => {
	  if (!mouseKnown || !FX.particleLinks) return;
  
	  const nearMouse = particles.filter(
		(particle) => Math.hypot(particle.x - mouseX, particle.y - mouseY) < mouseRadius,
	  );
  
	  for (let index = 0; index < nearMouse.length; index += 1) {
		for (let nextIndex = index + 1; nextIndex < nearMouse.length; nextIndex += 1) {
		  const a = nearMouse[index];
		  const b = nearMouse[nextIndex];
		  const distance = Math.hypot(a.x - b.x, a.y - b.y);
  
		  if (distance < FX.linkRadius) {
			context.beginPath();
			context.moveTo(a.x, a.y);
			context.lineTo(b.x, b.y);
			context.strokeStyle = `rgba(0, 212, 255, ${1 - distance / FX.linkRadius})`;
			context.lineWidth = 0.5;
			context.stroke();
		  }
		}
	  }
	};
  
	const draw = () => {
	  if (!FX.particles || !FX.pageVisible) {
		animationId = null;
		return;
	  }
  
	  context.clearRect(0, 0, canvas.width, canvas.height);
  
	  particles.forEach((particle) => {
		particle.x += particle.vx;
		particle.y += particle.vy;
  
		if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
		if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
  
		context.beginPath();
		context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
		context.fillStyle = "rgba(0, 212, 255, 0.55)";
		context.fill();
	  });
  
	  drawLinks();
	  animationId = window.requestAnimationFrame(draw);
	};
  
	const start = () => {
	  if (!FX.particles || !FX.pageVisible || animationId !== null) return;
	  animationId = window.requestAnimationFrame(draw);
	};
  
	const stop = () => {
	  if (animationId !== null) {
		window.cancelAnimationFrame(animationId);
		animationId = null;
	  }
	};
  
	const syncMode = () => {
	  stop();
	  resize();
	  if (FX.particles) start();
	};
  
	resize();
	window.addEventListener("resize", resize);
	start();
  
	return { start, stop, syncMode };
  }
