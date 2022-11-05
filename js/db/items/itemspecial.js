/**
 * Item Special Constants
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
export default {
  NONE: 0,
  COLOR: 1,
  RUN_EVENT: 2,
  LIGHT: 3,
  ANTIDOTE:4,
  PORTAL: 5,
  TOWN_PORTAL: 6,
  MORAL_ADD: 7,
  MAGIC_ATTACK: 8,
  MAGIC_DEFENSE: 9,
  UNKNOWN1: 10,
  STRENGTH: 11,
  INTELLIGENCE: 12,
  DEXTERITY: 13,
  WISDOM: 14,
  CONSTITUTION: 15,
  CHARISMA: 16,
  MAXIMUM_HEALTH: 17,
  MAXIMUM_MANA: 18,
  MAXIMUM_STAMINA: 19,
  MAXIMUM_WEIGHT: 20,
  PHYSICAL_ATTACK: 21,
  PHYSICAL_DEFENSE: 22,
  MAGIC_ATTACK2: 23,
  MAGIC_DEFENSE2: 24,
  BLUE_MAGIC_ATTACK: 25,
  WHITE_MAGIC_ATTACK: 26,
  BLACK_MAGIC_ATTACK: 27,
  BLUE_MAGIC_DEFENSE: 28,
  WHITE_MAGIC_DEFENSE: 29,
  BLACK_MAGIC_DEFENSE: 30,
  COMPASS: 31,
  POS_GEM: 32,
  RANDOM_TELEPORT: 33,
  STAT_MODIFIER_HEALTH: 34,
  STAT_MODIFIER_MANA: 35,
  STAT_MODIFIER_STAMINA: 36,
  STAT_MODIFIER_WEIGHT: 37,
  LOTTERY: 38,
  RANGE_CHANGE: 39,
  STAMINA_RECOVER: 40,
  DETOX_BLUE: 41,
  DETOX_WHITE: 42,
  DETOX_BLACK: 43,
  REVIVE: 44,
  RESIST_POISON: 45,
  MAGIC_AVAILABLE: 46,
  EVASION: 47,
  REPAIR: 48,
  UNKNOWN2: 49,
  SMELTING: 50,
  UNKNOWN3: 51,
  COOKING: 52,
  UPGRADE: 53,
  SPECIAL_REPAIR: 54,
  ACCURACY: 55,
  FORTUNE_POUCH: 56,
  PLUS: 57,
  GENDER_CHANGE: 58,
  SKIN_CHANGE: 59,
  SHOUT: 60,
  SPECIAL_GEM: 61,
  SINGLE_SHOUT: 62,
  HAIR_DYE: 63,
  POISON_TOUCH: 70,
  ICY_TOUCH: 71,
  BLINDING_TOUCH: 72,
  CONFUSING_TOUCH: 73,
  WEAKENING_TOUCH: 74,
  ZOMBIE_TOUCH: 75,
  FLAME_TOUCH: 76,
  INFERNAL_TOUCH: 77,
  HEALING_TOUCH: 78,

  toString(special, options) {
    let str;
    switch (special) {
      case this.HEALING_TOUCH:
        str = 'Antidote against Normal Poison';
        break;
      case this.MAGIC_ATTACK:
        str = `Magic Attack : ${options[0]}~${options[1]}`;
        if (options[2] == 0) {
          str += '(100%)';
        } else {
          str += `(${options[2]}%)`;
        }

        break;
      case this.MAGIC_DEFENSE:
        str = `Magic Defense : ${options[0]}~${options[1]}`;
        if (options[2] == 0) {
          str += '(100%)';
        } else {
          str += `(${options[2]}%)`;
        }

        break;
      case this.STRENGTH:
        str = `STR+${options[0]}`;
        break;
      case this.INTELLIGENCE:
        str = `INT+${options[0]}`;
        break;
      case this.DEXTERITY:
        str = `DEX+${options[0]}`;
        break;
      case this.WISDOM:
        str = `WIS+${options[0]}`;
        break;
      case this.CONSTITUTION:
        str = `CON+${options[0]}`;
        break;
      case this.CHARISMA:
        str = `CHA+${options[0]}`;
        break;
      case this.MAXIMUM_HEALTH:
        str = `Max HP+${options[0]}`;
        break;
      case this.MAXIMUM_MANA:
        str = `Max MP+${options[0]}`;
        break;
      case this.MAXIMUM_STAMINA:
        str = `Max Stamina+${options[0]}`;
        break;
      case this.MAXIMUM_WEIGHT:
        str = `Max Weight+${options[0]}`;
        break;
      case this.PHYSICAL_ATTACK:
        str = `Attack+${options[0]}`;
        if (options[1] > 0) {
          str += `~${options[1]}`;
        }

        if (options[2] > 0) {
          str += `(${options[2]}%)`;
        }

        break;
      case this.PHYSICAL_DEFENSE:
        str = `Defense+${options[0]}`;
        if (options[1] > 0) {
          str += `~${options[1]}`;
        }

        if (options[2] > 0) {
          str += `(${options[2]}%)`;
        }

        break;
      case this.MAGIC_ATTACK2:
        str = `Magic Attack+${options[0]}`;
        if (options[1] > 0) {
          str += `~${options[1]}`;
        }

        if (options[2] > 0) {
          str += `(${options[2]}%)`;
        }

        break;
      case this.MAGIC_DEFENSE2:
        str = `Magic Defense+${options[0]}`;
        if (options[1] > 0) {
          str += `~${options[1]}`;
        }

        if (options[2] > 0) {
          str += `(${options[2]}%)`;
        }

        break;
      case this.BLUE_MAGIC_ATTACK:
        str = `Blue Magic Attack+${options[0]}`;
        if (options[1] > 0) {
          str += `~${options[1]}`;
        }

        if (options[2] > 0) {
          str += `(${options[2]}%)`;
        }

        break;
      case this.WHITE_MAGIC_ATTACK:
        str = `White Magic Attack+${options[0]}`;
        if (options[1] > 0) {
          str += `~${options[1]}`;
        }

        if (options[2] > 0) {
          str += `(${options[2]}%)`;
        }

        break;
      case this.BLACK_MAGIC_ATTACK:
        str = `Black Magic Attack+${options[0]}`;
        if (options[1] > 0) {
          str += `~${options[1]}`;
        }

        if (options[2] > 0) {
          str += `(${options[2]}%)`;
        }

        break;
      case this.BLUE_MAGIC_DEFENSE:
        str = `Blue Magic Defense+${options[0]}`;
        break;
      case this.WHITE_MAGIC_DEFENSE:
        str = `White Magic Defense+${options[0]}`;
        break;
      case this.BLACK_MAGIC_DEFENSE:
        str = `Black Magic Defense+${options[0]}`;
        break;
      case this.STAT_MODIFIER_HEALTH:
        str = `Max HP Up+${options[0]}`;
        break;
      case this.STAT_MODIFIER_MANA:
        str = `Max MP Up+${options[0]}`;
        break;
      case this.STAT_MODIFIER_STAMINA:
        str = `Max Stamina Up+${options[0]}`;
        break;
      case this.STAT_MODIFIER_WEIGHT:
        str = `Max Weight Up+${options[0]}`;
        break;
      case this.STAMINA_RECOVER:
        str = `Stamina Recovery+${options[0]}`;
        break;
      case this.DETOX_BLUE:
        str = 'Detox Blue Magic';
        break;
      case this.DETOX_WHITE:
        str = 'Detox White Magic';
        break;
      case this.DETOX_BLACK:
        str = 'Detox Black Magic';
        break;
      case this.REVIVE:
        str = 'Revive';
        break;
      case this.RESIST_POISON:
        str = 'Resist Poison';
        break;
      case this.MAGIC_AVAILABLE:
        str = 'Magic Available';
        break;
      case this.EVASION:
        str = `Modified Evasion Rate+${options[0]}%`;
        if (options[1] > 0) {
          str += `~${options[1]}%`;
        }

        if (options[2] > 0) {
          str += `(${options[2]}%)`;
        }

        break;
      case this.COOKING:
        str = 'For cooking (Restriction D)';
        break;
      case this.ACCURACY:
        str = `Modified Accuracy Rate+${options[0]}%`;
        if (options[1] > 0) {
          str += `~${options[1]}%`;
        }

        if (options[2] > 0) {
          str += `(${options[2]}%)`;
        }

        break;
      case this.GENDER_CHANGE:
        str = 'Gender Change';
        break;
      case this.POISON_TOUCH:
        str = `Poison Touch (${options[0]}%)`;
        break;
      case this.ICY_TOUCH:
        str = `Icy Touch (${options[0]}%)`;
        break;
      case this.BLINDING_TOUCH:
        str = `Blinding Touch (${options[0]}%)`;
        break;
      case this.CONFUSING_TOUCH:
        str = `Confusing Touch (${options[0]}%)`;
        break;
      case this.WEAKENING_TOUCH:
        str = `Weakening Touch (${options[0]}%)`;
        break;
      case this.ZOMBIE_TOUCH:
        str = `Zombie Touch (${options[0]}%)`;
        break;
      case this.FLAME_TOUCH:
        str = `Flame Touch (${options[0]}%)`;
        break;
      case this.INFERNAL_TOUCH:
        str = `Infernal Touch (${options[0]}%)`;
        break;
      case this.HEALING_TOUCH:
        str = `Healing Touch (${options[0]}%)`;
        break;
      default:
        str = '';
        break;
    }

    return str;
  }
};
