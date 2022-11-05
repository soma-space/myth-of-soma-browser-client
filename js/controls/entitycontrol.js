/**
 * Entity Control
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import {sendPacket} from 'network/gameclient';
import PacketId from 'network/gamepacketid';
import Packet from 'network/gamepacketstructure';

import Entity from 'renderer/entity/entity';
import EntityPicking from 'renderer/entitypicking';

class EntityControl {
  /**
   * EntityControl constructor
   * @constructor
   * @this {EntityControl}
   */
  constructor(entity) {
    this.entity = entity;
  }

  /**
   * Mouse over entity
   */
  onMouseOver() {
    this.entity.display.add();
  }

  /**
   * Mouse leave entity
   */
  onMouseLeave() {
    this.entity.display.remove();
  }

  /**
   * Mouse down on entity (Left Button)
   * @returns {boolean} stop mouse propogation
   */
  onMouseDown() {
    console.debug('entity onMouseDown');

    if (this.entity.type == Entity.TYPE_NPC) {
      const pkt = new Packet.CS.PKT_NPC_INTERACT();
      pkt.serverId = this.entity.serverId;
      sendPacket(pkt);
      return true;
    }

    return false;
  }

  /**
   * Mouse up on entity (Left Button)
   */
  onMouseUp() {
    console.debug('entity onMouseUp');
  }

  /**
   * Focus on entity
   */
  onFocus() {
    console.debug('entity onFocus');
  }

  /**
   * Lost focus on entity
   */
  onLoseFocus() {
    console.debug('entity onLoseFocus');
  }
}

export default EntityControl;
