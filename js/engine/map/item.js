/**
 * Map Engine Item
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import Session from 'engine/session';

import {hookPacket, sendPacket} from 'network/gameclient';
import PacketId from 'network/gamepacketid';
import Packet from 'network/gamepacketstructure';

function initialize() {
  hookPacket(PacketId.PKT_INV_ALL, (pkt) => console.log(pkt));
}
