/**
 * Login Engine (session client).
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import {connect, disconnect, hookPacket, sendPacket} from 'network/sessionclient';
import PacketId from 'network/sessionpacketid';
import Packet from 'network/sessionpacketstructure';
import BGM from 'audio/bgm';
import UIComponent from 'ui/uicomponent';
import Login from 'ui/login/login';
import showMessageBox from 'ui/messagebox/messagebox';
import CharEngine from 'engine/charengine';

let _username = '';
let _password = '';

function initialize() {
  BGM.play('resources/sound/log.ogg');

  Login.onConnectionRequest = onConnectionRequest;

  Login.append();

  hookPacket(PacketId.SM_GAMEINFO_ACK, onGameInfoAck);
  hookPacket(PacketId.SM_LOGIN_ACK, onLoginAck);
  hookPacket(PacketId.SM_UPGRADING_ACK);
  hookPacket(PacketId.SM_CONNECTINFO_ACK, onConnectInfoAck);
}

function reload() {
  disconnect();
  UIComponent.removeAll();
  Login.append();
}

function onConnectionRequest(username, password) {
  if (!username || !password) {
    showMessageBox('Be sure to have both your username and password filled in.');
    return;
  }

  console.log('login onConnectionRequest');

  connect('localhost', 4111, (success) => {
    if (!success) {
      showMessageBox('Connection to the server failed. Please try again later.');
      return;
    }

    const pkt = new Packet.CS.SM_GAMEINFO2_REQ();
    sendPacket(pkt);

    _username = username;
    _password = password;
  });
}

function onGameInfoAck(pkt) {
  pkt = new Packet.CS.SM_LOGIN_REQ();
  pkt.username = _username;
  pkt.password = _password;
  sendPacket(pkt);
}

function onLoginAck(pkt) {
  switch (pkt.result) {
    case 0:
    case 1:
      showMessageBox('You logged-in for free.\nPress enter!', () => {
        pkt = new Packet.CS.SM_GAME_REQ();
        sendPacket(pkt);
      });

      break;
    case 3:
      showMessageBox('Please enter a password.');
      break;
    case 6:
    case 7:
      showMessageBox('Username and/or Password is incorrect.\nPress enter to try again.');
      break;
    default:
      showMessageBox('Login failed. Please try again later.');
      break;
  }
}

function onConnectInfoAck(pkt) {
  Login.remove();
  CharEngine.initialize(pkt.gameServerIP, pkt.gameServerPort, _username, _password);
  _username = null;
  _password = null;
}

const LoginEngine = {
  initialize,
  reload
};

export default LoginEngine;
