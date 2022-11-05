/**
 * Network Session Packet identifiers
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
/**
 * Packet identifiers
 */
const SMPROTOCOL = 0x8000;
const ids = {
  SM_LOGIN_REQ: SMPROTOCOL + 0,
  SM_LOGIN_ACK: SMPROTOCOL + 1,
  SM_GAME_REQ: SMPROTOCOL + 12,
  SM_GAMEINFO_ACK: SMPROTOCOL + 15,
  SM_UPGRADING_ACK: SMPROTOCOL + 21,
  SM_GAMEINFO2_REQ: SMPROTOCOL + 22,
  SM_CONNECTINFO_ACK: SMPROTOCOL + 100,
  SM_ALIVE_ACK: SMPROTOCOL + 999
};

export default ids;
