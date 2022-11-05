/**
 * Sprite Loader
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import BinaryReader from 'utils/binaryreader';

class Sprite {
  /**
   * Sprite constructor
   * @constructor
   * @this {Sprite}
   * @param {ArrayBuffer} buffer Sprite Data
   */
  constructor(buffer) {
    if (buffer) {
      this.load(buffer);
    }

    this.reader = null;
  }

  /**
   * Load the sprite from the buffer.
   * @param {ArrayBuffer} buffer Sprite Data
   */
  load(buffer) {
    const reader = new BinaryReader(buffer);
    this.reader = reader;

    this.header = reader.getString(4);
    if (this.header !== 'SPLN' && this.header !== 'SPL8') {
      throw new Error('Sprite.load Header ' + this.header + ' is not valid');
    }

    // skip remark and BMPFN.
    reader.skip(128);

    // Sprite sheet dimensions.
    this.width = reader.getUint32();
    this.height = reader.getUint32();

    this.colourKey = reader.getUint32();

    this.frameCount = reader.getUint32();
    this.frames = [];

    // skip sprTool
    reader.skip(24 * this.frameCount);

    if (this.header === 'SPL8') {
      this.readPalette();
      this.readIndexedFrames();
    } else {
      this.palette = null;
      this.readFrames();
    }
  }

  readPalette() {
    const reader = this.reader;

    // skip unknown
    reader.skip(4);

    const paletteSize = reader.getUint16();
    const palette = new Uint8Array(256 * 4);

    for (let i = 0; i < 256; i++) {
      palette[i * 4] = 255;
      palette[i * 4 + 1] = 0;
      palette[i * 4 + 2] = 255;
      palette[i * 4 + 3] = 0;
    }

    let paletteTransparentIndex = undefined;
    let missingTransparentIndex = true;

    for (let i = 0; i < paletteSize; i++) {
      const palettePixel = reader.getUint16();
      if (palettePixel === 0xf81f) {
        palette[i * 4] = 255;
        palette[i * 4 + 1] = 0;
        palette[i * 4 + 2] = 255;
        palette[i * 4 + 3] = 0;
        paletteTransparentIndex = i;
        missingTransparentIndex = false;
      } else {
        palette[i * 4] = (palettePixel & 0xF800) >> 11 << 3;
        palette[i * 4 + 1] = (palettePixel & 0x07E0) >> 5 << 2;
        palette[i * 4 + 2] = (palettePixel & 0x001F) << 3;
        palette[i * 4 + 3] = 255;
      }
    }

    if (missingTransparentIndex) {
      if (paletteSize < 256) {
        palette[paletteSize * 4] = 255;
        palette[paletteSize * 4 + 1] = 0;
        palette[paletteSize * 4 + 2] = 255;
        palette[paletteSize * 4 + 3] = 0;
        paletteTransparentIndex = paletteSize;
      } else {
        throw new Error(`Sprite does not have a transparent palette index set`);
      }
    }

    this.palette = palette;
    this.paletteTransparentIndex = paletteTransparentIndex;
  }

  readIndexedFrames() {
    const reader = this.reader;
    const frameCount = this.frameCount;
    const frames = this.frames;
    const paletteTransparentIndex = this.paletteTransparentIndex;
    const tell = reader.tell();

    let frameDataOffset = 0;

    for (let i = 0; i < frameCount; i++) {
      reader.seek(tell + (28 * i));

      const left = reader.getInt32();
      const top = reader.getInt32();
      const right = reader.getInt32();
      reader.getUint32();
      const lineCount = reader.getUint32();
      const dataSize = reader.getUint32();
      reader.getUint32();

      const data = new Uint8Array((right - left) * lineCount);

      reader.seek(tell + (28 * frameCount) + frameDataOffset);

      let index = 0;
      for (let j = 0; j < lineCount; j++) {
        const node = reader.getUint16();
        let x = 0;

        for (let k = 0; k < node; k++) {
          for (let zeroCount = reader.getUint16(); zeroCount > 0; zeroCount--, x++) {
            data[index] = paletteTransparentIndex;
            index += 1;
          }

          for (let pixelCount = reader.getUint16(); pixelCount > 0; pixelCount--, x++) {
            data[index] = reader.getUint8();
            index += 1;
          }
        }

        const padCount = right - left - x;
        for (let zeroCount = padCount; zeroCount > 0; zeroCount--) {
          data[index] = paletteTransparentIndex;
          index += 1;
        }
      }

      frameDataOffset += dataSize;

      frames.push({
        offsetX: left,
        offsetY: top,
        width: right - left,
        height: lineCount,
        data: data
      });
    }
  }

  readFrames() {
    const reader = this.reader;
    const frameCount = this.frameCount;
    const frames = this.frames;
    const tell = reader.tell();

    let frameDataOffset = 0;

    for (let i = 0; i < frameCount; i++) {
      reader.seek(tell + (28 * i));

      const left = reader.getInt32();
      const top = reader.getInt32();
      const right = reader.getInt32();
      reader.getInt32();
      const lineCount = reader.getUint32();
      const dataSize = reader.getUint32();
      reader.getUint32();

      const data = new Uint16Array((right - left) * lineCount);

      reader.seek(tell + (28 * frameCount) + frameDataOffset);

      let index = 0;
      for (let j = 0; j < lineCount; j++) {
        const node = reader.getUint16();
        let x = 0;

        for (let k = 0; k < node; k++) {
          for (let zeroCount = reader.getUint16(); zeroCount > 0; zeroCount--, x++) {
            data[index] = 0xF81F;
            index += 1;
          }

          for (let pixelCount = reader.getUint16(); pixelCount > 0; pixelCount--, x++) {
            data[index] = reader.getUint16();
            index += 1;
          }
        }

        const padCount = right - left - x;
        for (let zeroCount = padCount; zeroCount > 0; zeroCount--) {
          data[index] = 0xF81F;
          index += 1;
        }
      }

      frameDataOffset += dataSize;

      frames.push({
        offsetX: left,
        offsetY: top,
        width: right - left,
        height: lineCount,
        data: data
      });
    }
  }
}

export default Sprite;
