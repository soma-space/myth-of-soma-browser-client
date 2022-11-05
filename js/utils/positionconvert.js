/**
 * Position Conversion Utility Functions
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */

/**
 * Convert cell position to pixel position.
 * @param {number} x The X component of the cell position.
 * @param {number} y The Y component of the cell position.
 * @returns {object} Contains x and y converted pixel position.
 */
function cellToPixel(x, y) {
  return {x: (x + 1) * 48,
          y: (y + 1) * 24};
}

/**
 * Convert the pixel position to cell position.
 * @param {number} x The X component of the pixel position.
 * @param {number} y The Y component of the pixel position.
 * @returns {object} Contains x and y converted cell position.
 */
function pixelToCell(x, y) {
  const sizeX = 48;
  const sizeY = 24;

  const k1 = Math.ceil((0.5 * x + y - sizeY) / sizeX) * sizeX + sizeY;
  const k2 = Math.ceil((-0.5 * x + y + sizeY) / sizeX) * sizeX - sizeY;

  x = Math.max(0, (Math.floor((k1 - k2) / sizeY + 0.5) * sizeY) / sizeX - 1);
  y = Math.max(0, (Math.floor(((k1 + k2) / 2 - sizeY) / sizeY + 0.5) * sizeY) / sizeY - 1);

  return {x, y};
}

export {cellToPixel, pixelToCell}
