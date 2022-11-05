/**
 * Entity
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import Client from 'core/client';

import SpriteRenderer from 'renderer/spriterenderer';
import Entity from 'renderer/entity/entity';

import {pad} from 'utils/number';

import DB from 'db/db';
import Direction from 'db/entity/direction';
import WeaponType from 'db/items/weapontype';

class EntityView {
  /**
   * EntityView constructor
   * @constructor
   * @param {object} entity
   * @this {EntityView}
   */
  constructor(entity) {
    this.entity = entity;

    this.drawOrder = [];

    this.body = {spl: null, ani: null};
    this.shadow = {spl: null, ani: null};
    this.head = {spl: null, ani: null};
    this.armorTop = {spl: null, ani: null};
    this.armorPad = {spl: null, ani: null};
    this.armorBoot = {spl: null, ani: null};
    this.weapon = {spl: null, ani: null};
    this.shield = {spl: null, ani: null};
  }

  updateAll() {
    this.entity.skin = this.entity._skin;
    this.entity.hair = this.entity._hair;
    this.entity.armorHelmet = this.entity._armorHelmet;
    this.entity.armorTop = this.entity._armorTop;
    this.entity.armorPad = this.entity._armorPad;
    this.entity.armorBoot = this.entity._armorBoot;
    this.entity.weapon = this.entity._weapon;
    this.entity.shield = this.entity._shield;
  }

  /**
   * Updating body
   * @param {number} skin
   */
  updateBody(skin, gender, job, action) {
    if (skin < 0) {
      return;
    }

    this.entity._skin = skin;

    if (gender < 0 || job < 0 || action < 0) {
      return;
    }

    const path = DB.getBodyPath(skin, gender, job, action);
    Client.loadFile(`${path[0]}.spl`, () => {
      this.body.spl = `${path[0]}.spl`;
    });

    Client.loadFile(`${path[1]}.ani`, () => {
      this.body.ani = `${path[1]}.ani`;
    });

    const shadowPath = DB.getShadowPath(skin, gender, action);
    Client.loadFile(`${shadowPath}.spl`, () => {
      this.shadow.spl = `${shadowPath}.spl`;
      this.shadow.ani = this.body.ani;
    });
  }

  /**
   * Updating head
   * @param {number} skin
   */
  updateHead(pictureId, hair, gender, job, action) {
    if (pictureId > 0) {
      this.updateEquipment('armorHelmet', pictureId, gender, action);
      return;
    }

    if (hair <= 0) {
      this.entity._hair = 0;
      return;
    }

    this.entity._armorHelmet = 0;
    this.entity._hair = hair;

    if (gender < 0 || job < 0 || action < 0) {
      return;
    }

    const path = DB.getHairPath(hair, gender, job, action);
    Client.loadFile(`${path}.spl`, () => {
      this.head.spl = `${path}.spl`;
      this.head.ani = this.body.ani;
    });
  }

  /**
   * Updating files to load for equipment
   */
  updateEquipment(type, pictureId, gender, action) {
    if (pictureId <= 0) {
      this.entity['_' + type] = 0;
      return;
    }

    this.entity['_' + type] = pictureId;

    if (gender < 0 || action < 0) {
      return;
    }

    if (type == 'armorPad' || type == 'armorTop' || type == 'weapon') {
      this.updateDrawOrder();
    }

    if (type == 'armorHelmet') {
      type = 'head';
    }

    const path = DB.getEquipmentPath(type, pictureId, gender, action);
    if (!path) {
      this[type].spl = null;
      this[type].ani = null;
      return;
    }

    Client.loadFile(`${path}.spl`, () => {
      this[type].spl = `${path}.spl`;
      this[type].ani = this.body.ani;
    });
  }

  /**
   * Update the draw order to be used
   */
  updateDrawOrder() {
    const drawOrderArmorPad = DB.getItemDrawOrder(this.entity.armorPad);
    const drawOrderArmorTop = DB.getItemDrawOrder(this.entity.armorTop);
    const weaponType = DB.getItemWeaponType(this.entity.weapon);
    const drawOrder = this.drawOrder;

    drawOrder[0] = 'shadow';

    switch (this.entity.direction) {
      case Direction.DOWN:
        drawOrder[1] = 'body';
        drawOrder[2] = 'armorPad';
        drawOrder[3] = 'armorBoot';
        drawOrder[4] = 'armorTop';
        drawOrder[5] = 'head';
        drawOrder[6] = 'shield';
        drawOrder[7] = 'weapon';

        if (drawOrderArmorPad == 1 && drawOrderArmorTop >= 1) {
          drawOrder[2] = 'armorBoot';
          drawOrder[3] = 'armorTop';
          drawOrder[4] = 'armorPad';
          drawOrder[5] = null;
        } else {
          if (drawOrderArmorPad == 1) {
            drawOrder[2] = 'armorTop';
            drawOrder[4] = 'armorPad';
          }

          if (drawOrderArmorTop >= 2) {
            drawOrder[5] = null;
          }
        }

        break;
      case Direction.UP:
        drawOrder[1] = 'shield';
        drawOrder[2] = 'body';
        drawOrder[3] = 'armorPad';
        drawOrder[4] = 'armorBoot';
        drawOrder[5] = 'armorTop';
        drawOrder[6] = 'weapon';
        drawOrder[7] = 'head';

        if (drawOrderArmorPad == 1 && drawOrderArmorTop >= 1) {
          drawOrder[1] = 'body';
          drawOrder[2] = 'armorBoot';
          drawOrder[3] = 'armorTop';
          drawOrder[4] = 'armorPad';
          drawOrder[5] = 'weapon';
          drawOrder[6] = 'shield';
          drawOrder[7] = null;
        } else {
          if (drawOrderArmorPad == 1) {
            drawOrder[3] = 'armorTop';
            drawOrder[5] = 'armorPad';
          }

          if (drawOrderArmorTop >= 2) {
            drawOrder[7] = null;
          }
        }

        break;
      case Direction.DOWN_LEFT:
      case Direction.LEFT:
      case Direction.UP_LEFT:
        drawOrder[1] = 'body';
        drawOrder[2] = 'weapon';
        drawOrder[3] = 'armorPad';
        drawOrder[4] = 'armorBoot';
        drawOrder[5] = 'armorTop';
        drawOrder[6] = 'head';
        drawOrder[7] = 'shield';

        if (drawOrderArmorPad == 1 && drawOrderArmorTop >= 1) {
          drawOrder[2] = 'armorBoot';
          drawOrder[3] = 'armorTop';
          drawOrder[4] = 'armorPad';
          drawOrder[5] = 'weapon';
          drawOrder[6] = null;
        } else {
          if (drawOrderArmorPad == 1) {
            drawOrder[2] = 'armorTop';
            drawOrder[3] = 'armorBoot';
            drawOrder[4] = 'armorPad';
            drawOrder[5] = 'weapon';
          }

          if (drawOrderArmorTop != 0 && weaponType == WeaponType.Bow) {
            drawOrder[2] = 'armorPad';
            drawOrder[3] = 'weapon';
          }

          if (drawOrderArmorTop >= 2) {
            drawOrder[6] = null;
          }
        }

        break;
      case Direction.DOWN_RIGHT:
      case Direction.RIGHT:
      case Direction.UP_RIGHT:
        drawOrder[1] = 'body';
        drawOrder[2] = 'armorPad';
        drawOrder[3] = 'armorBoot';
        drawOrder[4] = 'armorTop';
        drawOrder[5] = 'head';
        drawOrder[6] = 'weapon';
        drawOrder[7] = 'shield';

        if (drawOrderArmorPad == 1 && drawOrderArmorTop >= 1) {
          drawOrder[2] = 'armorBoot';
          drawOrder[3] = 'armorTop';
          drawOrder[4] = 'armorPad';
          drawOrder[5] = null;
        } else {
          if (drawOrderArmorPad == 1) {
            drawOrder[2] = 'armorTop';
            drawOrder[4] = 'armorPad';
          }

          if (drawOrderArmorTop >= 2) {
            drawOrder[5] = null;
          }
        }

        break;
    }
  }
}
export default EntityView;
