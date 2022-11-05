/**
 * An item that is in the memory cache.
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
class MemoryItem {
  /**
   * Callback for onLoad.
   * @callback MemmoryItem~onLoad
   * @param {*} result The file data.
   */
  /**
   * Callback for onError.
   * @callback MemmoryItem~onError
   * @param {string|null} error The error string or null if no error.
   */
  /**
   * MemmoryItem constructor
   * @constructor
   * @this {MemmoryItem}
   */
  constructor() {
    this._onLoad = [];
    this._onError = [];

    /**
     * Has the request for loading been completed
     * @var {boolean} complete
     */
    this.complete = false;

    /**
     * The cached data
     * @var {?}
     */
    this._data = null;

    /**
     * The error message
     * @var {string]
     */
    this._error = '';

    /**
     * The last time that the item was retrieved from the cache.
     * Will be used to determine if the item can be removed.
     * @var {number} lastTimeUsed
     */
    this.lastTimeUsed = 0;
  }

  /**
   * Retrieve data
   * @return {?} data
   */
  getData() {
    this.lastTimeUsed = Date.now();
    return this._data;
  }

  /**
   * Add callback for an event
   * @param {string} event
   * @param {function} callback
   */
  addEventListener(event, callback) {
    if (!(callback instanceof Function)) {
      throw new Error('MemmoryItem.addEventListener: callback param must be a function');
    }

    switch (event) {
      case 'load':
        if (this.complete && this._data) {
          callback(this._data);
          return;
        }
        this._onLoad.push(callback);
        break;
      case 'error':
        if (this.complete && this._error) {
          callback(this._error);
          return;
        }
        this.onError.push(callback);
        break;
      default:
        throw new Error('MemoryItem.addEventListener: does not support this event ' + event);
    }
  }

  /**
   * When an item is loaded.
   * @param {*} data
   */
  onLoad(data) {
    this._data = data;
    this.complete = true;
    this.lastTimeUsed = Date.now();

    const length = this._onLoad.length;
    for (let i = 0; i < length; ++i) {
      this._onLoad[i](data);
    }

    this._onLoad.length = 0;
    this._onError.length = 0;
  }

  /**
   * When an error happened during loading.
   * @param {string} error
   */
  onError(error) {
    this._error = error;
    this.complete = true;
    this.lastTimeUsed = Date.now();

    const length = this._onError.length;
    for (let i = 0; i < length; i++) {
      this._onError[i](error);
    }

    this._onLoad.length = 0;
    this._onError.length = 0;
  }
}
export default MemoryItem;
