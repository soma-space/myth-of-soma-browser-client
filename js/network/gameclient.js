/**
 * Game Client
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import PacketCrypt from 'network/packetcrypt';
import BinaryReader from 'utils/binaryreader';
import BinaryWriter from 'utils/binarywriter';

const _ws = new Websock();
const _packets = [];

let _encrypted = false;
let _key = [];
let _sendCount = 0;
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

    const start = br.getUint16();

    if (offset + 4 >= br.length) {
      _pendingBuffer = new Uint8Array(buffer, offset, br.length - offset);
      return;
    }

    const length = br.getUint16();

    if (offset + 4 + length >= br.length) {
      _pendingBuffer = new Uint8Array(buffer, offset, br.length - offset);
      return;
    }

    const data = new Uint8Array(br.buffer.slice(offset + 4, offset + 4 + length));
    br.skip(length);

    if (_encrypted) {
      PacketCrypt.decrypt(_key, data, data.length);
    }

    if (offset + 4 + length + 2 > br.length) {
      _pendingBuffer = new Uint8Array(buffer, offset, br.length - offset);
      return;
    }

    const end = br.getUint16();

    const br2 = new BinaryReader(data);

    const id = br2.getUint8();
    const packet = _packets[id];

    if (!packet) {
      console.error(`unknown packet id=${id}`);
    } else {
      if (!packet.instance) {
        packet.instance = new packet.constructor(br2);
      } else {
        packet.constructor.call(packet.instance, br2);
      }

      if (packet.callback) {
        packet.callback(packet.instance);
      }
    }
  }

  _pendingBuffer = null;
}

function send(buf) {
  if (_connected) {
    _ws.send(buf);
  }
}

export function setEncryptionKey(key) {
  _key = key;
  _encrypted = true;
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
    console.log(`Game client open connected`);
    _connected = true;
    callback(true);
  });

  _ws.on('close', (event) => {
    _connected = false;
    console.log(`Game client disconnect Code: ${event.code} Reason: ${event.reason} WasClean: ${event.wasClean}`);
  });

  _ws.on('error', (event) => {
    if (!_connected) {
      callback(false);
    }

    console.log(`Game client error Code: ${event.code} Reason: ${event.reason}`);
  });
}

/**
 * Disconnect from server
 */
export function disconnect() {
  if (_connected) {
    _ws.close();
    _connected = false;
    _encrypted = false;
    _sendCount = 0;
  }
}

/**
 * Send the packet to  server
 */
export function sendPacket(pkt) {
  _sendCount += 1;
  _sendCount &= 0x00FFFFFF;

  const pktData = pkt.build().buffer;

  const bufLength = pktData.length + 2 + 2 + 2 + (_encrypted ? 5 : 0);
  const buf = new BinaryWriter(bufLength);

  buf.setUint16(0x55FF);

  if (_encrypted) {
    buf.setUint16(pktData.length + 5);

    const cryptData = new BinaryWriter(pktData.length + 5);
    cryptData.setUint32(_sendCount);
    cryptData.setUint8(0x10);
    cryptData.buffer.set(pktData, 5);
    PacketCrypt.encrypt(_key, cryptData.buffer, cryptData.length);
    buf.buffer.set(cryptData.buffer, 4);
    buf.skip(cryptData.length)
  } else {
    buf.setUint16(pktData.length);
    buf.buffer.set(pktData, 4);
    buf.skip(pktData.length)
  }

  buf.setUint16(0xFF55);

  send(buf.buffer);
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
