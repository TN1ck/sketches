'use strict';

/* global window, _ */

export var sketch = function (p) {

    class Point {
    
        constructor (x, y) {
            
            this.x = x;
            this.y = y;
            this.xv = 0;
            this.yv = 0;
            this.maxSpeed = 30000000;

        }

        update () {
        
            p.stroke(0, 16);
            this.xv =   Math.cos(p.noise(this.x * 0.01, this.y * 0.01) * Math.PI * 2);
            this.yv = - Math.sin(p.noise(this.x * 0.01, this.y * 0.01) * Math.PI * 2);

            if (this.x > width || this.y > height || this.x < 0 || this.y < 0) {
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
    var width = 940;
    var height = 240;

    p.setup = function () {
        p.size(width, height);
        p.frameRate(30);
        p.noLoop();
        p.smooth();
        p.colorMode(p.HSB);
        addPoints(100);
        p.background(255, 0, 0, 0);
    };

    var addPoints = function (n) {
        _.times(n, function () {
            var x = p.random(0, width);
            var y = p.random(0, height);
            points.push(new Point(x, y));
        });
    };


    p.draw = function () {

        points = points.filter(point => !point.finished);
        points.forEach(point => point.update());

    };
};

export var title = 'Perlin';
export var description = 'Perlin Noise.';
export var key = 'perlin';
