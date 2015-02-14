'use strict';

/* global Processing, document, window, React */

window.addEventListener('load', function () {

    var sketches = window.sketches || {};
    window.sketches = sketches;

    var ReactCanvas = React.createFactory(React.createClass({
        displayName: 'reactCanvas',
        componentDidMount: function () {
            var el = this.getDOMNode();
            var processingInstance = new Processing(el, this.props.sketch.sketch);
        },
        componentWillUnmount: function () {
            return true;
        },
        render: function () {
            return React.createElement('canvas', {});
        }
    }));

    var Sketch = React.createFactory(React.createClass({
        displayName: 'sketch',
        render: function () {
            var that = this;
            return React.createElement('div', {className: 'sketch'}, [
                React.createElement('div', {className: 'sketch_description'}, [
                    React.createElement('div', {className: 'sketch_description_main'}, that.props.sketch.title),
                    React.createElement('div', {className: 'sketch_description_sub'}, that.props.sketch.description)
                ]),
                React.createElement('div', {className: 'sketch_canvas'}, new ReactCanvas({sketch: that.props.sketch}))
            ]);
        }
    }));

    // iterate over all sketches
    var Sketches = React.createFactory(React.createClass({
        displayName: 'sketches',
        getInitialState: function () {
            return sketches;
        },
        render: function () {
            var that = this;
            var keys = Object.keys(that.state);
            var sketchArray = keys.map(function (k) {
                return sketches[k];
            });
            return React.createElement('div', {className: 'sketches'}, sketchArray.map(function (sketch) {
                return new Sketch({sketch: sketch});
            }));
        }
    }));

    React.render(new Sketches(), document.getElementById('react'));

});
