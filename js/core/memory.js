/**
 * Memory. Cache the data of loaded files and clean up data that is no longer being used.
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import MemoryItem from 'core/memoryitem';

/**
* @var {object} List of MemoryItem
*/
var _memory = {};

/**
* @var {number} Last time clean up happened.
*/
var _lastCleanUpTick = 0;

/**
* @var {number} Clean up interval
*/
var _cleanUpInterval = 30 * 1000;

/**
* @var {number} The time period for how long unused memory items will be kept
*/
var _keepTime = 2 * 60 * 1000;

/**
 * Memory object for namespace
 */
const Memory = {
  /**
   * Check if the filename exists in memory
   * @param {string} filename
   * @return {boolean} True if in memory otherwise False
   */
  exists(filename) {
    return filename in _memory;
  },

  /**
   * Retrieve data from memory
   * @param {string} filename
   * @param {callback} [onLoad]
   * @param {callback} [onError]
   * @return {*} data
   */
  get(filename, onLoad, onError) {
    if (!Memory.exists(filename)) {
      _memory[filename] = new MemoryItem();
    }

    const item = _memory[filename];

    if (onLoad) {
      item.addEventListener('load', onLoad);
    }

    if (onError) {
      item.addEventListener('error', onError);
    }

    return item.getData();
  },

  /**
   * Store data in memory
   * @param {string} filename
   * @param {*} data
   * @param {string} [error]
   */
  set(filename, data, error) {
    if (!Memory.exists(filename)) {
      _memory[filename] = new MemoryItem();
    }

    if (error || !data) {
      _memory[filename].onError(error);
    } else {
      _memory[filename].onLoad(data);
    }
  },

  /**
   * Clean the memory. Removes any unused memory items.
   * @param {object} gl WebGL Context
   * @param {number} now Tick
   */
  clean(gl, now) {
    if (_lastCleanUpTick + _cleanUpInterval > now) {
      return;
    }

    const keys = Object.keys(_memory);
    const count = keys.length;
    const tick = now - _keepTime;

    let list = [];

    for (let i = 0; i < count; ++i) {
      let item = _memory[keys[i]];
      if (item.complete && item.lastTimeUsed < tick) {
        this.remove(gl, keys[i]);
        list.push(keys[i]);
      }
    }

    if (list.length) {
      console.log('Memory.clean removed ' + list.length + ' unused items from memory', list);
    }

    _lastCleanUpTick = now;
  },

  /**
   * Remove data from memory
   * @param {object} gl WebGL Context
   * @param {string} filename
   */
  remove(gl, filename) {
    if (!this.exists(filename)) {
      return;
    }

    const file = this.get(filename);
    const ext = filename.match(/.[^\.]+$/).toString().substr(1).toLowerCase();

    if (file) {
      switch (ext) {
        case 'obm':
        case 'spl':
          if (file.frames) {
            const count = file.frames.length;
            for (let i = 0; i < count; ++i) {
              if (file.frames[i].texture && gl.isTexture(file.frames[i].texture)) {
                gl.deleteTexture(file.frames[i].texture);
              }
            }
          }

          if (file.paletteTexture && gl.isTexture(file.paletteTexture)) {
            gl.deleteTexture(file.paletteTexture);
          }

          break;
        default:
          if (file.match && file.match(/^blob\:/)) {
            URL.revokeObjectURL(file);
          }

          break;
      }
    }

    delete _memory[filename];
  }
};

export default Memory;
