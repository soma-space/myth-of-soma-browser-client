/**
 * Session Client
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import BinaryReader from 'utils/binaryreader';

const _ws = new Websock();
const _packets = [];

let _connected = false;
let _pendingBuffer = null;

function receive(buf) {
  let buffer = null;
  if (_pendingBuffer) {
    const data = new Uint8Array(_pendingBuffer.length + buf.byteLength);
    data.set(_pendingBuffer, 0);
    data.set(new Uint8Array(buf), _pendingBuffer.length);
    buffer = data.buffer;
  } else {
    buffer = buf;
  }

  const br = new BinaryReader(buffer);

  while (br.tell() < br.length) {
    let offset = br.tell();

    if (offset + 2 >= br.length) {
      _pendingBuffer = new Uint8Array(buffer, offset, br.length - offset);
      return;
    }

    const id = br.getUint16();

    if (offset + 4 >= br.length) {
      _pendingBuffer = new Uint8Array(buffer, offset, br.length - offset);
      return;
    }

    const length = br.getUint16();
    offset += length;

    if (offset > br.length) {
      offset = br.tell() - 4;
      _pendingBuffer = new Uint8Array(buffer, offset, br.length - offset);
      return;
    }

    const packet = _packets[id];
    if (!packet) {
      console.error(`unknown packet id=${id}`);
    } else {
      if (!packet.instance) {
        packet.instance = new packet.constructor(br);
      } else {
        packet.constructor.call(packet.instance, br);
      }
    }

    if (length) {
      br.offset = length + 4;
    }

    if (packet && packet.callback) {
      packet.callback(packet.instance);
    }
  }

  _pendingBuffer = null;
}

function send(buf) {
  if (_connected) {
    _ws.send(buf);
  }
}

/**
 * Connect to server
 */
export function connect(host, port, callback) {
  disconnect();

  if ((!host) || (!port)) {
    return;
  }

  const uri = `ws://${host}:${port}`;
  _ws.open(uri);

  _ws.on('message', receive);

  _ws.on('open', () => {
    console.log(`Session client connected`);
    _connected = true;
    callback(true);
  });

  _ws.on('close', (event) => {
    _connected = false;
    console.log(`Session client disconnect Code: ${event.code} Reason: ${event.reason} WasClean: ${event.wasClean}`);
  });

  _ws.on('error', (event) => {
    if (!_connected) {
      callback(false);
    }

    console.log(`Session client error Code: ${event.code} Reason: ${event.reason}`);
  });
}

/**
 * Disconnect from server
 */
export function disconnect() {
  if (_connected) {
    _ws.close();
    _connected = false;
  }
}

/**
 * Send the packet to  server
 */
export function sendPacket(pkt) {
  send(pkt.build().buffer);
}

/**
 * Hook a packet
 *
 * @param {number} id Unique packet id
 * @param {callback} function to call with packet.
 */
export function hookPacket(id, callback) {
  if (!_packets[id]) {
    throw new Error('Packet cannot be hooked because not registered.');
  }

  _packets[id].callback = callback;
}

/**
 * Register a packet
 *
 * @param {number} id Unique packet id
 * @param {callback} constructor  The constructor function
 */
export function registerPacket(id, constructor) {
  if (_packets[id]) {
    throw new Error('Packet is already registered.');
  }

  _packets[id] = {constructor};
}
