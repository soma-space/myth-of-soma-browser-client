/**
 * TileMap Loader
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import BinaryReader from 'utils/binaryreader';

class TileMap {
  /**
   * TileMap constructor
   * @constructor
   * @this {TileMap}
   * @param {ArrayBuffer} buffer TileMap Data
   */
  constructor(buffer) {
    if (buffer) {
      this.load(buffer);
    }

    this.reader = null;
  }

  /**
   * Load the TileMap from the buffer.
   * @param {ArrayBuffer} buffer TileMap Data
   */
  load(buffer) {
    const reader = new BinaryReader(buffer);
    this.reader = reader;

    this.header = reader.getString(3);
    reader.skip(1);

    if (this.header !== 'GMD') {
      throw new Error('TileMap.load Header ' + this.header + ' is not valid');
    }

    // skip remark.
    reader.skip(64);

    // Tile Map Dimensions
    this.width = reader.getUint32();
    this.height = reader.getUint32();

    // skip block offsets because not using them.
    // 25 and 19 are the block tile width and height.
    reader.skip(436 + 4 * (Math.ceil(this.width / 25) * Math.ceil(this.height / 19)));

    /**
     * The TileMap total number of layers.
     * @var {number} layerCount
     */
    this.layerCount = 6;

    this.tiles = [];
    for (let i = 0; i < this.layerCount; ++i) {
      this.tiles[i] = [];
    }

    this.readTiles();
  }

  /**
   * Read the tiles from the buffer.
   */
  readTiles() {
    const reader = this.reader;
    const layerCount = this.layerCount;
    const blockWidth = 25;
    const blockHeight = 19;
    const blockX = Math.ceil(this.width / blockWidth);
    const blockY = Math.ceil(this.height / blockHeight);
    const blocks = blockX * blockY;
    const width = this.width;
    const tiles = this.tiles;

    for (let b = 0; b < blocks; ++b) {
      const minX = (b % blockX) * blockWidth;
      const minY = Math.floor((b / blockX)) * blockHeight;
      const maxX = minX + blockWidth;

      for (let l = 0; l < layerCount; l++) {
        let x = minX;
        let y = minY;

        const layer = tiles[l];

        const readCount = reader.getInt32();
        if (readCount === 0) {
          binary.seek(binary.tell() + 8);
          reader.getInt32();
          reader.getInt32();
        } else {
          // Amount of "Gaps" in the current block layer
          for (let r = 0; r < readCount; r++) {
            const skipCount = reader.getInt32();
            const tileCount = reader.getInt32();

            // Tiles to skip (No tile is there (empty))
            for (let s = 0; s < skipCount; s++) {
              layer[y * width + x] = -1;
              x += 1;
              if (x >= maxX) {
                x = minX;
                y += 1;
              }
            }

            for (let t = 0; t < tileCount; t++) {
              layer[y * width + x] = reader.getInt32();
              x += 1;
              if (x >= maxX) {
                x = minX;
                y += 1;
              }
            }
          }
        }
      }
    }
  }
}
export default TileMap;
