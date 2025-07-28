const androidScrollPathDesktop = {
	curviness: 0,
	autoRotate: false,
	values: [{ x: 20 * widthPercent, y: -25 * heightPercent }],
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
	TweenLite.to('#java', 3, {
		bezier: elasticScrollPathDesktop,
		ease: Power0.easeNone,
	}),
	3
);

tweenTimeLineAndroidElastic.add(
	TweenLite.to('#javascript', 3, {
		bezier: logstashScrollPathDesktop,
		ease: Power0.easeNone,
	}),
	6
);

tweenTimeLineAndroidElastic.add(
	TweenLite.to('#jet', 3, {
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


// canvas neural network
var neural = document.getElementById("neural");

// Set fixed width and height (adjust as needed)
var w = neural.width = 600,
    h = neural.height = 400,
    ctx = neural.getContext('2d'),

    opts = {
        range: 180,
        baseConnections: 3,
        addedConnections: 5,
        baseSize: 5,
        minSize: 1,
        dataToConnectionSize: .4,
        sizeMultiplier: .7,
        allowedDist: 40,
        baseDist: 40,
        addedDist: 30,
        connectionAttempts: 100,

        dataToConnections: 1,
        baseSpeed: .04,
        addedSpeed: .05,
        baseGlowSpeed: .4,
        addedGlowSpeed: .4,

        rotVelX: .003,
        rotVelY: .002,

        repaintColor: 'rgba(0,0,0,0)', // transparent background
        connectionColor: 'hsla(200,60%,light%,alp)',
        rootColor: 'hsla(0,60%,light%,alp)',
        endColor: 'hsla(160,20%,light%,alp)',
        dataColor: 'hsla(40,80%,light%,alp)',

        wireframeWidth: .1,
        wireframeColor: '#88f',

        depth: 250,
        focalLength: 250,
        vanishPoint: {
            x: w / 2,
            y: h / 2
        }
    },

    squareRange = opts.range * opts.range,
    squareAllowed = opts.allowedDist * opts.allowedDist,
    mostDistant = opts.depth + opts.range,
    sinX = sinY = 0,
    cosX = cosY = 0,

    connections = [],
    toDevelop = [],
    data = [],
    all = [],
    tick = 0,
    animating = false,
    Tau = Math.PI * 2;

ctx.clearRect(0, 0, w, h); // clear without painting background
ctx.fillStyle = '#ccc';
ctx.font = '20px Verdana';
ctx.fillText('Calculating Nodes', w / 2 - ctx.measureText('Calculating Nodes').width / 2, h / 2 - 15);

window.setTimeout(init, 4); // delay to show loading

function init() {
    connections.length = 0;
    data.length = 0;
    all.length = 0;
    toDevelop.length = 0;

    var connection = new Connection(0, 0, 0, opts.baseSize);
    connection.step = Connection.rootStep;
    connections.push(connection);
    all.push(connection);
    connection.link();

    while (toDevelop.length > 0) {
        toDevelop[0].link();
        toDevelop.shift();
    }

    if (!animating) {
        animating = true;
        anim();
    }
}

function Connection(x, y, z, size) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.size = size;
    this.screen = {};
    this.links = [];
    this.isEnd = false;
    this.glowSpeed = opts.baseGlowSpeed + opts.addedGlowSpeed * Math.random();
}

Connection.prototype.link = function () {
    if (this.size < opts.minSize)
        return this.isEnd = true;

    var links = [],
        connectionsNum = opts.baseConnections + Math.random() * opts.addedConnections | 0,
        attempt = opts.connectionAttempts,
        alpha, beta, len, cosA, sinA, cosB, sinB,
        pos = {},
        passedExisting, passedBuffered;

    while (links.length < connectionsNum && --attempt > 0) {
        alpha = Math.random() * Math.PI;
        beta = Math.random() * Tau;
        len = opts.baseDist + opts.addedDist * Math.random();

        cosA = Math.cos(alpha);
        sinA = Math.sin(alpha);
        cosB = Math.cos(beta);
        sinB = Math.sin(beta);

        pos.x = this.x + len * cosA * sinB;
        pos.y = this.y + len * sinA * sinB;
        pos.z = this.z + len * cosB;

        if (pos.x * pos.x + pos.y * pos.y + pos.z * pos.z < squareRange) {
            passedExisting = true;
            passedBuffered = true;
            for (var i = 0; i < connections.length; ++i)
                if (squareDist(pos, connections[i]) < squareAllowed)
                    passedExisting = false;
            if (passedExisting)
                for (var i = 0; i < links.length; ++i)
                    if (squareDist(pos, links[i]) < squareAllowed)
                        passedBuffered = false;
            if (passedExisting && passedBuffered)
                links.push({ x: pos.x, y: pos.y, z: pos.z });
        }
    }

    if (links.length === 0)
        this.isEnd = true;
    else {
        for (var i = 0; i < links.length; ++i) {
            var pos = links[i],
                connection = new Connection(pos.x, pos.y, pos.z, this.size * opts.sizeMultiplier);
            this.links[i] = connection;
            all.push(connection);
            connections.push(connection);
        }
        for (var i = 0; i < this.links.length; ++i)
            toDevelop.push(this.links[i]);
    }
};

Connection.prototype.step = function () {
    this.setScreen();
    this.screen.color = (this.isEnd ? opts.endColor : opts.connectionColor)
        .replace('light', 30 + ((tick * this.glowSpeed) % 30))
        .replace('alp', 0.2 + (1 - this.screen.z / mostDistant) * 0.8);

    for (var i = 0; i < this.links.length; ++i) {
        ctx.moveTo(this.screen.x, this.screen.y);
        ctx.lineTo(this.links[i].screen.x, this.links[i].screen.y);
    }
};

Connection.rootStep = function () {
    this.setScreen();
    this.screen.color = opts.rootColor
        .replace('light', 30 + ((tick * this.glowSpeed) % 30))
        .replace('alp', (1 - this.screen.z / mostDistant) * 0.8);

    for (var i = 0; i < this.links.length; ++i) {
        ctx.moveTo(this.screen.x, this.screen.y);
        ctx.lineTo(this.links[i].screen.x, this.links[i].screen.y);
    }
};

Connection.prototype.draw = function () {
    ctx.fillStyle = this.screen.color;
    ctx.beginPath();
    ctx.arc(this.screen.x, this.screen.y, this.screen.scale * this.size, 0, Tau);
    ctx.fill();
};

function Data(connection) {
    this.glowSpeed = opts.baseGlowSpeed + opts.addedGlowSpeed * Math.random();
    this.speed = opts.baseSpeed + opts.addSpeed * Math.random();
    this.screen = {};
    this.setConnection(connection);
}

Data.prototype.reset = function () {
    this.setConnection(connections[0]);
    this.ended = 2;
};

Data.prototype.step = function () {
    this.proportion += this.speed;
    if (this.proportion < 1) {
        this.x = this.ox + this.dx * this.proportion;
        this.y = this.oy + this.dy * this.proportion;
        this.z = this.oz + this.dz * this.proportion;
        this.size = (this.os + this.ds * this.proportion) * opts.dataToConnectionSize;
    } else this.setConnection(this.nextConnection);

    this.screen.lastX = this.screen.x;
    this.screen.lastY = this.screen.y;
    this.setScreen();
    this.screen.color = opts.dataColor
        .replace('light', 40 + ((tick * this.glowSpeed) % 50))
        .replace('alp', 0.2 + (1 - this.screen.z / mostDistant) * 0.6);
};

Data.prototype.draw = function () {
    if (this.ended) return --this.ended;
    ctx.beginPath();
    ctx.strokeStyle = this.screen.color;
    ctx.lineWidth = this.size * this.screen.scale;
    ctx.moveTo(this.screen.lastX, this.screen.lastY);
    ctx.lineTo(this.screen.x, this.screen.y);
    ctx.stroke();
};

Data.prototype.setConnection = function (connection) {
    if (connection.isEnd) return this.reset();
    this.connection = connection;
    this.nextConnection = connection.links[connection.links.length * Math.random() | 0];
    this.ox = connection.x;
    this.oy = connection.y;
    this.oz = connection.z;
    this.os = connection.size;
    this.nx = this.nextConnection.x;
    this.ny = this.nextConnection.y;
    this.nz = this.nextConnection.z;
    this.ns = this.nextConnection.size;
    this.dx = this.nx - this.ox;
    this.dy = this.ny - this.oy;
    this.dz = this.nz - this.oz;
    this.ds = this.ns - this.os;
    this.proportion = 0;
};

Connection.prototype.setScreen = Data.prototype.setScreen = function () {
    var x = this.x, y = this.y, z = this.z;
    var Y = y; y = y * cosX - z * sinX; z = z * cosX + Y * sinX;
    var Z = z; z = z * cosY - x * sinY; x = x * cosY + Z * sinY;
    this.screen.z = z;
    z += opts.depth;
    this.screen.scale = opts.focalLength / z;
    this.screen.x = opts.vanishPoint.x + x * this.screen.scale;
    this.screen.y = opts.vanishPoint.y + y * this.screen.scale;
};

function squareDist(a, b) {
    var x = b.x - a.x, y = b.y - a.y, z = b.z - a.z;
    return x * x + y * y + z * z;
}

function anim() {
    window.requestAnimationFrame(anim);
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, w, h); // clear canvas

    ++tick;
    var rotX = tick * opts.rotVelX,
        rotY = tick * opts.rotVelY;
    cosX = Math.cos(rotX);
    sinX = Math.sin(rotX);
    cosY = Math.cos(rotY);
    sinY = Math.sin(rotY);

    if (data.length < connections.length * opts.dataToConnections) {
        var datum = new Data(connections[0]);
        data.push(datum);
        all.push(datum);
    }

    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    ctx.lineWidth = opts.wireframeWidth;
    ctx.strokeStyle = opts.wireframeColor;
    all.map(function (item) { item.step(); });
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    all.sort(function (a, b) { return b.screen.z - a.screen.z; });
    all.map(function (item) { item.draw(); });
}
