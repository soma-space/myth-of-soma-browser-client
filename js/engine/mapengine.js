/**
 * Map Engine
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import Session from 'engine/session';

import {hookPacket, sendPacket} from 'network/gameclient';
import PacketId from 'network/gamepacketid';
import Packet from 'network/gamepacketstructure';

import MapRenderer from 'renderer/maprenderer';
import Camera from 'renderer/camera';
import EntityList from 'renderer/entitylist';
import Entity from 'renderer/entity/entity';

import HUD from 'ui/hud/hud';
import Chat from 'ui/chat/chat';
import ChatHistory from 'ui/chathistory/chathistory';

import EntityEngine from 'engine/map/entity';
import NpcEngine from 'engine/map/npc';

import Keys from 'input/keyboard';
import MapControl from 'controls/mapcontrol';
import Mouse from 'controls/mouse';

import ChatType from 'db/chat/chattype';

function initialize(characterName) {
  EntityEngine.initialize();
  NpcEngine.initialize();

  HUD.prepare();
  Chat.prepare();
  ChatHistory.prepare();

  Chat.onRequestTalk = onRequestTalk;
  HUD.onBattleModeChange = onBattleModeChange;

  MapControl.initialize();
  MapControl.onRequestWalk = onRequestWalk;

  hookPacket(PacketId.PKT_LOGIN, onLogin);
  hookPacket(PacketId.PKT_CHARACTER_DATA, (pkt) => console.log(pkt));
  hookPacket(PacketId.PKT_MAGIC_ALL, (pkt) => console.log(pkt));
  hookPacket(PacketId.PKT_CHAT, onChat)

  Session.gameStarted = false;

  const pkt = new Packet.CS.PKT_LOGIN();
  pkt.characterName = characterName;
  sendPacket(pkt);
}

function onLogin(pkt) {
  console.log('onLogin');

  if (pkt.success) {
    Session.entity = new Entity();
    Session.entity.serverId = pkt.serverId;
    Session.entity.setCellPosition(pkt.x, pkt.y);

    EntityList.add(Session.entity);

    MapRenderer.onLoad = () => {
      Camera.follow(Session.entity);

      $(document).keydown(function(event) {
        if ($(event.target).is('input, textarea')) {
          return;
        }

        event.stopPropagation();

        switch (event.which) {
          case Keys.LEFT:
            if (Session.entity.cellX > 0) {
              Session.entity.setCellPosition(Session.entity.cellX - 1, Session.entity.cellY);
            }

            event.preventDefault();
            break;
          case Keys.UP:
            if (Session.entity.cellY > 0) {
              Session.entity.setCellPosition(Session.entity.cellX, Session.entity.cellY - 1);
            }

            event.preventDefault();
            break;
          case Keys.RIGHT:
            Session.entity.setCellPosition(Session.entity.cellX + 1, Session.entity.cellY);
            event.preventDefault();
            break;
          case Keys.DOWN:
            Session.entity.setCellPosition(Session.entity.cellX, Session.entity.cellY + 1);
            event.preventDefault();
            break;
        }
      });

      HUD.append();
      Chat.append();
      ChatHistory.append();
    }

    MapRenderer.setMap(pkt.zone);
  } else {
    console.error('failed to enter map with character');
  }
}

function onRequestTalk(text) {
  const pkt = new Packet.CS.PKT_CHAT();
  pkt.text = text;
  sendPacket(pkt);
}

function onChat(pkt) {
  switch (pkt.type) {
    case ChatType.NORMAL:
    case ChatType.SHOUT:
    case ChatType.GUILD:
    case ChatType.PARTY:
      if (pkt.serverId < 1000) {
        Chat.addChat(`${pkt.name} : ${pkt.text}`, pkt.type);
      }

      break;
    case ChatType.ZONE:
      Chat.addChat(`${pkt.name} : ${pkt.text}`, pkt.type, `rgb(${pkt.r}, ${pkt.g}, ${pkt.b}`);
      break;
    case ChatType.SYSTEM:
    case ChatType.GM_NOTICE:
    case ChatType.YELLOW_STAT:
    case ChatType.BLUE_STAT:
      Chat.addChat(pkt.text, pkt.type);
      break;
  }

  if (pkt.type == ChatType.NORMAL || pkt.type == ChatType.SHOUT || pkt.type == ChatType.ZONE) {
    let entity = EntityList.get(pkt.serverId);
    if (entity) {
      entity.display.chat = pkt.text;
      entity.display.update();
    }
  }
}

function onBattleModeChange(battleMode) {
  const pkt = new Packet.CS.PKT_BATTLEMODE();
  pkt.battleMode = battleMode;
  sendPacket(pkt);
}

function onRequestWalk() {
  if (Keys.SHIFT) {
    const pkt = new Packet.CS.PKT_CHANGEDIR();
    pkt.serverId = Session.entity.serverId;
    pkt.direction = Session.entity.getDirectionTo(Mouse.world.x, Mouse.world.y);
    sendPacket(pkt);
    return;
  }
}

const MapEngine = {initialize};

export default MapEngine;
