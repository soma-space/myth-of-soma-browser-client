/**
 * TileSet Loader
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import BinaryReader from 'utils/binaryreader';

class TileSet {
  /**
   * TileSet constructor
   * @constructor
   * @this {TileSet}
   * @param {ArrayBuffer} buffer TileSet Data
   */
  constructor(buffer) {
    if (buffer) {
      this.load(buffer);
    }

    this.reader = null;
  }

  /**
   * Load the TileSet from the buffer.
   * @param {ArrayBuffer} buffer TileSet Data
   */
  load(buffer) {
    this.reader = new BinaryReader(buffer);
    this.tileSets = new Array(100);
    this.readTileSets();
  }

  /**
   * Read the tileSets from the buffer.
   */
  readTileSets() {
    const reader = this.reader;
    const tileSets = this.tileSets;
    const tileSetCount = 100;
    for (let i = 0; i < tileSetCount; i++) {
      // skip remark.
      reader.skip(64);

      tileSets[i] = {
        tileSheetFilename: reader.getString(64),
        colorKey: reader.getUint32()
      };

      if (tileSets[i].tileSheetFilename !== '') {
        const subTileSetCount = reader.getUint32();
        tileSets[i].subTileSets = new Array(subTileSetCount);

        for (let j = 0; j < subTileSetCount; j++) {
          // skip remark.
          reader.skip(64);

          tileSets[i].subTileSets[j] = {};
          const subTileSet = tileSets[i].subTileSets[j];

          // SubTileSet Dimensions.
          subTileSet.width = reader.getUint32();
          subTileSet.height = reader.getUint32();

          subTileSet.animationCount = reader.getUint32();

          // skip pnFlags
          reader.skip(subTileSet.width * subTileSet.height * 4);

          const tileCount = subTileSet.width * subTileSet.height;
          subTileSet.tiles = new Array(tileCount);

          for (let k = 0; k < tileCount; k++) {
            subTileSet.tiles[k] = {
              x: reader.getUint32(),
              y: reader.getUint32()
            };
          }

          if (subTileSet.animationCount > 1) {
            // skip animation data
            reader.skip(subTileSet.animationCount);
          }
        }
      }
    }
  }
}
export default TileSet;
