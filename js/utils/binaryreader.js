/**
 * Read Binary Data
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
class BinaryReader {
  /**
   * BinaryReader constructor
   * @constructor
   * @this {BinaryReader}
   * @param buffer Buffer of type ArrayBuffer, or Uint8Array
   */
  constructor(buffer) {
    if (buffer instanceof Uint8Array) {
      buffer = buffer.buffer;
    } else if (!buffer instanceof ArrayBuffer) {
      throw new TypeError('BinaryReader buffer type is not supported');
    }

    this.buffer = buffer;
    this.length = buffer.byteLength;
    this.view = new DataView(this.buffer);
    this.offset = 0;
  }

  /**
   * Read a signed 8-bit integer from the buffer
   * @return {number} the value read
   */
  getInt8() {
    const value = this.view.getInt8(this.offset);
    this.offset += 1;
    return value;
  }

  /**
   * Read an unsigned 8-bit integer from the buffer
   * @return {number} the value read
   */
  getUint8() {
    const value = this.view.getUint8(this.offset);
    this.offset += 1;
    return value;
  }

  /**
   * Read a signed 16-bit integer from the buffer
   * @return {number} the value read
   */
  getInt16() {
    const value = this.view.getInt16(this.offset, true);
    this.offset += 2;
    return value;
  }

  /**
   * Read an unsigned 16-bit integer from the buffer
   * @return {number} the value read
   */
  getUint16() {
    const value = this.view.getUint16(this.offset, true);
    this.offset += 2;
    return value;
  }

  /**
   * Read a signed 32-bit integer from the buffer
   * @return {number} the value read
   */
  getInt32() {
    const value = this.view.getInt32(this.offset, true);
    this.offset += 4;
    return value;
  }

  /**
   * Read an unsigned 32-bit integer from the buffer
   * @return {number} the value read
   */
  getUint32() {
    const value = this.view.getUint32(this.offset, true);
    this.offset += 4;
    return value;
  }

  /**
   * Read a 32-bit float from the buffer
   * @return {number} the value read
   */
  getFloat32() {
    const value = this.view.getFloat32(this.offset, true);
    this.offset += 4;
    return value;
  }

  /**
   * Read a 64-bit float from the buffer
   * @return {number} the value read
   */
  getFloat64() {
    const value = this.view.getFloat64(this.offset, true);
    this.offset += 8;
    return value;
  }

  /**
   * Read a binary string from the buffer
   * @return {string} the string read
   */
  getString(length) {
    const offset = this.offset;
    let value = '';
    for (let i = 0; i < length; i++) {
      let uint8 = this.getUint8();
      if (uint8 === 0) {
        break;
      }

      value += String.fromCharCode(uint8);
    }

    this.offset = offset + length;
    return value;
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
export default BinaryReader;
