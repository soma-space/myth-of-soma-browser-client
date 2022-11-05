/**
 * Database functions
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import ItemArmatureTable from 'db/items/itemarmaturetable';
import WeaponType from 'db/items/weapontype';

import {pad} from 'utils/number';

const DB = {
  /**
   * Get the path to body sprite and animation
   * @param {number} skin
   * @param {number} gender
   * @param {number} job
   * @param {number} action
   * @return {string} path
   */
  getBodyPath(skin, gender, job, action) {
    let aniSkin = skin;
    if (skin < 3) {
      aniSkin = 0;
      if (job >= 10 && job < 1000) {
        aniSkin += 3 * 2;
        skin += 3 * 2; // Skip over human character sprites.
        if (gender == 1) { // Female
          aniSkin += 2;
          skin += 2; // The amount of devil character sprites per gender.
        }
      } else {
        if (gender == 1) { // Female
          aniSkin += 3;
          skin += 3; // The amount of human character sprites per gender.
        }
      }
    }

    return [`resources/man/man${pad(skin, 3)}${pad(action, 2)}`,
            `resources/man/man${pad(aniSkin, 3)}${pad(action, 2)}`];
  },

  /**
   * Get the path to shadow sprite
   * @param {number} skin
   * @param {number} gender
   * @param {number} action
   * @return {string} path
   */
  getShadowPath(skin, gender, action) {
    if (skin < 3) {
      skin = 1;
      if (gender == 1) { // Female
        skin += 500;
      }
    }

    return `resources/armature/a6${pad(skin, 3)}${pad(action, 2)}`;
  },

  /**
   * Get the path to hair sprite
   * @param {number} hair
   * @param {number} gender
   * @param {number} job
   * @param {number} action
   * @return {string} path
   */
  getHairPath(hair, gender, job, action) {
    let index = hair + 100;
    if (gender == 1) { // Female
      index += 500;
    }

    if (job >= 10 && job < 1000) {
      return `resources/darmature/a1${pad(index, 3)}${pad(action, 2)}`;
    } else {
      return `resources/armature/a1${pad(index, 3)}${pad(action, 2)}`;
    }
  },

  /**
   * Get the path to equipment sprite
   * @param {string} type
   * @param {number} pictureId
   * @param {number} action
   * @return {string} path
   */
  getEquipmentPath(type, pictureId, gender, action) {
    if (action == 18 && (type == 'shield' || type == 'weapon')) {
      return null;
    }

    if (!(pictureId in ItemArmatureTable)) {
      return null;
    }

    let index = ItemArmatureTable[pictureId].index;
    let typeInt = -1;
    switch (type) {
      case 'armorTop':
        typeInt = 0;
        break;
      case 'head':
        typeInt = 1;
        break;
      case 'armorBoot':
        typeInt = 2;
        break;
      case 'armorPad':
        typeInt = 3;
        break;
      case 'shield':
        typeInt = 4;
        break;
      case 'weapon':
        typeInt = 5;
    }

    if (typeInt < 0) {
      return null;
    }

    if (gender == 1) { // Female
      index += 500;
    }

    if (!ItemArmatureTable[pictureId].devil) {
      return `resources/armature/a${typeInt}${pad(index, 3)}${pad(action, 2)}`;
    } else {
      return `resources/darmature/a${typeInt}${pad(index, 3)}${pad(action, 2)}`;
    }
  },

  /**
   * Returns the weapon type for an item given picture id
   * @param {number} pictureId
   * @returns {number} weaponType
   */
  getItemWeaponType(pictureId) {
    if (pictureId <= 0 || !(pictureId in ItemArmatureTable)) {
      return WeaponType.KNUCKLE;
    }

    return ItemArmatureTable[pictureId].weaponType;
  },

  /**
   * Returns the draw ordre for an item with given picture id
   */
  getItemDrawOrder(pictureId) {
    if (pictureId <= 0 || !(pictureId in ItemArmatureTable)) {
      return 0;
    }

    return ItemArmatureTable[pictureId].drawOrder;
  }
};

export default DB;
