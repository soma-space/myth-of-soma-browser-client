/**
 * Animation Loader
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import BinaryReader from 'utils/binaryreader';

class Animation {
  /**
   * Animation constructor
   * @constructor
   * @this {Animation}
   * @param {ArrayBuffer} buffer Animation Data
   */
  constructor(buffer) {
    if (buffer) {
      this.load(buffer);
    }

    this.reader = null;
  }

  /**
   * Load the Animation file from the buffer.
   * @param {ArrayBuffer} buffer Animation Data
   */
  load(buffer) {
    this.reader = new BinaryReader(buffer);

    this.header = this.reader.getString(4);
    if (this.header !== 'ANI') {
      throw new Error('Animation.load Header ' + this.header + ' is not valid');
    }

    // skip remark
    this.reader.skip(64);

    this.animations = [];
    this.readAnimations();
  }

  /**
   * Read the animations from the buffer.
   */
  readAnimations() {
    try {
      const reader = this.reader;
      const animations = this.animations;

      const directionCount = reader.getUint32();
      const animationCount = reader.getUint32();

      for (let i = 0; i < animationCount; i++) {
        animations.push({});

        // skip name and flag
        reader.skip(36);

        let framesPerSec = reader.getFloat32();
        if (!framesPerSec) {
          framesPerSec = 10;
        }

        animations[i].delay = 1000 / framesPerSec;

        animations[i].frames = [];

        const frameCount = reader.getInt32();
        animations[i].length = frameCount;

        // skip frame pointer
        reader.skip(4);

        for (let j = 0, count = frameCount * directionCount; j < count; j++) {
          animations[i].frames[j] = reader.getInt16();
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
}
export default Animation;
