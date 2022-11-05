/**
 * Renderer
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import glMatrix from 'lib/gl-matrix';
import Camera from 'renderer/camera';
import {getWebGLContext} from 'utils/webgl';
import Mouse from 'controls/mouse';

const Renderer = {
  /**
   * @var {boolean} If the renderer is currently rendering
   */
  rendering: false,

  /**
   * @var {function[]} callbacks to call when rendering
   */
  renderCallbacks: [],

  /*
   * Initialize Renderer
   */
  initialize() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0px';
    this.canvas.style.left = '0px';
    this.canvas.style.zIndex = 0;
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.canvas.style.width = 800 + 'px';
    this.canvas.style.height = 600 + 'px';
    document.body.appendChild(this.canvas);

    const gl = getWebGLContext(this.canvas);
    this.gl = gl;

    Mouse.screen.width = 800;
    Mouse.screen.height = 600;

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    glMatrix.mat4.ortho(Camera.projection, 0, this.canvas.width, this.canvas.height, 0, -100, 100);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendEquation(gl.FUNC_ADD);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  },

  _clear() {
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  },

  /**
   * Render the Scene
   */
  _render() {
    requestAnimFrame(this._render.bind(this));

    this.tick = Date.now();

    for (let i = 0, count = this.renderCallbacks.length; i < count; i++) {
      this.renderCallbacks[i](this.gl, this.tick);
    }
  },

  /**
   * Callback for render.
   * @callback Renderer~onRender
   * @param {object} GL context.
   * @param {number} Tick.
   */
  /**
   * Add a callback to call to do rendering
   * @param {Renderer~onRender} callback called when rendering.
   */
  render(callback) {
    if (callback) {
      this.renderCallbacks.push(callback);

      if (!this.rendering) {
        this.rendering = true;
        this._render();
      }
    }
  },

  /**
   * Stop rendering a callback or all.
   */
  stop(callback) {
    if (!callback) {
      this.renderCallbacks.length = 0;
    } else {
      const index = this.renderCallbacks.indexOf(callback);
      if (index != -1) {
        this.renderCallbacks.splice(index, 1);
      }
    }
  }
};

export default Renderer;
