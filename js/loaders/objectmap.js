/**
 * ObjectMap Loader
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import BinaryReader from 'utils/binaryreader';

class ObjectMap {
  /**
   * ObjectMap constructor
   * @constructor
   * @this {ObjectMap}
   * @param {ArrayBuffer} buffer ObjectMap Data
   */
  constructor(buffer) {
    if (buffer) {
      this.load(buffer);
    }

    this.reader = null;
  }

  /**
   * Load the ObjectMap from the buffer.
   * @param {ArrayBuffer} buffer ObjectMap Data
   */
  load(buffer) {
    this.reader = new BinaryReader(buffer);

    this.objectMapObjects = [];
    this.objectMapFileNames = [];

    /**
     * The total number of map object sprite files that can be used.
     * @var {number} fileNameCount.
     */
    this.fileNameCount = 64;

    /**
     * The length of each filename.
     * @var {number} fileNameLength.
     */
    this.fileNameLength = 64;

    this.readObjectMap();
  }

  /**
   * Read the object map from the buffer.
   */
  readObjectMap() {
    const reader = this.reader;
    const objectMapFileNames = this.objectMapFileNames;
    const objectMapObjects = this.objectMapObjects;

    reader.skip(4);

    for (let i = 0; i < 1; i++) {
      // skip ID and remark.
      reader.skip(68);

      // read
      this.width = reader.getUint32();
      this.height = reader.getUint32();

      objectMapFileNames[i] = new Array(this.fileNameCount);

      for (let j = 0; j < this.fileNameCount; j++) {
        objectMapFileNames[i][j] = {
          animation: reader.getString(this.fileNameLength),
          sprite: null
        };
      }

      for (let j = 0; j < this.fileNameCount; j++) {
        objectMapFileNames[i][j].sprite = reader.getString(this.fileNameLength);
      }

      const objectCount = reader.getUint32();
      objectMapObjects[i] = new Array(objectCount);
      for (let j = 0; j < objectCount; j++) {
        const key = reader.getInt32();
        const spriteLocator = reader.getInt16();
        reader.skip(2);
        objectMapObjects[i][j] = {key, spriteLocator};
      }
    }
  }
}
export default ObjectMap;
