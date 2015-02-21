'use strict';

import * as canyon      from './sketches/canyon';
import * as greenFields from './sketches/greenFields';
import * as tree        from './sketches/tree';
import * as perlin      from './sketches/perlin';

/* global Processing, document, window, React, _, superagent, hljs */

var request = superagent;

window.addEventListener('load', function () {

    var sketches = [perlin, tree, canyon, greenFields];
    var sketchesPath = '/sketches/app/scripts/sketches/';
    var imagePath = '/sketches/images/sketches/';

    var ReactCanvas = React.createClass({
        displayName: 'reactCanvas',
        getInitialState: function() {
            return {instance: false};
        },
        componentDidMount: function () {
            var el = this.getDOMNode();
            var canvas = el.querySelector('canvas');
            var gui = el.querySelector('.gui');
            this.state.instance = new Processing(canvas, this.props.sketch.sketch);
            gui.appendChild(this.props.sketch.sketch.gui.domElement);
        },
        omponentWillUnmount: function () {
            this.props.sketch.sketch.gui.destroy();
            this.state.instance.exit();
            delete this.state.instance;
            return true;
        },
        componentWillUnmount: function () {
            return true;
        },
        render: function () {
            return <div>
                <canvas></canvas>
                <div className={'gui'}></div>
            </div>
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


    var Sketch = React.createClass({
        displayName: 'Sketch',
        getInitialState: function() {
            return this.props.sketch;
        },
        handleClick: function() {
            this.setState({fullscreen: !this.state.fullscreen});
        },
        componentWillUnmount: function() {
            var el = this.getDOMNode().querySelector('.sketch_description_button');
            el.removeEventListener('click', this.handleClick);
        },
        componentDidMount: function() {
            var el = this.getDOMNode().querySelector('.sketch_description_button');
            el.addEventListener('click', this.handleClick);
            var that = this;
            request.get(sketchesPath + this.state.key + '.js', function(r) {
                that.setState({source: r.text})
            });
        },
        componentDidUpdate: function() {
            return true;
        },
        render: function() {

            var that = this;
            /* jshint ignore:start */
            var canvas = <img src={imagePath + that.props.sketch.image} />;
            var moreInfo = <div></div>;

            if (this.state.fullscreen) {
                canvas = <ReactCanvas sketch={that.props.sketch} />; 
                moreInfo = <div className='sketch_source'>
                    <h2>Code</h2>
                    <Highlight source={that.state.source} />
                </div>;
            }
                    
            return (
                <div className={this.state.fullscreen ? 'sketch sketch__fullscreen' : 'sketch'}>
                    <div className='sketch_description'>
                        <div className='sketch_description_main'>{that.props.sketch.title}</div>
                        <div className='sketch_description_sub'>{that.props.sketch.description}</div>
                        <div className='sketch_description_button'>{this.state.fullscreen ? 'close' : 'open'}</div>
                    </div>
                    <div className='sketch_canvas'>
                         {canvas}
                    </div>
                    {moreInfo}
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
