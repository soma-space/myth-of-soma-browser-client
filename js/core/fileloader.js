/**
 * File Loading
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import FileSystem from 'core/filesystem';
import Sprite from 'loaders/sprite';
import Animation from 'loaders/animation';
import TileMap from 'loaders/tilemap';
import TileSet from 'loaders/tileset';
import ObjectMap from 'loaders/objectmap';

/**
 * FileLoader object for namespace.
 */
const FileLoader = {
  /**
   * The location of remote client files.
   * @var {string}
   */
  remoteLocation: '/SomaWebSocket/',

  /**
   * Callback for get file.
   * @callback FileLoader~onGet
   * @param {ArrayBuffer} result The file data.
   * @param {string|null} error The error string or null if no error.
   */

  /**
   * Get a file
   * @param {string} filename
   * @param {FileLoader~onGet} callback Called when the file has been retrieved.
   */
  get(filename, callback) {
    FileSystem.getFile(
      filename,
      function onLoad(buffer) {
        callback(buffer);
      },

      function onError() {
        // Not found in the file system so try to
        // load it from the remote location.
        FileLoader.getHTTP(filename, callback);
      }

    );
  },

  /**
   * Get a file from HTTP server using XMLHTTPRequest.
   * @param {string} filename
   * @param {FileLoader~onGet} callback Called when the file has been received from HTTP server.
   */
  getHTTP(filename, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', this.remoteLocation + filename, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function() {
      if (xhr.status === 200) {
        callback(xhr.response);
        FileSystem.saveFile(filename, xhr.response);
      } else {
        callback(null, 'FileLoader.getHTTP: XMLHttpRequest failed status=' + xhr.status + ' statusText=' + xhr.statusText);
      }
    };

    xhr.onerror = function() {
      callback(null, 'FileLoader.getHTTP: XMLHttpRequest failed to retrieve file');
    };

    try {
      xhr.send(null);
    } catch (e) {
      callback(null, 'FileLoader.getHTTP: XMLHttpRequest failed message=' + e.message);
    }
  },

  /**
   * Callback for file loaded.
   * @callback FileLoader~onLoad
   * @param {ArrayBuffer} result The file data.
   * @param {string|null} error The error string or null if no error.
   */
  /**
   * Load a file.
   * @param {string} filename The file to load
   * @param {FileLoader~onLoad} callback Called when the file has finished loading.
   */
  load(filename, callback) {
    this.get(filename, function(buffer, error) {
      if (!buffer || buffer.byteLength === 0) {
        callback(null, error);
        return;
      }

      let result = null;
      error = null;
      const ext = filename.match(/.[^\.]+$/).toString().substr(1).toLowerCase();

      try {
        switch (ext) {
          case 'obm':
          case 'spl':
            result = new Sprite(buffer);
            break;
          case 'ani':
            result = new Animation(buffer);
            break;
          case 'tsd':
            result = new TileSet(buffer);
            break;
          case 'tmn':
            result = new TileMap(buffer);
            break;
          case 'mod':
            result = new ObjectMap(buffer);
            break;
        }
      } catch (e) {
        error = e.message;
      }

      callback(result, error);
    });
  }
};

export default FileLoader;
