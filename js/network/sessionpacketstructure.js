/**
 * Network Session Packet Structures
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import Id from 'network/sessionpacketid';
import {registerPacket} from 'network/sessionclient';
import BinaryWriter from 'utils/binarywriter';

const Packet = {};
Packet.CS = {}; // Client to server packets
Packet.SC = {}; // Server to client packets

Packet.CS.SM_LOGIN_REQ = function() {
  this.username = '';
  this.password = '';
};

Packet.CS.SM_LOGIN_REQ.prototype.build = function() {
  const length = 2 + 2 + 2 + this.username.length + 2 + this.password.length + 2 + 4 + 2 + 4;
  const buf = new BinaryWriter(length);
  buf.setUint16(Id.SM_LOGIN_REQ);
  buf.setUint16(length - 4); // Size
  buf.setUint16(this.username.length);
  buf.setString(this.username);
  buf.setUint16(this.password.length);
  buf.setString(this.password);
  buf.setUint16(4);
  buf.setString('soma');
  buf.setUint16(4);
  buf.setString('soma');
  return buf;
};

Packet.SC.SM_LOGIN_ACK = function(buf) {
  this.result = buf.getUint8();
};

registerPacket(Id.SM_LOGIN_ACK, Packet.SC.SM_LOGIN_ACK);

Packet.CS.SM_GAME_REQ = function() {
};

Packet.CS.SM_GAME_REQ.prototype.build = function() {
  const length = 2 + 2 + 4 + 1;
  const buf = new BinaryWriter(length);
  buf.setUint16(Id.SM_GAME_REQ);
  buf.setUint16(length - 4); // Size
  buf.setInt32(0);
  buf.setUint8(1);
  return buf;
};

Packet.SC.SM_GAMEINFO_ACK = function(buf) {
  // Nothing to retrieve from packet
};

registerPacket(Id.SM_GAMEINFO_ACK, Packet.SC.SM_GAMEINFO_ACK);

Packet.SC.SM_UPGRADING_ACK = function(buf) {
  this.notice = buf.getString(buf.length);
};

registerPacket(Id.SM_UPGRADING_ACK, Packet.SC.SM_UPGRADING_ACK);

Packet.CS.SM_GAMEINFO2_REQ = function() {
};

Packet.CS.SM_GAMEINFO2_REQ.prototype.build = function() {
  const length = 2 + 2;
  const buf = new BinaryWriter(length);
  buf.setUint16(Id.SM_GAMEINFO2_REQ);
  buf.setUint16(0); // Size
  return buf;
};

Packet.SC.SM_CONNECTINFO_ACK = function(buf) {
  this.username = buf.getString(buf.getUint16());
  this.start = !!buf.getUint8();
  this.gameServerIP = buf.getString(buf.getUint16());
  this.gameServerPort = buf.getInt32();
};

registerPacket(Id.SM_CONNECTINFO_ACK, Packet.SC.SM_CONNECTINFO_ACK);

Packet.CS.SM_ALIVE_ACK = function() {
};

Packet.CS.SM_ALIVE_ACK.prototype.build = function() {
  const length = 2 + 2;
  const buf = new BinaryWriter(length);
  buf.setUint16(Id.SM_ALIVE_ACK);
  buf.setUint16(0); // Size
  return buf;
};

export default Packet;
