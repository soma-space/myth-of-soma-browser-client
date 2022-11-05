/**
 * Packet Encryption and Decryption
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
const XOR1MUL = 0x91; //0x009D;
const XOR3BASE = 0xA5813F01; //0x086D;
const XOR3MUL = 0x087B;
const XORKEY_LENGTH = 8;

/**
 * Encrypt or Decrypt the input of length using key.
 * @param {number[]} key - Key to be used.
 * @param {string[]} input - Data to be encrypted or decrypted.
 * @param {number} length - Input length.
 */
function encodeDecode(key, input, length) {
  const XOR1 = (length * XOR1MUL) & 0xFF;
  let WORD_XOR3 = XOR3BASE;
  for (let i = 0; i < length; i++) {
    const BYTE_XOR3 = (WORD_XOR3 >> 8) & 0xFF;
    input[i] = input[i] ^ XOR1 ^ key[i % XORKEY_LENGTH] ^ BYTE_XOR3;
    WORD_XOR3 = (WORD_XOR3 * XOR3MUL) & 0xFFFF;
  }
}

const PacketCrypt = {
  encrypt: encodeDecode,
  decrypt: encodeDecode,
  keyLength: XORKEY_LENGTH
};

export default PacketCrypt;
