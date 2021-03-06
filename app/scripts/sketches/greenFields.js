'use strict';

/* global window */

export var sketch = function (p) {

    sketch.config = {
        width: 940,
        height: 540,
        framerate: 2,
        noloop: true,
        'play/stop': function() {
            sketch.config.noloop = !sketch.config.noloop;
            if (sketch.config.noloop) {
                p.noLoop();
            } else {
                p.loop();
            }
        },
    };

    // create the gui
    sketch.gui = new dat.GUI({autoPlace: false});
    sketch.gui.add(sketch.config, 'play/stop');

    var drawGreenRectangle = function (x1, y1, x2, y2) {
        p.fill(p.random(50, 100), p.random(100, 255), p.random(180, 220));
        p.stroke(180);
        p.quad(x1, y1, x1, y2, x2, y2, x2, y1);
    };

    var drawGreenFields = function (x1, y1, x2, y2, depth) {
        var border = 0;
        var threshold = 50;
        var randomRange = 30;

        var randomState = p.random(0, randomRange);

        x1 += border;
        y1 += border;
        x2 -= border;
        y2 -= border;

        var xRange = Math.abs(x1 - x2);
        var yRange = Math.abs(y1 - y2);

        var xn = p.random(x1, x2);
        var yn = p.random(y1, y2);

        var rects = {
            x: [[x1, y1, x2, yn], [x1, yn, x2, y2]],
            y: [[x1, y1, xn, y2], [xn, y1, x2, y2]],
            none: []
        };

        var state;
        if (depth > 20) {
            state = 'none';
        } else if (threshold > xRange && threshold > yRange) {
            state = 'none';
        } else if (randomState <= 15) {
            state = threshold > xRange ? 'x' : 'y';
        } else if (randomState >= 15) {
            state = threshold > yRange ? 'y' : 'x';
        } else {
            state = 'none';
        }

        rects[state].forEach(function(rect) {
            drawGreenRectangle.apply(this, rect);
        });

        rects[state].forEach(function (rect) {
            var args = rect.concat([depth + 1]);
            drawGreenFields.apply(this, args);
        });

    };

    p.setup = function () {
        p.size(sketch.config.width, sketch.config.height);
        p.frameRate(sketch.config.framerate);
        p.noLoop();
        p.colorMode(p.HSB);
    };

   // Override draw function, by default it will be called 60 times per second
    p.draw = function () {
        drawGreenFields(0, 0, sketch.config.width, sketch.config.height, 0);
    };
};

export var title = 'Green Fields';
export var description = 'Inspired by the great plains in the USA, this sketch tries to simulate fields.';
export var image = 'greenFields.png'
export var key = 'greenFields';