'use strict';

/* global window, _ */

(function () {

    var sketches = window.sketches || {};
    window.sketches = sketches;

    var sketch = function (p) {

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
        var width = 460;
        var height = 460;

        p.setup = function () {
            p.size(460, 460);
            // p.noLoop();
            p.frameRate(30);
            p.smooth();
            p.colorMode(p.HSB);
            addPoints(10000);
            p.background(255, 0, 0, 0);
        };

        var addPoints = function (n) {
            _.each(_.range(n), function () {
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

    var title = 'Perlin';
    var description = 'Perlin Noise.';

    sketches.perlin = {
        sketch: sketch,
        title: title,
        description: description
    };

})();
