/**
 * Network Game Packet Structures
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import Id from 'network/gamepacketid';
import PacketCrypt from 'network/packetcrypt';
import {registerPacket} from 'network/gameclient';
import BinaryWriter from 'utils/binarywriter';
import ChatType from 'db/chat/chattype';

const Constants = {
  // Length constants
  ACCOUNT_LENGTH: 12, // Length of the login id and password
  NAME_LENGTH: 12, // Length of character names
  NPC_NAME_LENGTH: 50, // Length of NPC names

  // Error codes
  SUCCESS: 1,
  FAIL: 2,
  ERR_1: 1,
  ERR_2: 2,
  ERR_3: 3,
  ERR_4: 4,
  ERR_5: 5,
  ERR_6: 6,
  ERR_7: 7,
  ERR_8: 8,
  ERR_9: 9,
  ERR_10: 10,
  ERR_11: 11,
  ERR_12: 12,
  UNKNOWN_ERR: 255,

  // Item constants
  EQUIP_ITEM_NUM: 10,
  INV_ITEM_NUM: 50,
  BELT_ITEM_NUM: 4,
  STORAGE_ITEM_NUM: 80,
  GUILD_STORAGE_ITEM_NUM: 40,

  // Char constants
  GENDER_FEMALE: 0,
  GENDER_MALE: 1,

  // UserModify packet constants
  INFO_MODIFY: 1,
  INFO_DELETE: 2,

  // Character Data packet constants
  INFO_NAMES: 0x01,
  INFO_BASICVALUE: 0x02,
  INFO_EXTVALUE: 0x04,
  INFO_WEAPONEXP: 0x08,
  INFO_MAKEEXP: 0x10,
  INFO_MAGICEXP: 0x20,
  INFO_ALL: 0xFF,

  // Item Data packet constants
  GET_VALUE: 0x01,
  GET_EXTRA_USAGE: 0x02,
  NORM_LAYOUT: 0x04,
  TRADE_LAYOUT: 0x08,
  SHOP_LAYOUT: 0x10,
  AUCTION_LAYOUT: 0x20,

  // Item Change Data packet constants
  INFO_TYPE: 0x01,
  INFO_ARM: 0x02,
  INFO_PICNUM: 0x04,
  INFO_DUR: 0x08,
  INFO_NAME: 0x10,
  INFO_DAMAGE: 0x20,
  INFO_LIMIT: 0x40,
  INFO_SPECIAL: 0x80,

  // Time Set packet constants
  WEATHER_FINE: 0x00,
  WEATHER_RAIN: 0x01,
  WEATHER_SNOW: 0x03,

  // Field item info packet constants
  ITEM_INFO_MODIFY: 1,
  ITEM_INFO_DELETE: 2,

  // Magic packet constants
  MAGIC_TYPE_MAGIC: 1,
  MAGIC_TYPE_SPECIAL: 0,
  MAGIC_TYPE_ABILITY: 4,

  // Party Invite packet constants
  INVITE_FAIL: 0,
  INVITE_SUCCESS: 1,
  DELETE_MEMBER: 2,

  // Repair failure packet constants
  FAIL_REPAIR: 0,
  FAIL_NONEED: 1,
  FAIL_NOREPAIR: 2,
  FAIL_NOMONEY: 3,
  FAIL_DESTROY: 4,

  // PKT_ATTACK results
  ATTACK_SUCCESS: 1,
  ATTACK_FAIL: 2,
  ATTACK_MISS: 3,

  // Guild packet failure constants
  GUILD_INVALID_GUILD_NAME: 1,
  GUILD_INVALID_GUILD_INFO: 2,
  GUILD_FULL: 3,
  GUILD_SYSTEM_ERROR: 4,
  GUILD_ALREADY_JOIN: 5,
  GUILD_SMALL_LEVEL: 6,
  GUILD_SAME_GUILD_NAME: 7,
  GUILD_ABSENT_JOIN: 8,
  GUILD_ABSENT_REQ_USER: 9,
  GUILD_ABSENT_GUILD_NAME: 10,
  GUILD_SMALL_RANK: 11,
  GUILD_ABSENT_JOIN_REQ: 12,
  GUILD_ALREADY_JOIN_REQ: 13,
  GUILD_NEED_EMPTY_RANK: 14,
  GUILD_NOT_GUILD_USER: 15,
  GUILD_INVALID_RANK: 16,
  GUILD_INVALID_GUILD_CALL_NAME: 17,
  GUILD_SMALL_MONEY: 18,
  GUILD_MEMBER_NOT_ONLINE: 22,

  // Guild money packet constants
  GUILD_MONEY_PUT: 1,
  GUILD_MONEY_GET: 2,

  // PKT_SKILL_ABILITY Ability Types
  ABILITY_OPEN: 0,
  ABILITY_REPAIR: 1,
  ABILITY_DISASSEMBLE: 2,
  ABILITY_SYNTHESIS: 3,
  ABILITY_SMELT: 4,
  ABILITY_PREPARE: 5,
  ABILITY_UPGRADE: 8,

  REQUIRED_ITEM_COUNT: 5,

  SPECIAL_COUNT: 3,
  SPECIAL_OPTION_COUNT: 3,

  MAGIC_SLOT_COUNT: 12
};

Constants.ITEM_STORAGE = Constants.NORM_LAYOUT;
Constants.ITEM_ME = Constants.GET_VALUE | Constants.GET_EXTRA_USAGE | Constants.NORM_LAYOUT;
Constants.ITEM_EXCHANGE = Constants.TRADE_LAYOUT;
Constants.ITEM_SHOP = Constants.SHOP_LAYOUT | Constants.NORM_LAYOUT;
Constants.ITEM_AUCTION = Constants.AUCTION_LAYOUT | Constants.NORM_LAYOUT;

function parseItemInfo(buf, type, hasIndex) {
  const item = {};

  if (hasIndex) {
    item.index = buf.getUint16();
  }

  if (type & Constants.SHOP_LAYOUT) {
    item.id = buf.getUint16();
    item.quantity = buf.getInt16();
  }

  // Also for Item Exchange
  if (type & Constants.AUCTION_LAYOUT) {
    item.money2 = buf.getUint16();
    item.requiredItems = [];
    for (let i = 0; i < Constants.REQUIRED_ITEM_COUNT; i++) {
      item.requiredItems[i] = {};
      item.requiredItems[i].name = buf.getString(buf.getUint8());
      if (item.requiredItems[i].name) {
        item.requiredItems[i].quantity = buf.getUint16();
      } else {
        item.requiredItems[i].quantity = 0;
      }
    }

    item.id = buf.getUint16();
  }

  item.type = buf.getUint8();

  if (!(type & Constants.SHOP_LAYOUT) && !(type & Constants.AUCTION_LAYOUT)) {
    item.equipPosition = buf.getUint8();
  }

  item.classType = buf.getUint16();
  item.pictureId = buf.getUint16();

  if (type & Constants.TRADE_LAYOUT) {
    item.dura = buf.getUint16();
  }

  item.gender = buf.getUint8();
  item.minimumValue = buf.getUint16();
  item.maximumValue = buf.getUint16();
  item.weight = buf.getUint16();
  item.speed = buf.getUint16();

  if (type & Constants.GET_VALUE) {
    item.money = buf.getUint32();
  }

  item.requiredStr = buf.getUint16();
  item.requiredInt = buf.getUint16();
  item.requiredDex = buf.getUint16();
  item.requiredSkill = buf.getUint16();
  item.health = buf.getUint16();
  item.mana = buf.getUint16();

  if (type & Constants.NORM_LAYOUT) {
    item.dura = buf.getUint16();
  }

  if (type & Constants.SHOP_LAYOUT && type & Constants.AUCTION_LAYOUT) {
    item.money = buf.getUint32();
  }

  if (type & Constants.GET_EXTRA_USAGE) {
    item.duraMaximum = buf.getUint16();
    item.originalDuraMaximum = buf.getUint16();
  }

  item.name = buf.getString(buf.getUint8());
  item.upgradeLevel = buf.getUint8();

  item.specials = [];
  for (let i = 0; i < Constants.SPECIAL_COUNT; i++) {
    item.specials[i] = {};
    item.specials[i].id = buf.getUint16();
    item.specials[i].options = []
    for (let j = 0; j < Constants.SPECIAL_OPTION_COUNT; j++) {
      item.specials[i].options[j] = buf.getUint16();
    }
  }

  return item;
}

const Packet = {};
Packet.CS = {}; // Client to server packets
Packet.SC = {}; // Server to client packets

Packet.CS.PKT_LOGIN = function() {
  this.characterName = '';
};

Packet.CS.PKT_LOGIN.prototype.build = function() {
  const length = 1 + 1 + this.characterName.length;
  const buf = new BinaryWriter(length);
  buf.setUint8(Id.PKT_LOGIN);
  buf.setUint8(this.characterName.length);
  buf.setString(this.characterName);
  return buf;
};

Packet.SC.PKT_LOGIN = function(buf) {
  this.success = buf.getUint8() == Constants.SUCCESS ? true : false;
  this.serverId = buf.getInt32();
  this.x = buf.getInt16();
  this.y = buf.getInt16();
  this.zone = buf.getInt8();
};

registerPacket(Id.PKT_LOGIN, Packet.SC.PKT_LOGIN);

Packet.CS.PKT_LOGOUT = function() {
  this.type = 0;
};

Packet.CS.PKT_LOGOUT.prototype.build = function() {
  const length = 1 + 2;
  const buf = new BinaryWriter(length);
  buf.setUint8(Id.PKT_LOGOUT);
  buf.setUint16(this.type);
  return buf;
};

Packet.CS.PKT_ENCRYPTION_START_REQ = function() {
};

Packet.CS.PKT_ENCRYPTION_START_REQ.prototype.build = function() {
  const length = 1 + 4 + 1;
  const buf = new BinaryWriter(length);
  buf.setUint8(Id.PKT_ENCRYPTION_START_REQ);
  buf.setUint32(59);
  buf.setUint8(1);
  return buf;
};

Packet.SC.PKT_ENCRYPTION_START_REQ = function(buf) {
  this.success = buf.getUint8() == Constants.SUCCESS ? true : false;
  this.key = [];
  if (this.success) {
    const keyPart = [[], []];
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < PacketCrypt.keyLength; j++) {
        keyPart[i][j] = buf.getUint8();
      }
    }

    for (let i = 0; i < PacketCrypt.keyLength; i++) {
      this.key[i] = keyPart[0][i] ^ keyPart[1][i];
    }
  }
};

registerPacket(Id.PKT_ENCRYPTION_START_REQ, Packet.SC.PKT_ENCRYPTION_START_REQ);

Packet.CS.PKT_ACCOUNT_LOGIN = function() {
  this.username = '';
  this.password = '';
};

Packet.CS.PKT_ACCOUNT_LOGIN.prototype.build = function() {
  const length = 1 + 1 + this.username.length + 1 + this.password.length;
  const buf = new BinaryWriter(length);
  buf.setUint8(Id.PKT_ACCOUNT_LOGIN);
  buf.setUint8(this.username.length);
  buf.setString(this.username);
  buf.setUint8(this.password.length);
  buf.setString(this.password);
  return buf;
};

Packet.SC.PKT_ACCOUNT_LOGIN = function(buf) {
  this.success = buf.getUint8() == Constants.SUCCESS ? true : false;

  if (this.success) {
    this.lastCharacterSlot = buf.getUint8();
    this.characterCount = buf.getUint8();
    this.character = [];

    for (let i = 0; i < this.characterCount; i++)
    {
      this.character[i] = {};
      this.character[i].name = buf.getString(buf.getUint8());
      this.character[i].job = buf.getInt16();
      this.character[i].level = buf.getInt16();
      this.character[i].strength = buf.getInt16();
      this.character[i].dexterity = buf.getInt16();
      this.character[i].intelligence = buf.getInt16();
      this.character[i].charisma = buf.getInt16();
      this.character[i].wisdom = buf.getInt16();
      this.character[i].constitution = buf.getInt16();
      this.character[i].health = buf.getInt16();
      this.character[i].healthMaximum = buf.getInt16();
      this.character[i].mana = buf.getInt16();
      this.character[i].manaMaximum = buf.getInt16();
      this.character[i].stamina = buf.getInt16();
      this.character[i].staminaMaximum = buf.getInt16();
      this.character[i].age = buf.getInt16();
      this.character[i].moral = buf.getInt16();
      this.character[i].gender = buf.getInt16();
      this.character[i].hair = buf.getInt16();
      this.character[i].hairMode = buf.getInt16();
      this.character[i].skin = buf.getInt16();
      this.character[i].guildName = buf.getString(buf.getUint8());
      this.character[i].fame = buf.getInt16();
      this.character[i].swordExp = buf.getInt32();
      this.character[i].spearExp = buf.getInt32();
      this.character[i].bowExp = buf.getInt32();
      this.character[i].axeExp = buf.getInt32();
      this.character[i].knuckleExp = buf.getInt32();
      this.character[i].staffExp = buf.getInt32();
      this.character[i].weaponMakeExp = buf.getInt32();
      this.character[i].armorMakeExp = buf.getInt32();
      this.character[i].accessoryMakeExp = buf.getInt32();
      this.character[i].potionMakeExp = buf.getInt32();
      this.character[i].cookingExp = buf.getInt32();
      this.character[i].equippedItem = [];
      for (let j = 0; j < Constants.EQUIP_ITEM_NUM; j++) {
        this.character[i].equippedItem[j] = buf.getInt16();
        if (this.character[i].equippedItem[j] == -1) {
          this.character[i].equippedItem[j] = 0;
        }
      }

      this.character[i].notUsed = buf.getUint8();

      this.character[i].name = this.character[i].name.toUpperCase();
      this.character[i].guildName = this.character[i].guildName.toUpperCase();
      this.character[i].gender = !this.character[i].gender;
    }
  }
};

registerPacket(Id.PKT_ACCOUNT_LOGIN, Packet.SC.PKT_ACCOUNT_LOGIN);

Packet.SC.PKT_USERMODIFY = function(buf) {
  this.add = (buf.getUint8() == Constants.INFO_MODIFY);
  this.serverId = buf.getInt32();
  this.job = buf.getInt16();
  this.x = buf.getInt16();
  this.y = buf.getInt16();

  if (this.add) {
    this.canAttack = !!buf.getUint8();
    this.name = buf.getString(buf.getUint8());
    this.unknown1 = buf.getUint8();
    this.guildName = buf.getString(buf.getUint8());
    this.guildPictureId = buf.getUint16();
    this.guildRank = buf.getUint8();
    this.inGuildWar = !!buf.getUint8();
    this.guildTownWarType = buf.getInt16();
    this.guildId = buf.getInt16();
    this.guildWarGuildId = buf.getInt16();
    this.guildWarDied = !!buf.getUint8();
    this.partyLeaderName = buf.getString(buf.getUint8());
    this.worldWar = !!buf.getUint8();
    this.healthMaximum = buf.getUint16();
    this.health = buf.getUint16();
    this.hair = buf.getUint16();
    this.hairMode = buf.getUint16();
    this.skin = buf.getUint16();
    this.gender = buf.getUint16();
    if (this.serverId < 10000) {
      this.gender = !this.gender;
    }

    this.moral = buf.getUint16();
    this.isAlive = !!buf.getUint8();
    this.pkEnabled = !!buf.getUint8();
    this.battleMode = buf.getUint8();
    this.weaponSpeed = buf.getUint16();
    this.direction = buf.getUint16();
    this.grayMode = buf.getUint8();

    this.equippedItem = [];
    for (let i = 0; i < Constants.EQUIP_ITEM_NUM; i++) {
      this.equippedItem[i] = {};
      this.equippedItem[i].pictureId = buf.getInt16();
      if (this.equippedItem[i].pictureId == -1) {
        this.equippedItem[i].pictureId = 0;
      }

      this.equippedItem[i].type = buf.getInt16();
      this.equippedItem[i].arm = buf.getInt16();
    }

    this.unknown2 = buf.getInt16();

    this.activeMagic = [];
    while (!!buf.getUint8()) {
      this.activeMagic.push({
        id: buf.getUint16(),
        remainingTime: buf.getUint32()
      });
    }

    this.activeSpecialAttack = [];
    while (!!buf.getUint8()) {
      this.activeSpecialAttack.push({
        id: buf.getUint16(),
        remainingTime: buf.getUint32()
      });
    }
  }
}

registerPacket(Id.PKT_USERMODIFY, Packet.SC.PKT_USERMODIFY);

Packet.SC.PKT_CHARACTER_DATA = function(buf) {
  this.serverId = buf.getInt32();
  this.type = buf.getUint8();
  if (this.type & Constants.INFO_NAMES) {
    this.name = buf.getString(buf.getUint8());
    this.pos = buf.getInt32();
    this.guildName = buf.getString(buf.getUint8());
    this.designation = buf.getString(buf.getUint8());
  }

  if (this.type & Constants.INFO_BASICVALUE) {
    this.money = buf.getUint32();
    this.moral = buf.getInt16();
    this.age = buf.getUint16();
    this.gender = buf.getUint16();
    this.strength = buf.getUint16();
    this.dexterity = buf.getUint16();
    this.intelligence = buf.getUint16();
    this.wisdom = buf.getUint16();
    this.charisma = buf.getUint16();
    this.constitution = buf.getUint16();
  }

  if (this.type & Constants.INFO_EXTVALUE) {
    this.level = buf.getUint16();
    this.expMaximum = buf.getUint32();
    this.exp = buf.getUint32();
    this.healthMaximum = buf.getUint16();
    this.health = buf.getUint16();
    this.manaMaximum = buf.getUint16();
    this.mana = buf.getUint16();
    this.weightMaximum = buf.getUint16();
    this.weight = buf.getUint16();
    this.staminaMaximum = buf.getUint16();
    this.stamina = buf.getUint16();
  }

  if (this.type & Constants.INFO_WEAPONEXP) {
    this.swordExp = buf.getUint32();
    this.spearExp = buf.getUint32();
    this.axeExp = buf.getUint32();
    this.knuckleExp = buf.getUint32();
    this.bowExp = buf.getUint32();
    this.staffExp = buf.getUint32();
  }

  if (this.type & Constants.INFO_MAKEEXP) {
    this.weaponMakeExp = buf.getUint32();
    this.armorMakeExp = buf.getUint32();
    this.accessoryMakeExp = buf.getUint32();
    this.potionMakeExp = buf.getUint32();
    this.cookingExp = buf.getUint32();
  }

  if (this.type & Constants.INFO_MAGICEXP) {
    this.blackMagicExp = buf.getUint32();
    this.whiteMagicExp = buf.getUint32();
    this.blueMagicExp = buf.getUint32();
  }
}

registerPacket(Id.PKT_CHARACTER_DATA, Packet.SC.PKT_CHARACTER_DATA);

Packet.SC.PKT_INV_ALL = function(buf) {
  this.serverId = buf.getInt32();
  this.inventoryCount = buf.getUint16();
  this.beltCount = buf.getUint16();

  this.inventory = [];
  for (let i = 0; i < this.inventoryCount; i++) {
    const index = buf.getUint16();
    this.inventory[index] = parseItemInfo(buf, Constants.ITEM_ME, false);
  }

  this.belt = [];
  for (let i = 0; i < this.beltCount; i++) {
    const index = buf.getUint16();
    this.belt[index] = parseItemInfo(buf, Constants.ITEM_ME, false);
  }
}

registerPacket(Id.PKT_INV_ALL, Packet.SC.PKT_INV_ALL);

Packet.SC.PKT_SET_TIME = function(buf) {
  this.time = {
    year: buf.getInt16(),
    month: buf.getInt16(),
    day: buf.getInt16(),
    hour: buf.getInt16(),
    minute: buf.getInt16()
  };
  this.weather = buf.getUint8();
  this.unknown1 = buf.getUint8();
  this.nightState = buf.getUint8();
  this.unknown2 = buf.getInt32();
}

registerPacket(Id.PKT_SET_TIME, Packet.SC.PKT_SET_TIME);

Packet.SC.PKT_MAGIC_ALL = function(buf) {
  this.type = buf.getUint8();
  this.count = buf.getUint16();
  switch (this.type) {
    case 1: // Magic
      this.magicList = [];
      for (let i = 0; i < this.count; i++) {
        this.magicList[i] = {};
        this.magicList[i].id = buf.getInt16();
        this.magicList[i].method = buf.getUint8();
        this.magicList[i].characterOrAxis = buf.getUint8();
        this.magicList[i].startTime = buf.getUint16();
        this.magicList[i].type = buf.getUint8();
        this.magicList[i].targetMethod = buf.getUint8();
        this.magicList[i].name = buf.getString(buf.getUint8());
        this.magicList[i].description = buf.getString(buf.getUint8());
        this.magicList[i].range = buf.getUint16();
        this.magicList[i].manaCost = buf.getUint16();
        this.magicList[i].duration = buf.getUint32();
        this.magicList[i].damage = buf.getInt16();
        this.magicList[i].requiredSkill = buf.getUint16();
        this.magicList[i].requiredInt = buf.getUint16();
        this.magicList[i].requiredLevel = buf.getUint16();
        this.magicList[i].unknown = buf.getUint16();
      }

      break;
    case 2: // Special Attack
      this.specialAttackList = [];
      for (let i = 0; i < this.count; i++) {
        this.specialAttackList[i] = {};
        this.specialAttackList[i].id = buf.getInt16();
        this.specialAttackList[i].targetMethod = buf.getUint8();
        this.specialAttackList[i].name = buf.getString(buf.getUint8());
        this.specialAttackList[i].description = buf.getString(buf.getUint8());
        this.specialAttackList[i].range = buf.getUint16();
        this.specialAttackList[i].healthCost = buf.getUint16();
        this.specialAttackList[i].manaCost = buf.getUint16();
        this.specialAttackList[i].staminaCost = buf.getUint16();
        this.specialAttackList[i].duration = buf.getUint32();
        this.specialAttackList[i].cooldown = buf.getUint32();
        this.specialAttackList[i].damage = buf.getInt16();
        this.specialAttackList[i].requiredSkill = buf.getUint16();
        this.specialAttackList[i].weaponType = buf.getUint8();
        this.specialAttackList[i].changeTime = buf.getUint32();
        this.specialAttackList[i].healthChange = buf.getUint16();
        this.specialAttackList[i].manaChange = buf.getUint16();
        this.specialAttackList[i].unknown = buf.getUint16();
      }

      break;
    case 3: // Ability
      this.abilityList = [];
      for (let i = 0; i < this.count; i++) {
        this.abilityList[i] = {};
        this.abilityList[i].id = buf.getInt16();
        this.abilityList[i].type = buf.getUint8();
        this.abilityList[i].name = buf.getString(buf.getUint8());
        this.abilityList[i].description = buf.getString(buf.getUint8());
        this.abilityList[i].requiredSkill = buf.getUint16();
        this.abilityList[i].unknown = buf.getUint16();
        this.abilityList[i].useCount = buf.getUint16();
        this.abilityList[i].useCountMaximum = buf.getUint16();
      }

      const skipCount = buf.getUint16();
      for (let i = 0; i < skipCount; i++) buf.getUint16();

      this.belt = [];
      for (let i = 0; i < Constants.MAGIC_SLOT_COUNT; i++) {
        this.belt[i] = {};
        this.belt[i].type = buf.getUint8();
        this.belt[i].id = buf.getInt16();
      }

      break;
    default:
      break;
  }
}

registerPacket(Id.PKT_MAGIC_ALL, Packet.SC.PKT_MAGIC_ALL);

Packet.SC.PKT_CONTRIBUTION_STATUS = function(buf) {
}

registerPacket(Id.PKT_CONTRIBUTION_STATUS, Packet.SC.PKT_CONTRIBUTION_STATUS);

Packet.SC.PKT_ALLCHAT_STATUS = function(buf) {
  this.allChatEnabled = !!buf.getUint8();
}

registerPacket(Id.PKT_ALLCHAT_STATUS, Packet.SC.PKT_ALLCHAT_STATUS);

Packet.CS.PKT_CHAT = function() {
  this.type = ChatType.NORMAL;
  this.text = '';
};

Packet.CS.PKT_CHAT.prototype.build = function() {
  const length = 1 + 1 + this.text.length;
  const buf = new BinaryWriter(length);
  buf.setUint8(Id.PKT_CHAT);
  buf.setUint8(this.type);
  buf.setString(this.text);
  return buf;
};

Packet.SC.PKT_CHAT = function(buf) {
  this.type = buf.getUint8();
  switch (this.type) {
    case ChatType.NORMAL:
    case ChatType.SHOUT:
      this.serverId = buf.getInt32();
      this.classType = buf.getUint16();
      this.name = buf.getString(buf.getUint8()).toUpperCase();
      this.text = buf.getString(buf.getUint8());
      break;
    case ChatType.ZONE:
      this.serverId = buf.getInt32();
      this.classType = buf.getUint16();
      this.r = buf.getUint8();
      this.g = buf.getUint8();
      this.b = buf.getUint8();
      this.name = buf.getString(buf.getUint8()).toUpperCase();
      this.text = buf.getString(buf.getUint8());
      break;
    case ChatType.GUILD:
    case ChatType.PARTY:
      this.serverId = buf.getInt32();
      this.name = buf.getString(buf.getUint8()).toUpperCase();
      this.text = buf.getString(buf.getUint8());
      break;
    case ChatType.SYSTEM:
    case ChatType.GM_NOTICE:
    case ChatType.YELLOW_STAT:
    case ChatType.BLUE_STAT:
      this.text = buf.getString(buf.getUint8());
      break;
  }
}

registerPacket(Id.PKT_CHAT, Packet.SC.PKT_CHAT);

Packet.CS.PKT_GAMESTART = function() {
};

Packet.CS.PKT_GAMESTART.prototype.build = function() {
  const length = 1;
  const buf = new BinaryWriter(length);
  buf.setUint8(Id.PKT_GAMESTART);
  return buf;
};

Packet.SC.PKT_MOVEFIRST = function(buf) {
  this.success = buf.getUint8() == Constants.SUCCESS ? true : false;
  this.serverId = buf.getInt32();
  this.worldWarAreaOwner = buf.getInt16();
  this.destination = {x: buf.getInt16(), y: buf.getInt16()};
  this.first = {x: buf.getInt16(), y: buf.getInt16()};
  this.stamina = buf.getUint16();
  this.direction = buf.getUint16();
}

registerPacket(Id.PKT_MOVEFIRST, Packet.SC.PKT_MOVEFIRST);

Packet.SC.PKT_MOVEMIDDLE = function(buf) {
  this.success = buf.getUint8() == Constants.SUCCESS ? true : false;
  this.serverId = buf.getInt32();
  this.worldWarAreaOwner = buf.getInt16();
  this.destination = {x: buf.getInt16(), y: buf.getInt16()};
  this.stamina = buf.getUint16();
  this.direction = buf.getUint16();
}

registerPacket(Id.PKT_MOVEMIDDLE, Packet.SC.PKT_MOVEMIDDLE);

Packet.SC.PKT_MOVEEND = function(buf) {
  this.success = buf.getUint8() == Constants.SUCCESS ? true : false;
  this.serverId = buf.getInt32();
  this.worldWarAreaOwner = buf.getInt16();
  this.destination = {x: buf.getInt16(), y: buf.getInt16()};
  this.stamina = buf.getUint16();
  this.direction = buf.getUint16();
}

registerPacket(Id.PKT_MOVEEND, Packet.SC.PKT_MOVEEND);

Packet.SC.PKT_RUN_MOVEFIRST = function(buf) {
  this.success = buf.getUint8() == Constants.SUCCESS ? true : false;
  this.serverId = buf.getInt32();
  this.worldWarAreaOwner = buf.getInt16();
  this.destination = {x: buf.getInt16(), y: buf.getInt16()};
  this.first = {x: buf.getInt16(), y: buf.getInt16()};
  this.next = {x: buf.getInt16(), y: buf.getInt16()};
  this.stamina = buf.getUint16();
  this.direction = buf.getUint16();
}

registerPacket(Id.PKT_RUN_MOVEFIRST, Packet.SC.PKT_RUN_MOVEFIRST);

Packet.SC.PKT_RUN_MOVEMIDDLE = function(buf) {
  this.success = buf.getUint8() == Constants.SUCCESS ? true : false;
  this.serverId = buf.getInt32();
  this.worldWarAreaOwner = buf.getInt16();
  this.destination = {x: buf.getInt16(), y: buf.getInt16()};
  this.next = {x: buf.getInt16(), y: buf.getInt16()};
  this.stamina = buf.getUint16();
  this.direction = buf.getUint16();
}

registerPacket(Id.PKT_RUN_MOVEMIDDLE, Packet.SC.PKT_RUN_MOVEMIDDLE);

Packet.SC.PKT_RUN_MOVEEND = function(buf) {
  this.success = buf.getUint8() == Constants.SUCCESS ? true : false;
  this.serverId = buf.getInt32();
  this.worldWarAreaOwner = buf.getInt16();
  this.destination = {x: buf.getInt16(), y: buf.getInt16()};
  this.next = {x: buf.getInt16(), y: buf.getInt16()};
  this.stamina = buf.getUint16();
  this.direction = buf.getUint16();
}

registerPacket(Id.PKT_RUN_MOVEEND, Packet.SC.PKT_RUN_MOVEEND);

Packet.CS.PKT_CHANGEDIR = function() {
  this.serverId = -1;
  this.direction = 0;
};

Packet.CS.PKT_CHANGEDIR.prototype.build = function() {
  const length = 1 + 4 + 1;
  const buf = new BinaryWriter(length);
  buf.setUint8(Id.PKT_CHANGEDIR);
  buf.setInt32(this.serverId);
  buf.setUint8(this.direction);
  return buf;
};

Packet.SC.PKT_CHANGEDIR = function(buf) {
  this.serverId = buf.getInt32();
  this.direction = buf.getUint8();
}

registerPacket(Id.PKT_CHANGEDIR, Packet.SC.PKT_CHANGEDIR);

Packet.CS.PKT_BATTLEMODE = function() {
  this.battleMode = 0;
};

Packet.CS.PKT_BATTLEMODE.prototype.build = function() {
  const length = 1 + 1;
  const buf = new BinaryWriter(length);
  buf.setUint8(Id.PKT_BATTLEMODE);
  buf.setUint8(this.battleMode);
  return buf;
};

Packet.SC.PKT_BATTLEMODE = function(buf) {
  this.serverId = buf.getInt32();
  this.battleMode = buf.getUint8();
}

registerPacket(Id.PKT_BATTLEMODE, Packet.SC.PKT_BATTLEMODE);

Packet.SC.PKT_EVENTNORMAL = function(buf) {
  this.text = buf.getString(buf.getUint16());
}

registerPacket(Id.PKT_EVENTNORMAL, Packet.SC.PKT_EVENTNORMAL);

Packet.CS.PKT_EVENTSELBOX = function() {
  this.selectionIndex = 0;
};

Packet.CS.PKT_EVENTSELBOX.prototype.build = function() {
  const length = 1 + 2;
  const buf = new BinaryWriter(length);
  buf.setUint8(Id.PKT_EVENTSELBOX);
  buf.setUint16(this.selectionIndex);
  return buf;
};

Packet.SC.PKT_EVENTSELBOX = function(buf) {
  this.text = buf.getString(buf.getUint16());
  this.selections = [];
  for (let i = 0; i < 4; i++) {
    this.selections[i] = buf.getString(buf.getUint16());
  }
}

registerPacket(Id.PKT_EVENTSELBOX, Packet.SC.PKT_EVENTSELBOX);

Packet.SC.PKT_EVENTOKBOX = function(buf) {
  this.text = buf.getString(buf.getUint16());
}

registerPacket(Id.PKT_EVENTOKBOX, Packet.SC.PKT_EVENTOKBOX);

Packet.CS.PKT_NPC_INTERACT = function() {
  this.serverId = -1;
};

Packet.CS.PKT_NPC_INTERACT.prototype.build = function() {
  const length = 1 + 1 + 4;
  const buf = new BinaryWriter(length);
  buf.setUint8(Id.PKT_NPC_INTERACT);
  buf.setUint8(2);
  buf.setInt32(this.serverId);
  return buf;
};

export default Packet;
