/**
 * Renderer for sprite in 3D canvas context.
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import {createShaderProgram} from 'utils/webgl';
import Camera from 'renderer/camera';

/**
 * Vertex shader for rendering sprite.
 */
let _vertexShader = `attribute vec2 aPosition;
attribute vec2 aTextureCoordinates;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform vec4 uSpriteRect;
uniform vec3 uSpritePosition;
uniform vec2 uSpriteTextureSize;

varying vec2 vTextureCoordinates;

void main(void) {
 vTextureCoordinates = aTextureCoordinates;
 vTextureCoordinates.x = (vTextureCoordinates.x * (uSpriteRect[2] / uSpriteTextureSize[0])) + (uSpriteRect[0] / uSpriteTextureSize[0]);
 vTextureCoordinates.y = (vTextureCoordinates.y * (uSpriteRect[3] / uSpriteTextureSize[1])) + (uSpriteRect[1] / uSpriteTextureSize[1]);

 vec4 position = vec4(aPosition, 0.0, 1.0);
 position.x = (position.x * uSpriteRect[2]) + uSpritePosition[0];
 position.y = (position.y * uSpriteRect[3]) + uSpritePosition[1];
 position.z = uSpritePosition[2];

 gl_Position = uProjectionMatrix * uModelViewMatrix * position;
}`;

/**
 * Frgment shader for rendering sprite.
 */
let _fragmentShader = `varying vec2 vTextureCoordinates;

uniform sampler2D uDiffuse;
uniform sampler2D uPalette;

uniform bool uUsePalette;
uniform vec4 uColor;

void main(void) {
  vec4 indexedColor;
  if (uUsePalette) {
    float paletteWidthMul = 1.0 / 256.0;
    float index = texture2D(uDiffuse, vTextureCoordinates).r * 255.0;

    vec2 coord = vec2((index + 0.5) * paletteWidthMul, 0.5);
    indexedColor = texture2D(uPalette, coord);
  } else {
    indexedColor = texture2D(uDiffuse, vTextureCoordinates.st);
    if (indexedColor.rgb == vec3(1.0, 0.0, 1.0)) {
      indexedColor.a = 0.0;
    }
  }

  if (indexedColor.a < 0.5) {
    discard;
  }

  float gray = dot(indexedColor.rgb, vec3(0.299, 0.587, 0.114));
  indexedColor.rgb = mix(indexedColor.rgb, vec3(gray), 0.0);
  indexedColor.a = uColor.a;

  gl_FragColor = indexedColor;
}`;

/**
 * @var {GLArrayBuffer} Buffer used for rendering sprite
 */
let _buffer = null;

/**
 * @var {GLShaderProgram} Shader program used for rendering sprite
 */
let _program = null;

/**
 * @var {object} 3D Context
 */
let _gl = null;

/**
 * @var {object} 2D Context
 */
let _context = null;

/**
 * @var {object} Sprite position in 2D context
 */
let _position = new Int32Array(2);

/**
 * @var {object} The last texture used
 */
let _texture = null;

/**
 * @var {object} The last palette used
 */
let _palette = null;

/**
 * @var {boolean} If palette is being used for sprite or not
 */
let _usePalette = false;

