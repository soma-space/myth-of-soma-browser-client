/**
 * Camera
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import glMatrix from 'lib/gl-matrix';

const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

/**
 * Camera object for namespace.
 */
const Camera = {

  /**
   * @var {mat4} projection Projection Matrix
   */
  projection: mat4.create(),

  /**
   * @var {mat4} modelView ModelView matrix
   */
  modelView: mat4.create(),

  /**
   * @var {vec3} position
   */
  position: vec3.create(),

  /**
   * @var {Entity} the entity the camera will follow
   */
  target: null,

  /**
   * Have the Camera follow an Entity
   */
  follow(target) {
    this.target = target;
  },

  /**
   * Update the camera
   */
  update(tick) {
    this.position[0] = -(this.target.x - (800 / 2));
    this.position[1] = -(this.target.y - (600 / 2));

    var matrix = this.modelView;
    mat4.identity(matrix);
    mat4.translate(matrix, matrix, this.position);
  }
};

export default Camera;
