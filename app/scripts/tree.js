'use strict';

/* global window */

(function () {

    var sketches = window.sketches || {};
    window.sketches = sketches;

    var sketch = function (p) {

        var degToRad = function (deg) {
            return Math.PI / 360 * deg;
        };

        var toX = function(r, rad) {
            return r * Math.cos(rad);
        };

        var toY = function(r, rad) {
            return r * Math.sin(rad);
        };

        var drawQuad = function(x1, y1, x2, y2, l1, l2, rad) {
            
            p.fill(0);
            p.stroke(0, 0, 0, 0);

            var radOrt = rad + Math.PI / 2;
            var ln = l1 / 2;
            var cs = [];
            
            cs.push(x1 + toX(ln, radOrt));
            cs.push(y1 + toY(ln, radOrt));
            cs.push(x1 + toX(-ln, radOrt));
            cs.push(y1 + toY(-ln, radOrt));
            
            ln = l2 / 2;
            cs.push(x2 + toX(-ln, radOrt));
            cs.push(y2 + toY(-ln, radOrt));
            cs.push(x2 + toX(ln, radOrt));
            cs.push(y2 + toY(ln, radOrt));

            p.quad.apply(this, cs);
        };

        var drawLine = function(x, y, radian, length) {

            var threshold = 5;
            var branches = p.random(2, 5);
            // var branches = 1;
            var strokeWeight = 0.08 * length;

            length *= (p.random(8, 12) / 10);

            if (length < threshold) {
                return;
            }
            
            var minrad = -5;
            var maxrad = 5;

            var radD = degToRad(p.random(minrad, maxrad));
            // var radD = 0;

            var rN = radian + radD;

            var xD = toX(length, rN);
            var yD = toY(length, rN);

            var xN = xD + x;
            var yN = yD + y;

            p.strokeWeight(strokeWeight * 0.4);
            if (strokeWeight < 2) {
                p.strokeWeight(strokeWeight);
                p.line(x, y, xN, yN);
            } else {
                drawQuad(x, y, xN, yN, strokeWeight, strokeWeight / 2, rN);
            }

            var radRange = p.random(180, 220);

            var start = -radRange / 1.7; // no idea why it looks better than with 2
            var step  = radRange / branches;

            for (var i = 1; i <= branches; i++) {
                
                var rad = start + step * i;

                var randomLength = p.random(-length / 3);

                var xNN = xN + toX(randomLength, rN);
                var yNN = yN + toY(randomLength, rN);
                var rNN = rN + degToRad(rad);

                // the first branch will be drawn directly on top of the last one
                if (i === Math.ceil(branches / 2)) {
                    xNN = xN;
                    yNN = yN;
                }

                drawLine(xNN, yNN, rNN, length / 1.5);
            }
        };

        p.setup = function () {
            p.size(460, 460);
            p.noLoop();
            // p.frameRate(1);
            p.smooth();
            p.colorMode(p.HSB);
        };

       // Override draw function, by default it will be called 60 times per second
        p.draw = function () {
            p.background(255, 0, 0, 0);
            drawLine(230, 460, -Math.PI / 2, 460 / 4);
        };
    };

    var title = 'Tree';
    var description = 'A simple tree with sophisticated branching.';

    sketches.tree = {
        sketch: sketch,
        title: title,
        description: description
    };

})();
