'use strict';

import * as canyon      from './sketches/canyon';
import * as greenFields from './sketches/greenFields';
import * as tree        from './sketches/tree';
import * as perlin      from './sketches/perlin';

/* global Processing, document, window, React, _, superagent, hljs */

var request = superagent;

window.addEventListener('load', function () {

    var sketches = [canyon, greenFields, tree, perlin];
    var sketchesPath = '/app/scripts/sketches/';

    var ReactCanvas = React.createClass({
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
    });

    var Highlight = React.createClass({
        displayName: 'Highlight',
        highlightCode: function () {
            hljs.highlightBlock(this.getDOMNode().querySelector('code'));
        },
        componentDidMount: function() {
            this.highlightCode();
        },
        componentDidUpdate: function () {
            this.highlightCode();
        },
        render: function () {
            return (
                /* jshint ignore:start */
                <pre>
                    <code className='javascript'>
                        {this.props.source}
                    </code>
                </pre>
                /* jshint ignore:end */
            );
        }
    });

    var SketchLiestView = React.createClass({
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
    });

    var SketchFullscreen = React.createClass({
        displayName: 'SketchFullscreen',
        getInitialState: function() {
            return this.props.sketch;
        },
        componentDidMount: function() {
            var that = this;
            request.get(sketchesPath + this.state.key + '.js', function(r) {
                that.setState({source: r.text})
            });
        },
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
                        <h2>Code</h2>
                        <Highlight source={that.state.source} />
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

            /* jshint ignore:start */
            var sketches = this.props.sketches.map(sketch => <Sketch key={sketch.key} sketch={sketch} />);
            return <div className="sketches">{sketches}</div>;
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
            /* jshint ignore:start */
            return <SketchList sketches={sketches} />;
            /* jshint ignore:end */
        }
    }));

    React.render(new Sketches(), document.getElementById('react'));

});
