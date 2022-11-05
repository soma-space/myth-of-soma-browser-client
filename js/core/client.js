/**
 * Client functions for managing the client files.
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import Thread from 'core/thread';
import Memory from 'core/memory';
import Renderer from 'renderer/renderer';
/**
 * Client object for namespace.
 */
const Client = {
  /**
   * Load a client file
   * @param {string} filename
   * @param {callback} [onLoad]
   * @param {callback} [onError]
   * @return {*} data
   */
  loadFile: (function() {
    const input = {
      filename: ''
    };

    function callback(data, error, input) {
      if (data && !error) {
        switch (input.filename.substr(-3)) {
          case 'spl':
          case 'obm':
            const frames = data.frames;
            const count = frames.length;
            const gl = Renderer.gl;
            if (data.header === 'SPL8') {
              for (let i = 0; i < count; i++) {
                frames[i].texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, frames[i].texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, frames[i].width, frames[i].height, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, frames[i].data);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
              }

              data.paletteTexture = gl.createTexture();
              gl.bindTexture(gl.TEXTURE_2D, data.paletteTexture);
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data.palette);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            } else {
              for (let i = 0; i < count; i++) {
                data.paletteTexture = null;
                frames[i].texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, frames[i].texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, frames[i].width, frames[i].height, 0, gl.RGB, gl.UNSIGNED_SHORT_5_6_5, frames[i].data);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
              }
            }

            break;
        }
      } else {
        console.error(`Sprite ${input.filename} failed to load with error: ${error}`);
      }

      Memory.set(input.filename, data, error);
    }

    return function(filename, onLoad, onError) {
      if (!Memory.exists(filename)) {
        input.filename = filename;
        Thread.send('LOAD', input, callback);
      }

      return Memory.get(filename, onLoad, onError);
    };
  }())
};

export default Client
