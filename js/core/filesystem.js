/**
 * File System
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
/**
* @var {FileSystem} Asynchronous FileSystem.
*/
let _fileSystem = null;

/**
* @var {FileSystem} Synchronous FileSystem.
*/
let _fileSystemSync = null;

/**
* @var {boolean} Is the FileSystem API available.
*/
let _available = self.requestFileSystem || self.webkitRequestFileSystem;

/**
 * FileSystem object for namespace.
 */
const FileSystem = {
  /**
   * Initialize FileSystem.
   * Request temporary quota.
   */
  initialize(onReady, onError) {
    if (!_available) {
      onReady();
      return;
    }

    const size = 1024 * 1024 * 1024; /* 1GiB */
    const requestFileSystem = self.requestFileSystem || self.webkitRequestFileSystem;
    const requestFileSystemSync = self.requestFileSystemSync || self.webkitRequestFileSystemSync;

    requestFileSystem(self.TEMPORARY, size, function(fileSystem) {
      _fileSystem = fileSystem;
      _fileSystemSync = requestFileSystemSync(self.TEMPORARY, size);
      onReady();
    }, onError);
  },

  /**
   * Retrieve a file from the file system (Asynchronous).
   * @param {string} filename
   * @param {callback} onLoad Called with the file as parameter if the file was retrieved successfully.
   * @param {callback} onError Called if there was an error while retrieving the file.
   */
  getFile(filename, onLoad, onError) {
    if (!_available) {
      onError();
      return;
    }

    _fileSystem.root.getFile(filename, {create: false}, function(entry) {
      if (entry.isFile) {
        entry.file(function(file) {
          const reader = new FileReader();
          reader.onloadend = function(event) {
            onLoad(event.target.result);
          };

          reader.readAsArrayBuffer(file);
        });
      } else {
        onError();
      }
    }, onError);
  },

  /**
   * Save a file to the file system (Synchronous)
   * @param {string} filename
   * @param {ArrayBuffer} buffer The file data
   */
  saveFile(filename, buffer) {
    if (!_available) {
      return;
    }

    filename.replace(/\\/g, '/');
    const directories = filename.split('/').slice(0, -1);

    let path = '';
    while (directories.length) {
      path += directories.shift() + '/';
      _fileSystemSync.root.getDirectory(path, {create: true});
    }

    const entry = _fileSystemSync.root.getFile(filename, {create: true});
    const writer = entry.createWriter();
    writer.write(new Blob([buffer]));
  }
};

export default FileSystem;
