/**
 * EntityAction
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import Entity from 'renderer/entity/entity';

import DB from 'db/db';
import WeaponType from 'db/items/weapontype';
import BattleMode from 'db/entity/battlemode';

class EntityAction {
  /**
   * EntityAction constructor
   * @constructor
   * @this {EntityAction}
   */
  constructor(entity) {
    this.entity = entity;
    this._action = -1;
  }

  set(action) {
    this._action = action;
    this.entity.view.updateAll();
  }

  get() {
    const entity = this.entity;
    let action = this._action;
    switch (action) {
      case EntityAction.IDLE:
        if (entity.battleMode == BattleMode.NORMAL) {
          action = entity.type == Entity.TYPE_PC ? 18 : 0;
        } else {
          const weaponType = DB.getItemWeaponType(entity.weapon);
          switch (weaponType) {
            case WeaponType.KNUCKLE:
            case WeaponType.SWORD:
            case WeaponType.BOW:
            case WeaponType.STAFF:
            case WeaponType.XBOW:
            case WeaponType.AXE:
              action = 0;
              break;
            case WeaponType.BIG_SWORD:
            case WeaponType.BIG_AXE:
            case WeaponType.SPEAR:
              action = 1;
              break;
            default:
              throw new Error('invalid weapon type');
              break;
          }
        }

        break;
    }

    return action;
  }
}

EntityAction.IDLE = 0;

export default EntityAction;
