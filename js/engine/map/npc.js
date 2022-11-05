/**
 * map Engine NPC
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import {hookPacket, sendPacket} from 'network/gameclient';
import PacketId from 'network/gamepacketid';
import Packet from 'network/gamepacketstructure';

import EventMessage from 'ui/eventmessage/eventmessage';
import EventSelection from 'ui/eventselection/eventselection';

function initialize() {
  hookPacket(PacketId.PKT_EVENTNORMAL, onEventMessage);
  hookPacket(PacketId.PKT_EVENTSELBOX, onEventSelection);
  hookPacket(PacketId.PKT_EVENTOKBOX, onEventMessageOK);
}

function onEventMessage(pkt) {
  EventMessage.append();
  EventMessage.setMessage(pkt.text);
}

function onEventSelection(pkt) {
  EventSelection.append();
  EventSelection.setSelection(pkt.text, pkt.selections);
  EventSelection.onSelect = (index) => {
    const pkt = new Packet.CS.PKT_EVENTSELBOX();
    pkt.selectionIndex = index;
    sendPacket(pkt);
  }
}

function onEventMessageOK(pkt) {

}

const NpcEngine = {initialize};

export default NpcEngine;
