"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/* global window, _ */

(function () {
    var sketches = window.sketches || {};
    window.sketches = sketches;

    var sketch = function (p) {
        var width = 940;
        var height = 240;

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

            _.range(steps).forEach(function (i) {
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
            var _this = this;
            p.strokeWeight(1);
            points.forEach(function (line) {
                return p.line.apply(_this, line);
            });
        };

        var drawShape = function (lines1, i) {
            p.fill(100 + i * 15);
            p.strokeWeight(1);
            p.beginShape();
            lines1.forEach(function (line) {
                p.vertex(line[0], line[1]);
                p.vertex(line[2], line[3]);
            });
            p.vertex(width, height);
            p.vertex(0, height);
            p.endShape();
        };

        var interpolateBetweenLines = function (lines1, lines2, step) {
            var steps = 200;
            return lines1.map(function (line1, i) {
                var line2 = lines2[i];
                return line1.map(function (pt1, ii) {
                    var pt2 = line2[ii];
                    return pt1 + (pt2 - pt1) / steps * step;
                });
            });
        };

        var drawStripes = function (lines1) {
            lines1.forEach(function (line1) {
                var _line1 = _slicedToArray(line1, 4);

                var l1x1 = _line1[0];
                var l1y1 = _line1[1];
                var l1x2 = _line1[2];
                var l1y2 = _line1[3];


                var l1xrange = l1x2 - l1x1;
                var l1yrange = l1y2 - l1y1;

                var length = Math.sqrt(Math.pow(l1xrange, 2) + Math.pow(l1yrange, 2));
                var strokey = l1yrange / length;

                p.strokeCap(p.SQUARE);

                var fill = Math.max(0, Math.min(110 + strokey * 120, 255));

                p.fill(0, 0, 0, 100 / 255 * fill);
                p.beginShape();
                p.vertex(l1x1, l1y1);
                p.vertex(l1x2, l1y2);
                p.vertex(l1x2, l1y2 + height);
                p.vertex(l1x1, l1y1 + height);
                p.endShape();

                // var steps = length / 5;
                // var steps = 10;
                // console.log(steps);
                // for (var j = 0; j < steps; j++) {
                //     var xn = l1x1 + l1xrange / steps * j;
                //     var yn = l1y1 + l1yrange / steps * j;
                //     p.line(xn, yn, xn, yn + 200);
                // }
            });
        };

        var current = {
            lines: [] };

        var lines = height / 50;
        var ystep = 50;

        for (var i = 0; i < lines; i++) {
            var y = height / lines * i;
            current.lines.push([gaussNoiseLine(0, y, width, y - ystep), gaussNoiseLine(0, y, width, y - ystep), 0]);
        }
        // Override draw function, by default it will be called 60 times per second
        p.draw = function () {
            p.background(80);

            var interpolatedLines = [];

            current.lines.forEach(function (lines) {
                if (lines[2] === 200) {
                    lines[0] = lines[1];
                    var y1old = lines[0][0][1];
                    var y2old = lines[0][lines[0].length - 1][3];
                    // console.log(y1old, y2old, lines, lines[0].length - 1);
                    lines[1] = gaussNoiseLine(0, y1old, width, y2old);
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
            p.size(width, height);
            p.frameRate(10);
            // p.noLoop();
            p.smooth();
            p.colorMode(p.RGB);
        };
    };


    var title = "Canyon";
    var description = "An attempt to create a canyion-like visualisation. The color is set according to the slope to create a light-impression.";

    sketches.canyon = {
        sketch: sketch,
        title: title,
        description: description
    };
})();

"use strict";

/* global window */

(function () {
    var sketches = window.sketches || {};
    window.sketches = sketches;

    var sketch = function (p) {
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
                state = "none";
            } else if (threshold > xRange && threshold > yRange) {
                state = "none";
            } else if (randomState <= 15) {
                state = threshold > xRange ? "x" : "y";
            } else if (randomState >= 15) {
                state = threshold > yRange ? "y" : "x";
            } else {
                state = "none";
            }

            rects[state].forEach(function (rect) {
                drawGreenRectangle.apply(this, rect);
            });

            rects[state].forEach(function (rect) {
                var args = rect.concat([depth + 1]);
                drawGreenFields.apply(this, args);
            });
        };

        var width = 940;
        var height = 240;

        p.setup = function () {
            p.size(width, height);
            // p.frameRate(1);
            p.noLoop();
            p.colorMode(p.HSB);
        };

        // Override draw function, by default it will be called 60 times per second
        p.draw = function () {
            drawGreenFields(0, 0, width, height, 0);
        };
    };

    var title = "Green Fields";
    var description = "Inspired by the great plains in the USA, this sketch tries to simulate fields.";

    sketches.greenFields = {
        sketch: sketch,
        title: title,
        description: description
    };
})();

"use strict";

/* global Processing, document, window, React, _ */

window.addEventListener("load", function () {
    var sketches = window.sketches || {};
    window.sketches = sketches;

    var ReactCanvas = React.createFactory(React.createClass({
        displayName: "reactCanvas",
        componentDidMount: function () {
            var el = this.getDOMNode();
            var processingInstance = new Processing(el, this.props.sketch.sketch);
        },
        componentWillUnmount: function () {
            return true;
        },
        render: function () {
            return React.createElement("canvas", {});
        }
    }));

    var SketchLiestView = React.createFactory(React.createClass({
        displayName: "SketchLiestView",
        render: function () {
            var that = this;
            /* jshint ignore:start */
            return React.createElement(
                "div",
                { className: "sketch" },
                React.createElement(
                    "div",
                    { className: "sketch_description" },
                    React.createElement(
                        "div",
                        { className: "sketch_description_main" },
                        that.props.sketch.title
                    ),
                    React.createElement(
                        "div",
                        { className: "sketch_description_sub" },
                        that.props.sketch.description
                    )
                ),
                React.createElement(
                    "div",
                    { className: "sketch_canvas" },
                    React.createElement(ReactCanvas, { sketch: that.props.sketch })
                )
            );
            /* jshint ignore:end */
        }
    }));

    var SketchFullscreen = React.createClass({
        displayName: "SketchFullscreen",
        render: function () {
            /* jshint ignore:start */
            var that = this;
            return React.createElement(
                "div",
                { className: "sketch sketch__fullscreen" },
                React.createElement(
                    "div",
                    { className: "sketch_description" },
                    React.createElement(
                        "div",
                        { className: "sketch_description_main" },
                        that.props.sketch.title
                    ),
                    React.createElement(
                        "div",
                        { className: "sketch_description_sub" },
                        that.props.sketch.description
                    )
                ),
                React.createElement(
                    "div",
                    { className: "sketch_canvas" },
                    React.createElement(ReactCanvas, { sketch: that.props.sketch })
                ),
                React.createElement(
                    "div",
                    { className: "sketch_source" },
                    that.props.sketch.sketch.toString()
                )
            );
            /* jshint ignore:end */
        }
    });

    var Sketch = React.createClass({
        displayName: "Sketch",
        componentDidMount: function () {
            this.getDOMNode().addEventListener("click", this.handleClick);
        },
        getInitialState: function () {
            return this.props.sketch;
        },
        handleClick: function () {
            this.setState({ fullscreen: !this.state.fullscreen });
        },
        componentWillUnmount: function () {
            this.getDOMNode.removeEventListener("click", this.handleClick);
        },
        componentDidUpdate: function () {
            return true;
        },
        render: function () {
            /* jshint ignore:start */
            console.log("render");
            var sketch = this.state.fullscreen ? React.createElement(SketchFullscreen, { sketch: this.state }) : React.createElement(SketchLiestView, { sketch: this.state });
            return React.createElement(
                "div",
                null,
                sketch
            );
            /* jshint ignore:end */
        }
    });

    var SketchList = React.createClass({
        displayName: "sketchList",
        render: function () {
            var sketches = this.props.sketches.map(function (sketch) {
                return new Sketch({ sketch: sketch });
            });

            /* jshint ignore:start */
            return React.createElement(
                "div",
                { className: "sketches" },
                sketches
            );
            /* jshint ignore:end */
        }
    });

    // iterate over all sketches
    var Sketches = React.createFactory(React.createClass({
        displayName: "sketches",
        getInitialState: function () {
            return {
                sketches: sketches
            };
        },
        render: function () {
            var that = this;
            var keys = Object.keys(that.state.sketches);
            var sketchArray = keys.map(function (k) {
                return _.extend({ key: k }, that.state.sketches[k]);
            });

            return new SketchList({ sketches: sketchArray });
        }
    }));

    React.render(new Sketches(), document.getElementById("react"));
});

"use strict";

/* global window, _ */

(function () {
    var sketches = window.sketches || {};
    window.sketches = sketches;

    var sketch = function (p) {
        var Point = (function () {
            function Point(x, y) {
                _classCallCheck(this, Point);

                this.x = x;
                this.y = y;
                this.xv = 0;
                this.yv = 0;
                this.maxSpeed = 30000000;
            }

            _prototypeProperties(Point, null, {
                update: {
                    value: function update() {
                        p.stroke(0, 16);
                        this.xv = Math.cos(p.noise(this.x * 0.01, this.y * 0.01) * Math.PI * 2);
                        this.yv = -Math.sin(p.noise(this.x * 0.01, this.y * 0.01) * Math.PI * 2);

                        if (this.x > width || this.y > height || this.x < 0 || this.y < 0) {
                            this.finished = true;
                        }

                        this.xv = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.xv));
                        this.yv = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.yv));

                        this.x += this.xv;
                        this.y += this.yv;
                        p.line(this.x + this.xv, this.y + this.yv, this.x, this.y);
                    },
                    writable: true,
                    configurable: true
                }
            });

            return Point;
        })();

        var points = [];
        var width = 940;
        var height = 240;

        p.setup = function () {
            p.size(width, height);
            // p.noLoop();
            p.frameRate(30);
            p.smooth();
            p.colorMode(p.HSB);
            addPoints(100);
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
            points = points.filter(function (point) {
                return !point.finished;
            });
            points.forEach(function (point) {
                return point.update();
            });
        };
    };

    var title = "Perlin";
    var description = "Perlin Noise.";

    sketches.perlin = {
        sketch: sketch,
        title: title,
        description: description
    };
})();