const SpriteRenderer = {
  /**
   * @var {Float32Array[4]} Sprite color
   */
  color: new Float32Array(4),

  /**
   * @var {Float32Array[3]} Sprite position (x, y, z (depth))
   */
  position: new Float32Array(3),

  /**
   * @var {Float32Array[2]} Sprite position offset
   */
  offset: new Float32Array(2),

  /**
   * @var {Float32Array[2]} Sprite size
   */
  size: new Float32Array(2),

  /**
   * @var {Float32Array[2]} Sprite texture offset (for a sub rect of frame)
   */
  textureOffset: new Float32Array(2),

  /**
   * @var {object} Sprite frame image data
   */
  sprite: null,

  /**
   * @var {object} Sprite palette data
   */
  palette: null,

  /**
   * @var {object} Sprite image information
   */
  image: {
    texture: null,
    palette: null,
    size: new Float32Array(2)
  },

  /**
   * @var {function} Render function (assigned when bind a context)
   */
  render: null,

  initialize(gl) {
    _buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, _buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0, 0.0, 0.0, 0.0,
      1.0, 0.0, 1.0, 0.0,
      0.0, 1.0, 0.0, 1.0,
      1.0, 1.0, 1.0, 1.0
    ]), gl.STATIC_DRAW);

    _program = createShaderProgram(gl, _vertexShader, _fragmentShader);

    this.color[0] = 1.0;
    this.color[1] = 1.0;
    this.color[2] = 1.0;
    this.color[3] = 1.0;

    this.textureOffset[0] = 0;
    this.textureOffset[1] = 0;
  },

  /**
   * Bind 3D context
   * @param {object} webgl context.
   */
  bind3DContext(gl) {
    const attribute = _program.attribute;
    const uniform = _program.uniform;

    gl.useProgram(_program);

    gl.uniform1i(uniform.uDiffuse, 0);
    gl.uniform1i(uniform.uPalette, 1);

    gl.uniformMatrix4fv(uniform.uProjectionMatrix, false, Camera.projection);
    gl.uniformMatrix4fv(uniform.uModelViewMatrix, false, Camera.modelView);

    gl.enableVertexAttribArray(attribute.aPosition);
    gl.enableVertexAttribArray(attribute.aTextureCoordinates);

    gl.vertexAttribPointer(attribute.aPosition, 2, gl.FLOAT, false, 4 * 4, 0);
    gl.vertexAttribPointer(attribute.aTextureCoordinates, 2, gl.FLOAT, false, 4 * 4, 2 * 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, _buffer);

    _gl = gl;

    this.render = this.render3D;
  },

  /**
   * Unbind 3D context
   * @param {object} webgl context.
   */
  unbind3DContext(gl) {
    const attribute = _program.attribute;
    gl.disableVertexAttribArray(attribute.aPosition);
    gl.disableVertexAttribArray(attribute.aTextureCoordinates);
  },

  render3D() {
    if (!this.image.texture || !this.color[3]) {
      return;
    }

    const gl = _gl;
    const uniform = _program.uniform;
    const usePalette = this.image.palette !== null;

    gl.uniform4fv(uniform.uColor, this.color);

    if (usePalette && _palette != this.image.palette) {
      _palette = this.image.palette;
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, _palette);
      gl.activeTexture(gl.TEXTURE0);
    }

    if (_usePalette !== usePalette) {
      gl.uniform1i(uniform.uUsePalette, usePalette);
      _usePalette = usePalette
    }

    gl.uniform4f(uniform.uSpriteRect, this.textureOffset[0], this.textureOffset[1], this.size[0], this.size[1]);
    gl.uniform3f(uniform.uSpritePosition, this.position[0] + this.offset[0], this.position[1] + this.offset[1], this.position[2]);

    if (_texture != this.image.texture) {
      _texture = this.image.texture;
      gl.uniform2fv(uniform.uSpriteTextureSize, this.image.size);
      gl.bindTexture(gl.TEXTURE_2D, _texture);
    }

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  },

  /**
   * Bind 2D context
   */
  bind2DContext(context, x, y) {
    _context = context;
    _position[0] = x;
    _position[1] = y;

    this.render = this.render2D;
  },

  render2D: (function() {
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;
    const context = canvas.getContext('2d');
    let imageData = context.createImageData(canvas.width, canvas.height);

    return function() {
      const frame = this.sprite;

      const width = frame.width;
      const height = frame.height;

      if (width > canvas.width || height > canvas.height) {
        canvas.width = width;
        canvas.height = height;
        imageData = context.createImageData(width, height);
      }

      const input = frame.data;
      const output = imageData.data;
      const palette = this.palette;
      const outputWidth = canvas.width;
      const color = this.color;

      if (palette) {
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const index1 = (y * outputWidth + x) * 4;
            const index2 = input[y * width + x] * 4;
            output[index1 + 0] = palette[index2 + 0] * color[0];
            output[index1 + 1] = palette[index2 + 1] * color[1];
            output[index1 + 2] = palette[index2 + 2] * color[2];
            output[index1 + 3] = palette[index2 + 3] * color[3];
          }
        }
      } else {
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const index1 = (y * outputWidth + x) * 4;
            const index2 = (y * width + x) * 4;
            output[index1 + 0] = input[index2 + 0] * color[0];
            output[index1 + 1] = input[index2 + 1] * color[1];
            output[index1 + 2] = input[index2 + 2] * color[2];
            output[index1 + 3] = input[index2 + 3] * color[3];
          }
        }
      }

      context.putImageData(imageData, 0, 0, 0, 0, width, height);

      _context.save();
      _context.translate(_position[0], _position[1]);
      _context.drawImage(canvas, 0, 0, width, height);
      _context.restore();
    }
  }())
};

export default SpriteRenderer;
