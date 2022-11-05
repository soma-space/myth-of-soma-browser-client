/**
 * WebGL Utility Functions
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
function getWebGLContext(canvas) {
  const options = {
    preserveDrawingBuffer: true
  };

  let gl = null;
  try {
    gl = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
  } catch (e) {}

  if (!gl) {
    throw new Error('Unable to find a valid webgl context.');
    gl = null;
  }

  return gl;
}

function compileShader(gl, source, type) {
  const shader = gl.createShader(type);

  // Compile the shader
  gl.shaderSource(shader, `precision mediump float; ${source}`);
  gl.compileShader(shader);

  // Check for compile error
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);

    throw new Error(`Renderer::compileShader - Failed to compile shader: ${error}`);
  }

  return shader;
}

function createShaderProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  const vs = compileShader(gl, vertexShader, gl.VERTEX_SHADER);
  const fs = compileShader(gl, fragmentShader, gl.FRAGMENT_SHADER);

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  // Check the program linked
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);

    throw new Error(`Renderer::createShaderProgram - Failed to link program: ${error}`);
  }

  const attribCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  program.attribute = {};

  for (let i = 0; i < attribCount; i++) {
    const attrib = gl.getActiveAttrib(program, i);
    program.attribute[attrib.name] = gl.getAttribLocation(program, attrib.name);
  }

  const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  program.uniform = {};
  for (let i = 0; i < uniformCount; i++) {
    const uniform = gl.getActiveUniform(program, i);
    program.uniform[uniform.name] = gl.getUniformLocation(program, uniform.name);
  }

  return program;
}

export {getWebGLContext, createShaderProgram}
