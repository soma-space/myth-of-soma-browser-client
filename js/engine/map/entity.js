/**
 * Map Engine Entity
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import Session from 'engine/session';

import {hookPacket, sendPacket} from 'network/gameclient';
import PacketId from 'network/gamepacketid';
import Packet from 'network/gamepacketstructure';

import EntityList from 'renderer/entitylist';
import Entity from 'renderer/entity/entity';
import EntityAction from 'renderer/entity/entityaction';

import EquipmentLocation from 'db/items/equipmentlocation';

function initialize() {
  hookPacket(PacketId.PKT_USERMODIFY, onEntityModify);
  hookPacket(PacketId.PKT_MOVEFIRST, onEntityMove);
  hookPacket(PacketId.PKT_MOVEMIDDLE, onEntityMove);
  hookPacket(PacketId.PKT_MOVEEND, onEntityMove);
  hookPacket(PacketId.PKT_RUN_MOVEFIRST, onEntityMove);
  hookPacket(PacketId.PKT_RUN_MOVEMIDDLE, onEntityMove);
  hookPacket(PacketId.PKT_RUN_MOVEEND, onEntityMove);
  hookPacket(PacketId.PKT_CHANGEDIR, onEntityChangeDirection);
  hookPacket(PacketId.PKT_BATTLEMODE, onEntityChangeBattleMode);
}

function onEntityModify(pkt) {
  if (!pkt.add) {
    if (pkt.serverId != Session.entity.serverId) {
      EntityList.remove(pkt.serverId);
    }

    return;
  }

  let entity = EntityList.get(pkt.serverId);
  if (entity) {
    entity.type = pkt.serverId < 10000 ? Entity.TYPE_PC : Entity.TYPE_NPC;
    entity.display.name = pkt.name;
    entity.display.guildName = pkt.guildName;
    entity.skin = pkt.serverId < 10000 ? pkt.skin : pkt.gender;
    entity.setCellPosition(pkt.x, pkt.y);
    entity.direction = pkt.direction;
    entity.gender = pkt.serverId < 10000 ? pkt.gender : 0;
    entity.armorHelmet = pkt.equippedItem[EquipmentLocation.HEAD].pictureId;
    entity.armorTop = pkt.equippedItem[EquipmentLocation.CHEST].pictureId;
    entity.job = pkt.job;
    entity.armorPad = pkt.equippedItem[EquipmentLocation.LEGS].pictureId;
    entity.armorBoot = pkt.equippedItem[EquipmentLocation.FEET].pictureId;
    entity.weapon = pkt.equippedItem[EquipmentLocation.RIGHT_HAND].pictureId;
    entity.action.set(EntityAction.IDLE);
    entity.battleMode = pkt.battleMode;
    entity.hair = pkt.hair;

    if (entity.serverId == Session.entity.serverId && !Session.gameStarted) {
      const pkt = new Packet.CS.PKT_GAMESTART();
      sendPacket(pkt);
      Session.gameStarted = true;
    }
  } else {
    entity = new Entity();
    entity.type = pkt.serverId < 10000 ? Entity.TYPE_PC : Entity.TYPE_NPC;
    entity.serverId = pkt.serverId;
    entity.display.name = pkt.name;
    entity.display.guildName = pkt.guildName;
    entity.skin = pkt.serverId < 10000 ? pkt.skin : pkt.gender;
    entity.setCellPosition(pkt.x, pkt.y);
    entity.direction = pkt.direction;
    entity.gender = pkt.serverId < 10000 ? pkt.gender : 0;
    entity.armorHelmet = pkt.equippedItem[EquipmentLocation.HEAD].pictureId;
    entity.armorTop = pkt.equippedItem[EquipmentLocation.CHEST].pictureId;
    entity.job = pkt.job;
    entity.armorPad = pkt.equippedItem[EquipmentLocation.LEGS].pictureId;
    entity.armorBoot = pkt.equippedItem[EquipmentLocation.FEET].pictureId;
    entity.weapon = pkt.equippedItem[EquipmentLocation.RIGHT_HAND].pictureId;
    entity.action.set(EntityAction.IDLE);
    entity.battleMode = pkt.battleMode;
    entity.hair = pkt.hair;

    EntityList.add(entity);
  }

  entity.display.update();
}

function onEntityMove(pkt) {
  const entity = EntityList.get(pkt.serverId);
  if (entity) {
    entity.direction = pkt.direction;

    if (pkt.success) {
      entity.setCellPosition(pkt.destination.x, pkt.destination.y);
    } else {
      entity.setCellPosition(pkt.destination.x, pkt.destination.y);
    }
  }
}

function onEntityChangeDirection(pkt) {
  const entity = EntityList.get(pkt.serverId);
  if (entity) {
    entity.direction = pkt.direction;
  }
}

function onEntityChangeBattleMode(pkt) {
  const entity = EntityList.get(pkt.serverId);
  if (entity) {
    entity.battleMode = pkt.battleMode;
  }
}

const EntityEngine = {initialize};

export default EntityEngine;
