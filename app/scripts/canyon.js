'use strict';

/* global window */

(function () {

    var sketches = window.sketches || {};
    window.sketches = sketches;

    var sketch = function (p) {

        var gaussNoiseLine = function (x1, y1, x2, y2) {
            
            var steps = 10;
            var xrange = Math.abs(x2 - x1);
            var yrange = y2 - y1;
            var xstep = xrange / steps;
            var ystep = yrange / steps;

            var xgaussFactor = 20;
            var ygaussFactor = 10;

            var linePoints = [];
            
            var lastx = x1;
            var lasty = y1;

            for (var i = 0; i < steps; i++) {
                var xn = xstep * i + p.randomGaussian() * xgaussFactor;
                var yn = ystep * i + y1 + p.randomGaussian() * ygaussFactor;
                // p.line(lastx, lasty, xn, yn);
                linePoints.push([lastx, lasty, xn, yn]);
                lastx = xn;
                lasty = yn;
            }

            // p.line(lastx, lasty, x2, y2);
            linePoints.push([lastx, lasty, x2, y2]);

            return linePoints;

        };

        var drawLine = function (points) {
            p.strokeWeight(1);
            points.forEach(function (line) {
                p.line.apply(this, line);
            });
        };

        var drawShape = function (lines1) {

            p.fill(255);
            p.strokeWeight(1);
            p.beginShape();
            lines1.forEach(function (line) {
                p.vertex(line[0], line[1]);
                p.vertex(line[2], line[3]);
            });
            p.vertex(460, 460);
            p.vertex(0, 460);
            p.endShape();
        };

        var interpolateBetweenLines = function (lines1, lines2, step) {
            
            var steps = 200;
            return lines1.map(function (line1, i) {
                var line2 = lines2[i];
                return line1.map(function (pt1, ii) {
                    var pt2 = line2[ii];
                    return pt1 + ((pt2 - pt1) / steps) * step;
                });
            });
        };

        var drawStripes = function (lines1) {

            lines1.forEach(function (line1) {
                
                var l1x1 = line1[0];
                var l1y1 = line1[1];
                var l1x2 = line1[2];
                var l1y2 = line1[3];

                var l1xrange = l1x2 - l1x1;
                var l1yrange = l1y2 - l1y1;
                
                var length = Math.sqrt(Math.pow(l1xrange, 2) + Math.pow(l1yrange, 2));
                var strokey = (l1yrange / length);
                
                // var strokeWeight = (strokey < 0 ? strokey * 0.5 : strokey) + 1;
                // p.strokeWeight(strokeWeight);
                // p.strokeCap(p.SQUARE);

                var fill = Math.max(0, Math.min(110 + strokey * 120, 255));

                p.fill(fill);
                p.beginShape();
                p.vertex(l1x1, l1y1);
                p.vertex(l1x2, l1y2);
                p.vertex(l1x2, l1y2 + 200);
                p.vertex(l1x1, l1y1 + 200);
                p.endShape();

                // var steps = length / stripeStep;
                // // var steps = 10;
                // // console.log(steps);
                // for (var j = 0; j < steps; j++) {
                //     var xn = l1x1 + l1xrange / steps * j;
                //     var yn = l1y1 + l1yrange / steps * j;
                //     // p.line(xn, yn, xn, yn + 200);
                // }

            });

        };

        var current = {
            lines: [],
        };

        var lines = 2 * 5;
        var ystep = 50;

        for (var i = 0; i < lines; i++) {
            var y = 460 / lines * i;
            current.lines.push([gaussNoiseLine(0, y, 460, y + ystep), gaussNoiseLine(0, y, 460, y + ystep), 0]);

        }
        // Override draw function, by default it will be called 60 times per second
        p.draw = function () {
            
            p.background(0, 0, 0, 0);

            var interpolatedLines = [];

            current.lines.forEach(function (lines) {
                
                if (lines[2] === 200) {
                    
                    lines[0] = lines[1];
                    var y1old = lines[0][0][1];
                    var y2old = lines[0][lines[0].length - 1][3];
                    // console.log(y1old, y2old, lines, lines[0].length - 1);
                    lines[1] = gaussNoiseLine(0, y1old, 460, y2old);
                    lines[2] = 0;
                }
                
                var line = interpolateBetweenLines(lines[0], lines[1], lines[2]);
                lines[2]++;
                interpolatedLines.push(line);
            });
            
            for (var i = 0; i < interpolatedLines.length; i += 2) {
                drawStripes(interpolatedLines[i]);
                drawShape(interpolatedLines[i + 1]);
                drawLine(interpolatedLines[i]);
            }
        };
    
        p.setup = function () {
            p.size(460, 460);
            p.frameRate(60);
            // p.noLoop();
            p.smooth();
            p.colorMode(p.HSB);
        };

    };


    var title = 'Canyon';
    var description = 'An attempt to create a canyion-like visualisation. The color is set according to the slope to create a light-impression.';

    sketches.canyon = {
        sketch: sketch,
        title: title,
        description: description
    };

})();
