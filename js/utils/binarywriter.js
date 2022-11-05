/**
 * Write Binary Data
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
class BinaryWriter {
  /**
   * BinaryWriter constructor
   * @constructor
   * @this {BinaryWriter}
   * @param byteLength Length of the buffer
   */
  constructor(byteLength) {
    this.buffer = new Uint8Array(byteLength);
    this.length = byteLength;
    this.view = new DataView(this.buffer.buffer);
    this.offset = 0;
  }

  /**
   * Write a signed 8-bit integer to the buffer
   * @return {number} the value read
   */
  setInt8(value) {
    this.view.setInt8(this.offset, value);
    this.offset += 1;
  }

  /**
   * Write an unsigned 8-bit integer to the buffer
   * @param {number} value
   */
  setUint8(value) {
    this.view.setUint8(this.offset, value);
    this.offset += 1;
  }

  /**
   * Write a signed 16-bit integer to the buffer
   * @param {number} value
   */
  setInt16(value) {
    this.view.setInt16(this.offset, value, true);
    this.offset += 2;
  }

  /**
   * Write an unsigned 16-bit integer to the buffer
   * @param {number} value
   */
  setUint16(value) {
    this.view.setUint16(this.offset, value, true);
    this.offset += 2;
  }

  /**
   * Write a signed 32-bit integer to the buffer
   * @param {number} value
   */
  setInt32(value) {
    this.view.setInt32(this.offset, value, true);
    this.offset += 4;
  }

  /**
   * Write an unsigned 32-bit integer to the buffer
   * @param {number} value
   */
  setUint32(value) {
    this.view.setUint32(this.offset, value, true);
    this.offset += 4;
  }

  /**
   * Write a 32-bit float to the buffer
   * @param {number} value
   */
  setFloat32() {
    this.view.setFloat32(this.offset, value, true);
    this.offset += 4;
  }

  /**
   * Write a 64-bit float to the buffer
   * @param {number} value
   */
  setFloat64() {
    this.view.setFloat64(this.offset, value, true);
    this.offset += 8;
  }

  /**
   * Write a binary string to the buffer
   * @param {string} str
   */
  setString(str) {
    const length = str.length;
    for (let i = 0; i < length; i++) {
      this.view.setUint8(this.offset + i, str.charCodeAt(i) & 0xff);
    }

    this.offset += length;
  }

  /**
   * Return the current position
   * @return {number} position
   */
  tell() {
    return this.offset;
  }

  /**
   * Change the current position
   */
  seek(byteOffset) {
    this.offset = byteOffset;
  }

  /**
   * Advance the current position
   */
  skip(byteLength) {
    this.seek(this.offset + byteLength);
  }
}
export default BinaryWriter;
