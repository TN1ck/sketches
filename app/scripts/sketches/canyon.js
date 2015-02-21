'use strict';

/* global window, _, gui */

export var sketch = function sketch (p) {

    sketch.config = {
        width: 940,
        height: 540,
        framerate: 30,
        noloop: false,
        'play/stop': function() {
            sketch.config.noloop = !sketch.config.noloop;
            if (sketch.config.noloop) {
                p.noLoop();
            } else {
                p.loop();
            }
        },
        gaussFactorX: 20,
        gaussFactorY: 10,
        lineSteps: 10,
        lineSeperator: 50,
        animation: 200
    };

    // create the gui
    
    sketch.gui = new dat.GUI({autoPlace: false});

    sketch.gui.add(sketch.config, 'play/stop');
    sketch.gui.add(sketch.config, 'animation', 50, 400);

    var gaussNoiseLine = function (x1, y1, x2, y2) {
        
        var steps = sketch.config.lineSteps;
        var xgaussFactor = sketch.config.gaussFactorX;
        var ygaussFactor = sketch.config.gaussFactorY;
        
        var xrange = Math.abs(x2 - x1);
        var yrange = y2 - y1;
        var xstep = xrange / steps;
        var ystep = yrange / steps;
        var linePoints = [];
        
        var lastx = x1;
        var lasty = y1;

        _.times(steps, i => {
            var xn = xstep * i + p.randomGaussian() * xgaussFactor;
            var yn = ystep * i + y1 + p.randomGaussian() * ygaussFactor;
            // p.line(lastx, lasty, xn, yn);
            linePoints.push([lastx, lasty, xn, yn]);
            lastx = xn;
            lasty = yn;
        });

        // p.line(lastx, lasty, x2, y2);
        linePoints.push([lastx, lasty, x2, y2]);

        return linePoints;

    };

    var drawLine = function (points) {
        p.strokeWeight(1);
        points.forEach(line => p.line.apply(this, line));
    };

    var drawShape = function (lines1, i) {

        if (!lines1) {
            return;
        }

        p.fill(100 + i * 15);
        p.strokeWeight(1);
        p.beginShape();
        
        lines1.forEach(line => {
            var [x1, y1, x2, y2] = line;
            p.vertex(x1, y1);
            p.vertex(x2, y2);
        });

        p.vertex(sketch.config.width, sketch.config.height);
        p.vertex(0, sketch.config.height);
        p.endShape();

    };

    var interpolateBetweenLines = function (lines1, lines2, step) {
        
        var steps = sketch.config.animation;
        return lines1.map(function (line1, i) {
            var line2 = lines2[i];
            return line1.map(function (pt1, ii) {
                var pt2 = line2[ii];
                return pt1 + ((pt2 - pt1) / steps) * step;
            });
        });

    };

    var drawStripes = function (lines) {

        lines.forEach(line => {
            
            var [x1, y1, x2, y2] = line;

            var xrange = x2 - x1;
            var yrange = y2 - y1;
            
            var length = Math.sqrt(Math.pow(xrange, 2) + Math.pow(yrange, 2));
            var strokey = (yrange / length);

            p.strokeCap(p.SQUARE);

            var fill = Math.max(0, Math.min(110 + strokey * 120, 255));

            p.fill(0, 0, 0, 100 / 255 * fill);
            p.beginShape();
            p.vertex(x1, y1);
            p.vertex(x2, y2);
            p.vertex(x2, y2 + sketch.config.height);
            p.vertex(x1, y1 + sketch.config.height);
            p.endShape();

            // var steps = length / 5;
            // var steps = 10;
            // console.log(steps);
            // for (var j = 0; j < steps; j++) {
            //     var xn = x1 + xrange / steps * j;
            //     var yn = y1 + yrange / steps * j;
            //     p.line(xn, yn, xn, yn + 200);
            // }

        });

    };

    sketch.state = {
        lines: []
    };

    var lines = sketch.config.height / sketch.config.lineSeperator;
    var ystep = sketch.config.lineSeperator;

    for (var i = 0; i < lines; i++) {
        var y = sketch.config.height / lines * i;
        var args = [0, y, sketch.config.width, y - ystep]
        sketch.state.lines.push([
            gaussNoiseLine(...args),
            gaussNoiseLine(...args), 0
        ]);

    }

    p.draw = function () {
        
        p.background(80);

        var interpolatedLines = [];

        sketch.state.lines.forEach(lines => {
            
            // animation is done, create a new line
            if (lines[2] >= sketch.config.animation) {
                
                lines[0] = lines[1];
                var y1old = lines[0][0][1];
                var y2old = lines[0][lines[0].length - 1][3];
                lines[1] = gaussNoiseLine(0, y1old, sketch.config.width, y2old);
                lines[2] = 0;

            }

            var line = interpolateBetweenLines(lines[0], lines[1], lines[2]);
            lines[2]++;
            interpolatedLines.push(line);
        });

        for (var i = 0; i < interpolatedLines.length; i += 2) {
            drawStripes(interpolatedLines[i]);
            drawShape(interpolatedLines[i + 1], i);
            drawLine(interpolatedLines[i]);
        }

    };

    p.setup = function () {
        p.size(sketch.config.width, sketch.config.height);
        p.frameRate(sketch.config.framerate);
        // p.noLoop(sketch.config.noloop);
        p.smooth();
        p.colorMode(p.RGB);
    };

};

export var title = 'Canyon';
export var description = `An attempt to create a canyion-like visualisation.
                          The color is set according to the slope to create a light-impression.`;
export var image = 'canyon.png'
export var key = 'canyon';
