'use strict';

/* global Processing, document, window, React, _ */

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

    var SketchLiestView = React.createFactory(React.createClass({
        displayName: 'SketchLiestView',
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

    var SketchFullscreen = React.createClass({
        displayName: 'SketchFullscreen',
        render: function () {
            /* jshint ignore:start */
            var that = this;
            return (
                <div className='sketch sketch__fullscreen'>
                    <div className='sketch_description'>
                        <div className='sketch_description_main'>{that.props.sketch.title}</div>
                        <div className='sketch_description_sub'>{that.props.sketch.description}</div>
                    </div>
                    <div className='sketch_canvas'>
                        <ReactCanvas sketch={that.props.sketch} />
                    </div>
                    <div className='sketch_source'>
                        {that.props.sketch.sketch.toString()}
                    </div>
                </div>
            );
            /* jshint ignore:end */
        }
    });

    var Sketch = React.createClass({
        displayName: 'Sketch',
            componentDidMount: function () {
            this.getDOMNode().addEventListener('click', this.handleClick);
        },
        getInitialState: function() {
            return this.props.sketch;
        },
        handleClick: function() {
            this.setState({fullscreen: !this.state.fullscreen});
        },
        componentWillUnmount: function() {
            this.getDOMNode.removeEventListener('click', this.handleClick);
        },
        componentDidUpdate: function() {
            return true;
        },
        render: function() {
            /* jshint ignore:start */
            console.log('render');
            var sketch = this.state.fullscreen ? <SketchFullscreen sketch={this.state} /> : <SketchLiestView sketch={this.state} />;
            return (
                <div>
                     {sketch}
                </div>
            );
            /* jshint ignore:end */
        }
    });

    var SketchList = React.createClass({
        displayName: 'sketchList',
        render: function() {

            var sketches = this.props.sketches.map(sketch => new Sketch({sketch: sketch}));
            
            /* jshint ignore:start */
            return (
                 <div className="sketches">{sketches}</div>
            );
            /* jshint ignore:end */
        }
    });

    // iterate over all sketches
    var Sketches = React.createFactory(React.createClass({
        displayName: 'sketches',
        getInitialState: function () {
            return {
                sketches: sketches
            };
        },
        render: function () {
            var that = this;
            var keys = Object.keys(that.state.sketches);
            var sketchArray = keys.map(k => {
                return _.extend({key: k}, that.state.sketches[k]);
            });

            return new SketchList({sketches: sketchArray});
        }
    }));

    React.render(new Sketches(), document.getElementById('react'));

});
