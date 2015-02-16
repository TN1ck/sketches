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
            /* jshint ignore:start */
            return (
                <div className='sketch'>
                    <div className='sketch_description'>
                        <div className='sketch_description_main'>{that.props.sketch.title}</div>
                        <div className='sketch_description_sub'>{that.props.sketch.description}</div>
                    </div>
                    <div className='sketch_canvas'>
                        <ReactCanvas sketch={that.props.sketch} />
                    </div>
                </div>
            );
            /* jshint ignore:end */
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
            /* jshint ignore:start */
            return (
                <div className="sketches">
                    {sketchArray.map(sketch => new Sketch({sketch: sketch}))}
                </div>
            );
            /* jshint ignore:end */
        }
    }));

    React.render(new Sketches(), document.getElementById('react'));

});
