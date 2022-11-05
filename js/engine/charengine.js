/**
 * Char Engine (Character Selection).
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import {connect, disconnect, hookPacket, sendPacket, setEncryptionKey} from 'network/gameclient';
import PacketId from 'network/gamepacketid';
import Packet from 'network/gamepacketstructure';
import CharSelect from 'ui/charselect/charselect';
import showMessageBox from 'ui/messagebox/messagebox';
import LoginEngine from 'engine/loginengine';
import MapEngine from 'engine/mapengine';
import BGM from 'audio/bgm';

let _username = '';
let _password = '';

function initialize(gameServerIP, gameServerPort, username, password) {
  _username = username;
  _password = password;

  CharSelect.append();

  CharSelect.onCharacterSelected = onCharacterSelected;
  CharSelect.onExitRequest = onExitRequest;

  hookPacket(PacketId.PKT_ENCRYPTION_START_REQ, onEncryptionStart);
  hookPacket(PacketId.PKT_ACCOUNT_LOGIN, onAccountLogin);

  connect('localhost', 12001, (success) => {
    if (!success) {
      showMessageBox('Connection to the server failed. Please try again later.');
      return;
    }

    const pkt = new Packet.CS.PKT_ENCRYPTION_START_REQ();
    sendPacket(pkt);
  });
}

function onEncryptionStart(pkt) {
  if (pkt.success) {
    setEncryptionKey(pkt.key);

    pkt = new Packet.CS.PKT_ACCOUNT_LOGIN();
    pkt.username = _username;
    pkt.password = _password;
    sendPacket(pkt);
    _username = null;
    _password = null;
  } else {
    showMessageBox('Connection to the server failed. Please try again later.');
  }
}

function onAccountLogin(pkt) {
  for (let i = 0; i < pkt.characterCount; i++) {
    CharSelect.addCharacter(pkt.character[i]);
  }

  CharSelect.moveToSlot(pkt.lastCharacterSlot);
}

function onCharacterSelected(character) {
  CharSelect.remove();
  BGM.stop();
  MapEngine.initialize(character.name);
}

function onExitRequest() {
  disconnect();
  LoginEngine.reload();
}

const CharEngine = {initialize};

export default CharEngine;
