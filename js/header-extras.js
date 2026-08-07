window.addEventListener('load', function() {
	const canvas = document.getElementById('visualization');
	const ctx = canvas.getContext('2d');
	function setCanvasSize() {
		const rect = canvas.getBoundingClientRect();
		canvas.width = Math.round(rect.width) || window.innerWidth;
		canvas.height = Math.round(rect.height) || window.innerHeight;
	}
	setCanvasSize();

	// Convert a viewport point (clientX/clientY) into canvas-local coordinates.
	function toCanvasPoint(clientX, clientY) {
		const rect = canvas.getBoundingClientRect();
		return { x: clientX - rect.left, y: clientY - rect.top };
	}
	
	const restingCenter = { x: canvas.width / 2, y: canvas.height / 2 };
	let sinceRestingCenter = Infinity;

	function updateRestingCenter(elapsedMs) {
		sinceRestingCenter += elapsedMs;
		if (sinceRestingCenter < 150) return; // 8 layout reads/frame is not worth it
		sinceRestingCenter = 0;

		const circles = document.querySelectorAll('.cover-circle');
		if (!circles.length) {
			restingCenter.x = canvas.width / 2;
			restingCenter.y = canvas.height / 2;
			return;
		}

		const rect = canvas.getBoundingClientRect();
		let sumX = 0;
		let sumY = 0;
		circles.forEach(circle => {
			const c = circle.getBoundingClientRect();
			sumX += c.left + c.width / 2;
			sumY += c.top + c.height / 2;
		});

		restingCenter.x = sumX / circles.length - rect.left;
		restingCenter.y = sumY / circles.length - rect.top;
	}
	updateRestingCenter(Infinity);

	// Colors 22c5fc-ff1fb4-f168f1-C46EFD-71FFF1
	const colors = ['#22c5fc', '#ff1fb4', '#f168f1', '#C46EFD', '#71FFF1'];
	const colorValues = colors.map(color => {
		const hex = color.substring(1);
		return {
			r: parseInt(hex.substring(0, 2), 16),
			g: parseInt(hex.substring(2, 4), 16),
			b: parseInt(hex.substring(4, 6), 16)
		};
	});
	
	// Add these customization variables at the top of your script, perhaps right after the colors array
	const communicationSettings = {
		// Appearance settings
		outgoingColor: '#ff00aa',       // Pink color for outgoing communications
		incomingColor: '#00ccff',       // Blue color for incoming communications
		lineThickness: .01,               // Width of the communication lines
		maxOpacity: 0.001,                // Maximum opacity (0-1) of the lines
		curveRandomness: 0.5,           // How random the curve paths are (0-1)

		// Behavior settings
		commProbabilityBase: 0.0009,    // Base probability of starting a communication
		commProbabilityMult: 0.0016,    // Multiplier for time-based probability increase
		minDuration: 0.5,               // Minimum duration of a communication in seconds
		maxDuration: 2.0,               // Maximum duration of a communication in seconds

		// Data packet settings
		packetMinCount: 1,              // Minimum number of packets per communication
		packetMaxCount: 2,              // Maximum number of packets per communication
		packetSize: 1,                  // Base size of the data packets
		packetPulseSpeed: 0.01,         // Speed of the packet pulse animation
		packetOpacityMult: 0.2          // Opacity multiplier for packets (relative to line opacity)
	};

	// Animation state
	let lastTime = 0;
	let mouseX = restingCenter.x;
	let mouseY = restingCenter.y;
	let mouseInCanvas = false;

	// Star field
	const starfield = [];
	function createStarfield() {
		starfield.length = 0;
		for (let i = 0; i < 200; i++) {
			starfield.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				baseSize: (Math.random() * 2.5 + 0.5) * 0.2, // 20% of original size
				baseOpacity: Math.random() * 0.6 + 0.3,
				pulseSpeed: 0.0005 + Math.random() * 0.001,
				pulsePhase: Math.random() * Math.PI * 2,
				pulseAmount: 0.2 + Math.random() * 0.3
			});
		}
	}
	createStarfield();

	// Core AI entity
	const core = {
		x: restingCenter.x,
		y: restingCenter.y,
		radius: 40,
		pulseSpeed: 0.0042,
		pulseAmount: 5,
		colorPhase: 0,
		colorSpeed: 0.0028,
		lastX: 0,
		lastY: 0,
		isMouseOver: false,
		textDisplay: "",     // Current word being displayed
		words: ["AI", "ML"], // Words to display in sequence
		wordIndex: 0,        // Current word in the sequence
		charIndex: 0,        // Current character being displayed
		currentChar: "",     // Current character animation
		charProgress: 0,     // Progress of current character animation
		textFadeIn: 0,
		textDisplaying: false,
		textDisplayDuration: 0,
		textAnimationSpeed: 0.02, // Increased by 40% to speed up first letter
		typingDelay: 13,     // Delay between characters
		typingTimer: 0,
		cursorVisible: true,
		cursorBlinkRate: 0.03 * 0.2, // Reduced by 80% to slow down blinking
		mode: "idle",       
		textPulsePhase: Math.random() * Math.PI * 2, // Random starting phase for text pulsation
		textPulseSpeed: 0.002, // Speed of text pulsation
		// Click reaction properties
		clickReaction: false,
		clickReactionTime: 0,
		clickReactionDuration: 0.6, // Duration in seconds
		clickReactionIntensity: 0,
		gradients: {
			outer: null,
			core: null,
			soft: null
		},
		hasInteracted: false, // NEW: Track if AI has been interacted with
		textOpacity: 0.85,        // NEW: Control for text opacity, default 1 (fully opaque)
		shadowOpacity: 0.35,        // NEW: Control for text opacity, default 1 (fully opaque)
		wordFontSizes: {       // NEW: Control for individual word sizes (multipliers)
			"AI": 0.8,     
			"ML": 0.6
		},

		update(deltaTime) {
			this.colorPhase += this.colorSpeed * deltaTime;
			this.textPulsePhase += this.textPulseSpeed * deltaTime;

			// The core stays pinned to the centre of the circle grid and no longer
			// follows the pointer. restingCenter still shifts while the scroll
			// animation settles the circles, so keep easing towards it rather than
			// snapping, which keeps that settle smooth.
			const targetX = restingCenter.x;
			const targetY = restingCenter.y;

			const moveSpeed = 0.005 * deltaTime;
			this.x += (targetX - this.x) * moveSpeed;
			this.y += (targetY - this.y) * moveSpeed;

			// Update click reaction effect
			if (this.clickReaction) {
				this.clickReactionTime += deltaTime * 0.016; // Convert to seconds

				if (this.clickReactionTime < this.clickReactionDuration) {
					// Create a smooth animation curve that starts fast and slows down
					const progress = this.clickReactionTime / this.clickReactionDuration;
					this.clickReactionIntensity = Math.sin(progress * Math.PI) * (1 - progress);
				} else {
					this.clickReaction = false;
					this.clickReactionTime = 0;
					this.clickReactionIntensity = 0;
				}
			}

			// Check if mouse is over the core
			const distToMouse = Math.sqrt(
				Math.pow(mouseX - this.x, 2) +
				Math.pow(mouseY - this.y, 2)
			);

			const wasMouseOver = this.isMouseOver;
			this.isMouseOver = distToMouse < this.radius && mouseInCanvas;

			// Cursor blinking
			this.cursorVisible = Math.sin(Date.now() * this.cursorBlinkRate) > 0;

			// ---- State Management ----

			// If we're in idle mode and mouse enters, start the word sequence
			if (this.mode === "idle" && this.isMouseOver && !wasMouseOver) {
				this.mode = "ai";
				this.wordIndex = 0; // Track which word we're on
				this.showNextWord();
				this.hasInteracted = true; // Set hasInteracted on first hover
			}

			// Update text animation based on current mode
			if (this.textDisplaying) {
				if (this.charIndex < this.textDisplay.length) {
					this.textFadeIn += 0.05 * deltaTime;
					if (this.textFadeIn > 1) this.textFadeIn = 1;

					// Typing animation for current character
					if (this.charProgress < 1) {
						this.charProgress += this.textAnimationSpeed * deltaTime;
						if (this.charProgress >= 1) {
							this.charProgress = 0;
							this.currentChar = this.textDisplay[this.charIndex];
							this.charIndex++;
							this.typingTimer = this.typingDelay;
						}
					} else if (this.typingTimer > 0) {
						this.typingTimer -= deltaTime;
					}
				} else {
					this.textDisplayDuration += deltaTime * 0.016;

					// Word sequence - after displaying a word
					if (this.textDisplayDuration > 1.5 && this.mode === "ai" && this.wordIndex < this.words.length - 1) {
						// Move to next word in sequence
						this.wordIndex++;
						this.showNextWord();
					} else if (this.textDisplayDuration > 3) { // Regular display period
						this.textFadeIn -= 0.02 * deltaTime;
						if (this.textFadeIn <= 0) {
							this.textFadeIn = 0;
							this.textDisplaying = false;
						}
					}
				}
			} else if (this.mode === "idle" && this.isMouseOver) {
				// Restart sequence if mouse is still over after completion
				this.mode = "ai";
				this.wordIndex = 0;
				this.showNextWord();
				this.hasInteracted = true; // Ensure hasInteracted is set here as well (though should already be true)
			}
			 // If mouse leaves canvas, switch to 'bye' mode (if not already displaying text)
			else if (this.mode === "idle" && !mouseInCanvas && !this.textDisplaying && this.hasInteracted) { // NEW: Check this.hasInteracted
				this.mode = "bye";
				this.showNextWord(); // Show "Bye" text
			}
		},

		// Helper method to start text animation
		startTextAnimation() {
			this.textDisplaying = true;
			this.charIndex = 0;
			this.currentChar = "";
			this.charProgress = 0;
			this.textFadeIn = 0;
			this.textDisplayDuration = 0;
			this.typingTimer = 0;
		},

		// Helper to show the next word in sequence
		showNextWord() {
			// Reset any existing animation state
			this.textDisplaying = true;
			this.charIndex = 0;
			this.currentChar = "";
			this.charProgress = 0;
			this.textFadeIn = 0;
			this.textDisplayDuration = 0;
			this.typingTimer = 0;

			// Set current word based on mode and sequence
			if (this.mode === "ai") {
				this.textDisplay = this.words[this.wordIndex];
			} else if (this.mode === "hi") {
				this.textDisplay = "Hi";
			} else if (this.mode === "bye") {
				this.textDisplay = "Bye"; // **Changed "bye" to "Bye"**
			}
		},

		draw() {
			const pulse = Math.sin(Date.now() * this.pulseSpeed) * this.pulseAmount;

			// Click reaction effect - temporarily increase pulse size and brightness
			const clickPulseAdd = this.clickReactionIntensity * this.radius * 0.65;
			const clickBrightnessBoost = this.clickReactionIntensity * 90; // Brightness boost factor

			const r = Math.sin(this.colorPhase) * 60 + 195 + clickBrightnessBoost;
			const g = Math.sin(this.colorPhase + 2) * 100 + 100 + clickBrightnessBoost * 0.7;
			const b = Math.sin(this.colorPhase + 4) * 30 + 225 + clickBrightnessBoost * 0.5;

			// Create new gradients
			// Outer glow gradient
			const glowRadius = this.radius * 3;
			const outerGlow = ctx.createRadialGradient(
				this.x, this.y, this.radius * 0.9,
				this.x, this.y, glowRadius
			);
			outerGlow.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.5)`);
			outerGlow.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.35)`);
			outerGlow.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.15)`);
			outerGlow.addColorStop(0.8, `rgba(${r}, ${g}, ${b}, 0.05)`);
			outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

			// Core gradient
			const coreGrad = ctx.createRadialGradient(
				this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.1,
				this.x, this.y, this.radius * 1.2 + pulse
			);
			const opacityFactor = 0.88;
			coreGrad.addColorStop(0, `rgba(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)}, ${0.9 * opacityFactor})`);
			coreGrad.addColorStop(0.3, `rgba(${Math.min(255, r + 20)}, ${Math.min(255, g + 20)}, ${Math.min(255, b + 20)}, ${0.85 * opacityFactor})`);
			coreGrad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${0.8 * opacityFactor})`);
			coreGrad.addColorStop(0.8, `rgba(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)}, ${0.75 * opacityFactor})`);
			coreGrad.addColorStop(1, `rgba(${Math.max(0, r - 60)}, ${Math.max(0, g - 60)}, ${Math.max(0, b - 60)}, ${0.7 * opacityFactor})`);

			// Soft glow gradient
			const softGlowRadius = this.radius * 1.5;
			const softGlow = ctx.createRadialGradient(
				this.x, this.y, this.radius * 0.5,
				this.x, this.y, softGlowRadius
			);
			softGlow.addColorStop(0, `rgba(${Math.min(255, r + 30)}, ${Math.min(255, g + 30)}, ${Math.min(255, b + 30)}, 0.15)`);
			softGlow.addColorStop(0.5, `rgba(${Math.min(255, r + 20)}, ${Math.min(255, g + 20)}, ${Math.min(255, b + 20)}, 0.08)`);
			softGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

			// Draw outer glow
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
			ctx.fillStyle = outerGlow;
			ctx.fill();

			// Draw core with hover effect
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius + pulse, 0, Math.PI * 2);
			ctx.fillStyle = coreGrad;
			ctx.fill();

			// Add highlight
			ctx.beginPath();
			const highlightSize = (this.radius + pulse) * 0.6;
			const offsetX = this.x - (this.radius + pulse) * 0.2;
			const offsetY = this.y - (this.radius + pulse) * 0.2;
			ctx.arc(offsetX, offsetY, highlightSize, 0, Math.PI * 2);
			const highlightGradient = ctx.createRadialGradient(
				offsetX, offsetY, 0,
				offsetX, offsetY, highlightSize
			);
			highlightGradient.addColorStop(0, `rgba(255, 255, 255, 0.15)`);
			highlightGradient.addColorStop(0.5, `rgba(255, 255, 255, 0.05)`);
			highlightGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
			ctx.fillStyle = highlightGradient;
			ctx.fill();

			// Soft glow with blending
			ctx.globalCompositeOperation = 'lighter';
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius * 1.5, 0, Math.PI * 2);
			ctx.fillStyle = softGlow;
			ctx.fill();

			// Outer ring
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius * 2.2, 0, Math.PI * 2);
			ctx.lineWidth = 0.5;
			ctx.strokeStyle = `rgba(${Math.min(255, r + 30)}, ${Math.min(255, g + 30)}, ${Math.min(255, b + 30)}, 0.1)`;
			ctx.stroke();

			// Add hover effect when mouse is over
			if (this.isMouseOver) {
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.radius + pulse, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
				ctx.fill();

				// Change cursor to pointer
				canvas.style.cursor = 'pointer';
			} else {
				canvas.style.cursor = 'default';
			}

			ctx.globalCompositeOperation = 'source-over';

			// Draw text when mouse is over or text is displaying
			if (this.textDisplaying) {
				// Set text properties but don't use center alignment
				ctx.textBaseline = 'middle';
				const currentWordFontSizeMultiplier = this.wordFontSizes[this.textDisplay] || 0.7;
				const fontSize = this.radius * currentWordFontSizeMultiplier;
				ctx.font = `bold ${fontSize}px Merriweather`;

				// Calculate text positioning
				let displayText = "";
				for (let i = 0; i < this.charIndex; i++) {
					displayText += this.textDisplay[i];
				}
				const fullTextWidth = ctx.measureText(this.textDisplay).width;
				const currentTextWidth = ctx.measureText(displayText).width;
				const leftShift = this.radius * 0.05;
				const textStartX = this.x - fullTextWidth / 2 - leftShift;
				const textY = this.y + fontSize * 0.1;

				// Save context state
				ctx.save();

				// First shadow (red with offset)
				ctx.save();
				ctx.shadowOffsetX = 1;
				ctx.shadowOffsetY = 1;
				ctx.shadowBlur = 2;
				ctx.shadowColor = 'red';
				ctx.fillStyle = `rgba(255, 254, 173, ${this.textFadeIn * this.shadowOpacity})`;
				ctx.fillText(displayText, textStartX, textY);
				ctx.restore();

				// Second shadow (blue glow 1em)
				ctx.save();
				ctx.shadowOffsetX = 0;
				ctx.shadowOffsetY = 0;
				ctx.shadowBlur = 13; // ~1em
				ctx.shadowColor = 'blue';
				ctx.fillStyle = `rgba(251, 244, 207, ${this.textFadeIn * this.shadowOpacity})`;
				ctx.fillText(displayText, textStartX, textY);
				ctx.restore();


				// Add blinking cursor
				if (this.cursorVisible && this.charIndex < this.textDisplay.length) {
					const cursorX = textStartX + currentTextWidth + 2;
					ctx.fillRect(cursorX, this.y - fontSize/3, 2, fontSize/1.5);
				}

				ctx.restore();
			}
		}
	};

	// Orbital rings
	const rings = [];
	function createRings() {
		rings.length = 0;
		for (let i = 0; i < 5; i++) {
			rings.push({
				radius: 100 + i * 30,
				rotation: Math.random() * Math.PI * 2,
				rotationSpeed: 0.001 + Math.random() * 0.001,
				color: colorValues[Math.floor(Math.random() * colorValues.length)],
				opacity: 0.3 - i * 0.03,
				tiltValue: Math.random() * Math.PI * 2,
				wobble: 0.4 + Math.random() * 0.3,
				wobbleSpeed: 0.001 + Math.random() * 0.001,
				wobblePhase: Math.random() * Math.PI * 2,

				update(deltaTime) {
					this.rotation += this.rotationSpeed * deltaTime;
					this.wobblePhase += this.wobbleSpeed * deltaTime * 0.5;
				},

				draw() {
					const wobbleAmount = Math.sin(Date.now() * this.wobbleSpeed + this.wobblePhase) * this.wobble;

					ctx.save();
					ctx.translate(core.x, core.y);

					ctx.rotate(this.rotation);

					const dynamicTilt = this.tiltValue + wobbleAmount;

					const tiltX = Math.cos(dynamicTilt + this.rotation * 0.7);
					const tiltY = Math.sin(dynamicTilt + this.rotation * 0.5);

					ctx.transform(
						tiltX, 0,
						0, tiltY,
						0, 0
					);

					const { r, g, b } = this.color;

					const brightnessFactor = 0.7 + 0.3 * Math.abs(Math.sin(this.rotation * 2));

					ctx.beginPath();
					ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
					ctx.lineCap = 'round';
					ctx.lineWidth = 2 * Math.abs(tiltY);
					ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity * brightnessFactor})`;
					ctx.stroke();

					if (Math.abs(tiltY) > 0.7) {
						ctx.beginPath();
						ctx.arc(0, 0, this.radius * 0.98, 0, Math.PI * 2);
						ctx.lineWidth = 0.5;
						ctx.strokeStyle = `rgba(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)}, ${this.opacity * 0.7})`;
						ctx.stroke();
					}

					ctx.restore();
				}
			});
		}
	}
	createRings();

	// Particles
	const particles = [];
	const particleBatches = {};

	function createParticles() {
		particles.length = 0;
		for (let i = 0; i < 50; i++) {
			const phi = Math.acos(2 * Math.random() - 1);
			const theta = Math.random() * Math.PI * 2;
			const distance = 80 + Math.random() * 200;
			const colorIndex = Math.floor(Math.random() * colorValues.length);

			particles.push({
				orbitData: {
					distance: distance,
					theta: theta,
					phi: phi,
					tilt: Math.random() * Math.PI,
					phase: Math.random() * Math.PI * 2,
					speed: 0.005 + Math.random() * 0.01,
					amplitude: 5 + Math.random() * 10,
					oscPhase: Math.random() * Math.PI * 2
				},
				x: core.x,
				y: core.y,
				z: 0,
				size: 2 + Math.random() * 3,
				colorIndex: colorIndex,
				batchKey: colorIndex,
				communicating: false,
				communicationTimer: 0,
				communicationDuration: 0,
				communicationDirection: null,
				lastCommunicationTime: -10000,

				update(deltaTime) {
					this.orbitData.phase += this.orbitData.speed * deltaTime;

					const orbitX = Math.sin(this.orbitData.phase) * Math.cos(this.orbitData.tilt) * this.orbitData.distance;
					const orbitY = Math.sin(this.orbitData.phase) * Math.sin(this.orbitData.tilt) * this.orbitData.distance;
					const orbitZ = Math.cos(this.orbitData.phase) * this.orbitData.distance * 0.3;

					const oscillationX = Math.sin(Date.now() * 0.0007 + this.orbitData.oscPhase) * this.orbitData.amplitude;
					const oscillationY = Math.cos(Date.now() * 0.0005 + this.orbitData.oscPhase) * this.orbitData.amplitude;

					const targetX = core.x + orbitX + oscillationX;
					const targetY = core.y + orbitY + oscillationY;

					const moveSpeed = 0.01 * deltaTime;
					this.x += (targetX - this.x) * moveSpeed;
					this.y += (targetY - this.y) * moveSpeed;
					this.z = orbitZ;

					// Communication logic
					const now = Date.now();
					const timeSinceLastComm = now - this.lastCommunicationTime;

					const commProbability = Math.min(0.0013 * deltaTime, 0.0026 * deltaTime * (timeSinceLastComm / 3000));

					if (!this.communicating && Math.random() < commProbability) {
						this.communicating = true;
						this.communicationTimer = 0;
						this.communicationDuration = 1 + Math.random() * 2;
						this.communicationDirection = Math.random() > 0.5 ? 'incoming' : 'outgoing';
						this.lastCommunicationTime = now;
					}

					if (this.communicating) {
						this.communicationTimer += 0.016 * deltaTime;

						if (this.communicationTimer > this.communicationDuration) {
							this.communicating = false;
						}
					}
				},

				addToBatch() {
					if (!particleBatches[this.batchKey]) {
						particleBatches[this.batchKey] = {
							color: colorValues[this.colorIndex],
							particles: []
						};
					}

					const zFactor = (this.z + 200) / 400;
					const displaySize = this.size * (0.5 + zFactor);

					particleBatches[this.batchKey].particles.push({
						x: this.x,
						y: this.y,
						size: displaySize,
						zFactor: zFactor
					});
				},

				drawCommunication() {
					if (!this.communicating) return;

					const progress = this.communicationTimer / this.communicationDuration;

					const coreX = core.x;
					const coreY = core.y;

					let startX, startY, endX, endY;

					if (this.communicationDirection === 'outgoing') {
						startX = coreX;
						startY = coreY;
						endX = this.x;
						endY = this.y;
					} else {
						startX = this.x;
						startY = this.y;
						endX = coreX;
						endY = coreY;
					}

					const dx = endX - startX;
					const dy = endY - startY;
					const distance = Math.sqrt(dx*dx + dy*dy);

					const cpDist1 = distance * (0.2 + Math.random() * 0.3);
					const cpAngle1 = Math.atan2(dy, dx) + (Math.random() * 0.8 - 0.4);
					const cp1x = startX + Math.cos(cpAngle1) * cpDist1;
					const cp1y = startY + Math.sin(cpAngle1) * cpDist1;

					const cpDist2 = distance * (0.7 + Math.random() * 0.3);
					const cpAngle2 = Math.atan2(dy, dx) + (Math.random() * 0.8 - 0.4);
					const cp2x = startX + Math.cos(cpAngle2) * cpDist2;
					const cp2y = startY + Math.sin(cpAngle2) * cpDist2;

					ctx.beginPath();
					ctx.moveTo(startX, startY);
					ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);

					if (this.communicationDirection === 'outgoing') {
						ctx.strokeStyle = '#ff00aa';
					} else {
						ctx.strokeStyle = '#00ccff';
					}

					const opacity = (progress < 0.2 ? progress / 0.2 :
									  progress > 0.8 ? (1 - progress) / 0.2 :
									  1) * 0.5;

					ctx.globalAlpha = opacity;
					ctx.lineWidth = 1;
					ctx.stroke();
					ctx.globalAlpha = 1;

					const packetCount = 1 + Math.floor(Math.random() * 3);

					for (let i = 0; i < packetCount; i++) {
						const packetOffset = i * (0.2 / packetCount);
						const packetProgress = Math.min(1, (progress * 1.2 - packetOffset)) % 1;

						if (packetProgress >= 0 && packetProgress <= 1) {
							const t = packetProgress;
							const t1 = 1 - t;

							const px = t1*t1*t1*startX + 3*t1*t1*t*cp1x + 3*t1*t*t*cp2x + t*t*t*endX;
							const py = t1*t1*t1*startY + 3*t1*t1*t*cp1y + 3*t1*t*t*cp2y + t*t*t*endY;

							const packetPulse = Math.sin(Date.now() * 0.01 + i * 2) * 0.5 + 1;

							ctx.beginPath();
							ctx.arc(px, py, 2 * packetPulse, 0, Math.PI * 2);

							if (this.communicationDirection === 'outgoing') {
								ctx.fillStyle = '#ff00aa';
							} else {
								ctx.fillStyle = '#00ccff';
							}

							ctx.globalAlpha = opacity * 0.8;
							ctx.fill();
							ctx.globalAlpha = 1;
						}
					}
				}
			});
		}
	}
	createParticles();

	// Render particles in batches
	function renderParticleBatches() {
		// Clear previous batches
		for (let key in particleBatches) {
			particleBatches[key].particles = [];
		}

		// Add each particle to its batch
		particles.forEach(particle => particle.addToBatch());

		// Render each batch
		for (let key in particleBatches) {
			const batch = particleBatches[key];
			if (batch.particles.length === 0) continue;

			const { r, g, b } = batch.color;

			// Draw all particles in batch
			batch.particles.forEach(p => {
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.4 + p.zFactor * 0.6})`;
				ctx.fill();

				if (p.zFactor > 0.7) {
					ctx.beginPath();
					ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);

					const glow = ctx.createRadialGradient(
						p.x, p.y, p.size,
						p.x, p.y, p.size * 2
					);
					glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.2)`);
					glow.addColorStop(1, 'rgba(0, 0, 0, 0)');

					ctx.fillStyle = glow;
					ctx.fill();
				}
			});
		}

		// Draw communications separately
		particles.forEach(particle => particle.drawCommunication());
	}

	// Mouse event listeners
	canvas.addEventListener('mousemove', (e) => {
		const point = toCanvasPoint(e.clientX, e.clientY);
		mouseX = point.x;
		mouseY = point.y;
		mouseInCanvas = true;
	});

	canvas.addEventListener('mouseleave', () => {
		mouseInCanvas = false;
	});

	// Click event for changing text and triggering reaction effect
	canvas.addEventListener('click', (e) => {
		const point = toCanvasPoint(e.clientX, e.clientY);
		const distToCore = Math.sqrt(
			Math.pow(point.x - core.x, 2) +
			Math.pow(point.y - core.y, 2)
		);

		if (distToCore < core.radius) {
			// Only respond to clicks if not currently in "hi" mode
			if (core.mode !== "hi") {
				// Switch to "hi" mode and start animation
				core.mode = "hi";
				core.textDisplay = "Hi";
				core.startTextAnimation();
				core.hasInteracted = true; // Set hasInteracted on first click too

				// Trigger click reaction animation
				core.clickReaction = true;
				core.clickReactionTime = 0;
				core.clickReactionIntensity = 0;

				// Add subtle particles burst on click
				addParticleBurst(point.x, point.y);
			}
		}
	});

	// Function to add particle burst on click
	function addParticleBurst(x, y) {
		// Create 12-18 particles that burst out from the click point
		const particleCount = 20 + Math.floor(Math.random() * 10);

		for (let i = 0; i < particleCount; i++) {
			const angle = (i / particleCount) * Math.PI * 2;
			const distance = 20 + Math.random() * 30;
			const speed = 2 + Math.random() * 3;
			const size = 1 + Math.random() * 2;
			const lifetime = 0.5 + Math.random() * 0.5; // seconds

			clickParticles.push({
				x: x,
				y: y,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				size: size,
				color: Math.floor(Math.random() * 5), // Random color from the palette
				opacity: 0.8,
				lifetime: lifetime,
				age: 0
			});
		}
	}

	// Array to hold click burst particles
	const clickParticles = [];

	// Window resize handler
	window.addEventListener('resize', () => {
		setCanvasSize();
		updateRestingCenter(Infinity);
		core.x = restingCenter.x;
		core.y = restingCenter.y;
		mouseX = restingCenter.x;
		mouseY = restingCenter.y;

		// Reset all elements
		createStarfield();
		createRings();

		// Reset particle positions
		particles.forEach(particle => {
			particle.x = restingCenter.x;
			particle.y = restingCenter.y;
		});
	});

	// Animation loop
	function animate(timestamp) {
		if (!lastTime) lastTime = timestamp;
		const elapsedMs = timestamp - lastTime;
		const deltaTime = Math.min(32, elapsedMs) / (1000/60);
		lastTime = timestamp;

		// Follow the circles as the scroll animation moves them into place.
		updateRestingCenter(elapsedMs);
	
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	
		// Draw pulsating starfield
		for (let star of starfield) {
			const pulse = Math.sin(Date.now() * star.pulseSpeed + star.pulsePhase);
			const pulseFactor = 1 + pulse * star.pulseAmount;

			const currentSize = star.baseSize * pulseFactor;
			const currentOpacity = star.baseOpacity * (0.8 + 0.2 * pulseFactor);

			ctx.beginPath();
			ctx.arc(star.x, star.y, currentSize, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
			ctx.fill();

			if (star.baseSize > 0.3) {
				ctx.beginPath();
				ctx.arc(star.x, star.y, currentSize * 2, 0, Math.PI * 2);
				const glow = ctx.createRadialGradient(
					star.x, star.y, currentSize * 0.5,
					star.x, star.y, currentSize * 2
				);
				glow.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity * 0.4})`);
				glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
				ctx.fillStyle = glow;
				ctx.fill();
			}
		}

		// Update elements
		rings.forEach(ring => ring.update(deltaTime));
		particles.forEach(particle => particle.update(deltaTime));
		core.update(deltaTime);

		// Draw elements
		// Click burst particles update and draw before other elements so they appear on top
		for (let i = clickParticles.length - 1; i >= 0; i--) {
			const p = clickParticles[i];
			p.age += deltaTime / 60; // Assuming 60fps for lifetime
			p.x += p.vx * deltaTime;
			p.y += p.vy * deltaTime;
			p.opacity = Math.max(0, p.opacity - (deltaTime / 60) / p.lifetime); // Fade out over lifetime

			if (p.opacity <= 0 || p.age >= p.lifetime) {
				clickParticles.splice(i, 1); // Remove old particles
				continue;
			}

			const particleColor = colorValues[p.color];
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(${particleColor.r}, ${particleColor.g}, ${particleColor.b}, ${p.opacity})`;
			ctx.fill();
		}


		rings.forEach(ring => ring.draw());
		renderParticleBatches();
		core.draw();

		// Continue animation
		requestAnimationFrame(animate);
	}

	// Start animation
	requestAnimationFrame(animate);
});


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
