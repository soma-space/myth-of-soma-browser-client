/**
 * Entity
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import {pixelToCell, cellToPixel} from 'utils/positionconvert';

class Entity {
  /**
   * Entity constructor
   * @constructor
   * @this {Entity}
   */
  constructor() {
    this.x = 0;
    this.y = 0;
    this.cellX = 0;
    this.cellY = 0;
  }

  /**
   * Sets the pixel position and cell position of the entity using the given pixel position.
   * @param {number} pixelX - The X component of the pixel position.
   * @param {number} pixelY - The Y component of the pixel position.
   */
  setPosition(pixelX, pixelY) {
    var cellPosition = pixelToCell(pixelX, pixelY);
    this.x = pixelX;
    this.y = pixelY;
    this.cellX = cellPosition.x;
    this.cellY = cellPosition.y;
  }

  /**
   * Sets the pixel position and cell position of the entity using the given cell position.
   * @param {number} cellX - The X component of the cell position.
   * @param {number} cellY - The Y component of the cell position.
   */
  setCellPosition(cellX, cellY) {
    var pixelPosition = cellToPixel(cellX, cellY);
    this.x = pixelPosition.x;
    this.y = pixelPosition.y;
    this.cellX = cellX;
    this.cellY = cellY;
  }
}
export default Entity;
