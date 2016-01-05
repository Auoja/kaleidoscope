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

    function renderSegment() {
        segmentCtx.moveTo(0, 0);
        segmentCtx.lineTo(segmentWidth, 0);
        segmentCtx.lineTo(segmentWidth * 0.5, segmentHeight);
        segmentCtx.closePath();
        segmentCtx.clip();

        var i = 0;
        for (i = 0; i < triangles; i++) {
            drawTriangle();
        }

        for (i = 0; i < circles; i++) {
            drawCircle();
        }

        for (i = 0; i < rectangles; i++) {
            drawRect();
        }

    }

    function getRandomFillColor() {
        var color = {
            r: Math.round(Math.random() * 255),
            g: Math.round(Math.random() * 255),
            b: Math.round(Math.random() * 255),
            a: 0.3 + Math.random() * 0.2
        };
        return "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a + ")";
    }

    function drawTriangle() {
        var startX = Math.round(Math.random() * segmentWidth);
        var startY = Math.round(Math.random() * segmentHeight);

        function getDelta() {
            var delta = 0.2 + Math.random() * 0.3;
            return delta - Math.random() * (2 * delta);
        }

        segmentCtx.beginPath()
        segmentCtx.fillStyle = getRandomFillColor();
        segmentCtx.moveTo(startX, startY);
        for ( var i = 0; i < 2; i++) {
            segmentCtx.lineTo(startX + segmentWidth * getDelta(), startY + segmentHeight * getDelta());
        }
        segmentCtx.closePath();
        segmentCtx.fill();
    }

    function drawCircle() {
        var startX = Math.round(Math.random() * segmentWidth);
        var startY = Math.round(Math.random() * segmentHeight);
        var delta = 0.1 + Math.random() * 0.3;

        segmentCtx.beginPath()
        segmentCtx.fillStyle = getRandomFillColor();
        segmentCtx.arc(startX, startY, segmentWidth * delta, 0, 2 * Math.PI);
        segmentCtx.closePath();
        segmentCtx.fill();
    }

    function drawRect() {
        var startX = Math.round(Math.random() * segmentWidth);
        var startY = Math.round(Math.random() * segmentHeight);

        function getDelta() {
            return delta = 0.1 + Math.random() * 0.3;
        }

        segmentCtx.fillStyle = getRandomFillColor();
        segmentCtx.fillRect(startX, startY, segmentWidth * getDelta(), segmentHeight * getDelta());
    }

    function renderKaleidoscope() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);
        for (var i = 0; i < segments; i+=2) {
            ctx.translate(0.5 * width, 0.5 * height);
            ctx.rotate(angle * i);
            ctx.translate(-0.5 * width, -0.5 * height);
            ctx.drawImage(segmentCanvas, 0.5 * (width - segmentWidth), (radius - segmentHeight));
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        for (var i = 1; i < segments; i+=2) {
            ctx.scale(-1, 1);
            ctx.translate(-0.5 * width, 0.5 * height);
            ctx.rotate(angle * -i);
            ctx.translate(0.5 * width, -0.5 * height);
            ctx.drawImage(segmentCanvas, -0.5 * (width - segmentWidth) - segmentWidth, (radius - segmentHeight));
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }

    this.render = function() {
        renderSegment();
        renderKaleidoscope();
    };
    return this;
};
