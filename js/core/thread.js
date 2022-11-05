/**
 * Controls the thread for loading files, etc. So that the main thread is not stalled.
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
/**
* @var {Worker} The worker object
*/
let _worker = null;

/**
* @var {number} Unique id for message callback
*/
let _callbackId = 0;

/**
* @var {object} List of callbacks indexed by unique id
*/
let _callback = {};

/**
 * Thread object for namespace.
 */
const Thread = {
  /**
   * Initialize the worker.
   */
  initialize() {
    if (!_worker) {
      _worker = new Worker('js/core/threadmessagehandler.js');
      _worker.addEventListener('message', Thread.receive, false);
    }
  },

  /**
   * Send message to the worker.
   */
  send: (function() {
    const message = {
      callbackId: 0,
      type: '',
      data: null
    };

    return function(type, data, callback) {
      let callbackId = 0;
      if (callback) {
        _callbackId += 1;
        callbackId = _callbackId;
        _callback[callbackId] = callback;
      }

      message.callbackId = callbackId;
      message.type = type;
      message.data = data;

      _worker.postMessage(message);

      console.log('Thread send message callbackId=' + message.callbackId + ' type=' + message.type + ' data=' + message.data);
    };
  })(),

  /**
   * Receive message from the worker.
   * @param {object} event
   */
  receive(event) {
    const {callbackId, type} = event.data;

    if (callbackId in _callback) {
      _callback[callbackId].apply(null, event.data.arguments);
      delete _callback[callbackId];
    }

    console.log('Thread Receive: callbackId=' + callbackId + ' type=' + type);

    if (type === 'START') {
      Thread.onStart();
    }

    if (type === 'ERROR') {
      console.error(event.data.data);
    }
  },

  /**
   * Callback to call when thread is started
   */
  onStart() {}
};

export default Thread;
