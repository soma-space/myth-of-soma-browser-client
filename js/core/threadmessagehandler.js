/**
 * Handle thread messages
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
importScripts('/SomaWebSocket/jspm_packages/system.js');
importScripts('/SomaWebSocket/config.js');

Promise.all([System.import('core/fileloader'), System.import('core/filesystem')]).then(function(modules) {
  const FileLoader = modules[0].default;
  const FileSystem = modules[1].default;

  addEventListener('message', function(event) {
    const message = event.data;

    switch (message.type) {
      case 'LOAD':
        FileLoader.load(message.data.filename, function(result, error) {
          if (message.callbackId) {
            postMessage({
              callbackId: message.callbackId,
              arguments: [result, error, message.data]
            });
          }
        });

        break;
      case 'FILESYSTEM_INIT':
        FileSystem.initialize(
          function() {
            postMessage({
              callbackId: message.callbackId
            });
          },

          function(e) {
            postMessage({
              type: 'ERROR',
              data: e.toString()
            });
          }

        );
        break;
    }
  }, false);

  /**
   * Start the worker
   */
  postMessage({
    type: 'START'
  });
});
