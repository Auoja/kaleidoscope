var Kaleidoscope = function(canvas, size, segments, triangles, circles, rectangles) {
    var ctx = canvas.getContext('2d');

    var segmentCanvas = document.createElement('canvas');
    var segmentCtx = segmentCanvas.getContext('2d');

    var width = canvas.width = size;
    var height = canvas.height = size;

    var angle = (2 * Math.PI) / segments;
    var radius = segmentCanvas.height = height * 0.5;
    var segmentWidth = segmentCanvas.width = radius * Math.sqrt(2 - 2 * Math.cos(angle));
    var segmentHeight = Math.sqrt(radius * radius - (segmentWidth * segmentWidth) / 4);

    var entities = [];

    var frame = 0;

    function setupSegment() {
        segmentCtx.moveTo(0, 0);
        segmentCtx.lineTo(segmentWidth, 0);
        segmentCtx.lineTo(segmentWidth * 0.5, segmentHeight);
        segmentCtx.closePath();
        segmentCtx.clip();

        var i = 0;

        for (i = 0; i < triangles; i++) {
            entities.push(new Triangle(segmentWidth, segmentHeight));
        }

        for (i = 0; i < circles; i++) {
            entities.push(new Circle(segmentWidth, segmentHeight));
        }

        for (i = 0; i < rectangles; i++) {
            entities.push(new Rectangle(segmentWidth, segmentHeight));
        }

        for (var k, l, m = entities.length; m; k = Math.floor(Math.random() * m), l = entities[--m], entities[m] = entities[k], entities[k] = l);
    }

    function renderSegment() {
        segmentCtx.fillStyle = "black";
        segmentCtx.fillRect(0, 0, segmentCanvas.width, segmentCanvas.height);

        for (var i = 0; i < entities.length; i++) {
            entities[i].draw(segmentCtx, frame);
        }
    }

    function renderKaleidoscope() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);

        var i = 0;
        for (i = 0; i < segments; i += 2) {
            ctx.translate(0.5 * width, 0.5 * height);
            ctx.rotate(angle * i);
            ctx.translate(-0.5 * width, -0.5 * height);
            ctx.drawImage(segmentCanvas, 0.5 * (width - segmentWidth), (radius - segmentHeight) + 3);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        for (i = 1; i < segments; i += 2) {
            ctx.scale(-1, 1);
            ctx.translate(-0.5 * width, 0.5 * height);
            ctx.rotate(angle * -i);
            ctx.translate(0.5 * width, -0.5 * height);
            ctx.drawImage(segmentCanvas, -0.5 * (width - segmentWidth) - segmentWidth, (radius - segmentHeight) + 3);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        // ctx.drawImage(segmentCanvas, 0.5 * (width - segmentWidth), (radius - segmentHeight));
    }

    function renderFrame() {
        renderSegment();
        renderKaleidoscope();
    }

    this.render = function() {
        setupSegment();
        setInterval(function() {
            frame++;
            if (frame >= 360) {
                frame = 0;
            }
            renderFrame();
        }, 16);
    };
    return this;
};

var Entity = function(width, height) {
    this.center = {
        x: Math.round(Math.random() * width),
        y: Math.round(Math.random() * height)
    };
    this.width = width;
    this.height = height;
    this.direction = Math.random() < 0.5 ? -1 : 1;
    this.rate = 0.5 + 0.5 * Math.random();

    this.color = {
        r: Math.round(Math.random() * 255),
        g: Math.round(Math.random() * 255),
        b: Math.round(Math.random() * 255),
        a: 0.6 + Math.random() * 0.2
    };

    this.counter = 0;
};

Entity.prototype.getFillColor = function() {
    return "rgba(" + this.color.r + ", " + this.color.g + ", " + this.color.b + ", " + this.color.a + ")";
};

Entity.prototype.rotateContext = function(context) {
    this.counter++;

    if (this.counter * this.rate >= 360) {
        this.counter = 0;
    }

    var angle = this.direction * this.counter * this.rate * Math.PI/180;

    context.translate(this.center.x, this.center.y);
    context.rotate(angle);
    context.translate(-this.center.x, -this.center.y);
};

var Circle = function(width, height) {
    Entity.call(this, width, height);

    this.x = Math.round(Math.random() * width);
    this.y = Math.round(Math.random() * height);
    this.radius = Math.min(width, height) * (0.1 + Math.random() * 0.2);
};

Circle.prototype = Object.create(Entity.prototype);

Circle.prototype.draw = function(context, frame) {
    this.rotateContext(context);

    context.beginPath();
    context.fillStyle = this.getFillColor();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.closePath();
    context.fill();

    context.setTransform(1, 0, 0, 1, 0, 0);
};

var Triangle = function(width, height) {
    Entity.call(this, width, height);

    var deltaX = getDelta();
    var deltaY = getDelta();

    this.p1 = {
        x: Math.round(Math.random() * width),
        y: Math.round(Math.random() * height)
    };

    this.p2 = {
        x: this.p1.x + width * deltaX,
        y: this.p1.y + height * deltaY
    };

    this.p3 = {
        x: this.p1.x - width * deltaX,
        y: this.p1.y + height * deltaY
    };

    function getDelta() {
        return 0.1 + Math.random() * 0.1;
    }
};

Triangle.prototype = Object.create(Entity.prototype);

Triangle.prototype.draw = function(context, frame) {
    this.rotateContext(context);

    context.beginPath();
    context.fillStyle = this.getFillColor();
    context.moveTo(this.p1.x, this.p1.y);
    context.lineTo(this.p2.x, this.p2.y);
    context.lineTo(this.p3.x, this.p3.y);
    context.closePath();
    context.fill();

    context.setTransform(1, 0, 0, 1, 0, 0);
};

var Rectangle = function(width, height) {
    Entity.call(this, width, height);

    this.x = Math.round(Math.random() * width);
    this.y = Math.round(Math.random() * height);
    this.width = width * getDelta();
    this.height = height * getDelta();

    function getDelta() {
        return 0.1 + Math.random() * 0.2;
    }
};

Rectangle.prototype = Object.create(Entity.prototype);

Rectangle.prototype.draw = function(context, frame) {
    this.rotateContext(context);

    context.fillStyle = this.getFillColor();
    context.fillRect(this.x, this.y, this.width, this.height);

    context.setTransform(1, 0, 0, 1, 0, 0);

};