"use strict";

/* global window, _*/

(function () {
    var sketches = window.sketches || {};
    window.sketches = sketches;

    var sketch = function sketch(p) {
        var degToRad = function (deg) {
            return Math.PI / 360 * deg;
        };

        var toX = function (r, rad) {
            return r * Math.cos(rad);
        };

        var toY = function (r, rad) {
            return r * Math.sin(rad);
        };

        var drawQuad = function (x1, y1, x2, y2, l1, l2, rad) {
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

        var drawLine = function (x, y, radian, length) {
            var threshold = 5;
            var branches = p.random(2, 5);
            // var branches = 1;
            var strokeWeight = 0.08 * length;

            length *= p.random(8, 12) / 10;

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
            var step = radRange / branches;

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

        sketch.width = 940;
        sketch.height = 240;

        p.setup = function () {
            p.size(sketch.width, sketch.height);
            p.noLoop();
            // p.frameRate(1);
            p.smooth();
            p.colorMode(p.HSB);
        };

        // Override draw function, by default it will be called 60 times per second
        p.draw = function () {
            p.background(255, 0, 0, 0);
            var seperation = 100;
            var trees = sketch.width / seperation - 1;
            _.range(trees).forEach(function (i) {
                drawLine((i + 1) * seperation + p.random(-20, 20), sketch.height, -Math.PI / 2, sketch.height / 4 + p.random(0, 20));
            });
        };
    };

    var title = "Tree";
    var description = "A simple tree with sophisticated branching.";

    sketches.tree = {
        sketch: sketch,
        title: title,
        description: description
    };
})();
//# sourceMappingURL=all.js.map