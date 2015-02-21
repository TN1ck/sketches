'use strict';

/* global window, _ */

export var sketch = function (p) {

    sketch.config = {
        width: 940,
        height: 540,
        framerate: 30,
        points: 1000,
        'stroke opacity': 30,
        noloop: false,
        'play/stop': function() {
            sketch.config.noloop = !sketch.config.noloop;
            if (sketch.config.noloop) {
                p.noLoop();
            } else {
                p.loop();
            }
        },
        'add 500 points': function() {
            sketch.config.points += 500;
        }
    };

    // create the gui
    sketch.gui = new dat.GUI({autoPlace: false});
    sketch.gui.add(sketch.config, 'play/stop');
    sketch.gui.add(sketch.config, 'add 500 points');
    sketch.gui.add(sketch.config, 'points', 0, 5000).step(1).listen();
    sketch.gui.add(sketch.config, 'stroke opacity', 0, 255);


    class Point {
    
        constructor (x, y) {
            
            this.x = x;
            this.y = y;
            this.xv = 0;
            this.yv = 0;
            this.maxSpeed = 30000000;

        }

        update () {
        
            p.stroke(0, sketch.config['stroke opacity']);
            this.xv =   Math.cos(p.noise(this.x * 0.01, this.y * 0.01) * Math.PI * 2);
            this.yv = - Math.sin(p.noise(this.x * 0.01, this.y * 0.01) * Math.PI * 2);

            if (this.x > sketch.config.width || this.y > sketch.config.height || this.x < 0 || this.y < 0) {
                this.finished = true;
            }

            this.xv = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.xv));
            this.yv = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.yv));
         
            this.x += this.xv;
            this.y += this.yv;
            p.line(this.x + this.xv, this.y + this.yv, this.x, this.y);

        }
    }

    var points = [];

    p.setup = function () {
        p.size(sketch.config.width, sketch.config.height);
        p.frameRate(sketch.config.framerate);
        // p.noLoop();
        p.smooth();
        p.colorMode(p.HSB);
        p.background(255, 0, 0, 0);
    };

    var addPoints = function (n) {
        _.times(n, function () {
            var x = p.random(0, sketch.config.width);
            var y = p.random(0, sketch.config.height);
            points.push(new Point(x, y));
        });
    };

    p.draw = function () {

        // add new points when necessary
        addPoints(sketch.config.points - points.length);

        points = points.filter((point, i) => {
            var finished = point.finished;
            if (finished) {
                sketch.config.points--;
                delete points[i];
            }
            return !finished
        });
        points.forEach(point => point.update());

    };
};

export var title = 'Perlin';
export var description = 'Perlin Noise.';
export var image = 'perlin.png';
export var key = 'perlin';
