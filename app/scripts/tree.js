'use strict';

/* global window */

(function () {

    var sketches = window.sketches || {};
    window.sketches = sketches;

    var sketch = function (p) {

        var degToRad = function (deg) {
            return Math.PI / 360 * deg;
        };

        var drawLine = function(x, y, radian, length) {

            var threshold = 6;
            var branches = p.random(2, 5);
            var strokeWeight = 0.1 * length;

            length *= (p.random(8, 12) / 10);

            if (length < threshold) {
                return;
            }
            
            var minrad = -5;
            var maxrad = 5;

            var radD = degToRad(p.random(minrad, maxrad));
            // var radD = 0;

            var xD = length * Math.cos(radian + radD);
            var yD = length * Math.sin(radian + radD);

            var xN = xD + x;
            var yN = yD + y;

            p.strokeWeight(strokeWeight);
            p.line(x, y, xN, yN);

            var radRange = p.random(160, 200);

            var start = -radRange / 2;
            var step  = radRange / branches;
            
            var strokeStart = -strokeWeight / 2;
            var strokeStep = strokeWeight / branches;
            var strokeRad = radian + Math.PI / 4;

            for (var i = 1; i <= branches; i++) {
                
                var rad = start + step * i;
                var lengthD = strokeStart + strokeStep * i;

                var xDD = lengthD * Math.cos(strokeRad);
                var yDD = lengthD * Math.sin(strokeRad);

                drawLine(xN + xDD, yN + yDD, radian + radD + degToRad(rad), length / 1.5);
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
            p.background(255);
            drawLine(230, 460, -Math.PI / 2, 460 / 4);
        };
    };

    var title = 'Tree';
    var description = 'A simple tree with random branching.';

    sketches.tree = {
        sketch: sketch,
        title: title,
        description: description
    };

})();
