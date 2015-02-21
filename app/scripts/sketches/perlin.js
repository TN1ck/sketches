'use strict';

/* global window, _ */

export var sketch = function (p) {

    sketch.config = {
        width: 940,
        height: 540,
        framerate: 30,
        points: 3000,
        stroke: {
            opacity: 30,
            color: [100, 100, 255]
        },
        velocity: {
            x: 1,
            y: 1
        },
        restart: function () {
            points = [];
            sketch.config.points = 3000;
            p.setup();
        },
        noise: {
            'x': 0.01,
            'y': 0.01
        },
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
    sketch.gui.add(sketch.config, 'restart');
    sketch.gui.add(sketch.config, 'add 500 points');
    sketch.gui.add(sketch.config, 'points', 0, 5000).step(1).listen();

    var color = sketch.gui.addFolder('Color');
    color.add(sketch.config.stroke, 'opacity', 0, 255);
    color.addColor(sketch.config.stroke, 'color');
    color.open();

    var velocity = sketch.gui.addFolder('Velocity');
    velocity.add(sketch.config.velocity, 'x', -5, 5);
    velocity.add(sketch.config.velocity, 'y', -5, 5);
    velocity.open();

    var noise = sketch.gui.addFolder('Noise');
    noise.add(sketch.config.noise, 'x', -0.5, 0.5);
    noise.add(sketch.config.noise, 'y', -0.5, 0.5);
    noise.open();


    class Point {
    
        constructor (x, y) {
            
            this.x = x;
            this.y = y;
            this.xv = 0;
            this.yv = 0;
            this.maxSpeed = 30000000;

        }

        update () {
        
            p.stroke(...sketch.config.stroke.color.concat([sketch.config.stroke.opacity]));
            this.xv =   Math.cos(p.noise(this.x * sketch.config.noise.x,
                                         this.y * sketch.config.noise.x) * Math.PI * 2) * sketch.config.velocity.x;
            this.yv = - Math.sin(p.noise(this.x * sketch.config.noise.y,
                                         this.y * sketch.config.noise.y) * Math.PI * 2) * sketch.config.velocity.y;

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
        p.colorMode(p.RGB);
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
