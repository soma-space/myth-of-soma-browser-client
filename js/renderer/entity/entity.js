/**
 * Entity
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import EntityView from 'renderer/entity/entityview';
import EntityRender from 'renderer/entity/entityrender';
import EntityAction from 'renderer/entity/entityaction';
import EntityDisplay from 'renderer/entity/entitydisplay';
import EntityControl from 'controls/entitycontrol';

import BattleMode from 'db/entity/battlemode';
import Direction from 'db/entity/direction';

import {pixelToCell, cellToPixel} from 'utils/positionconvert';

class Entity {
  /**
   * Entity constructor
   * @constructor
   * @this {Entity}
   */
  constructor() {
    this.serverId = -1;
    this.x = 0;
    this.y = 0;
    this.cellX = 0;
    this.cellY = 0;
    this._skin = -1;
    this._job = -1;
    this._gender = -1;
    this._hair = -1;
    this._armorHelmet = -1;
    this._armorTop = -1;
    this._armorPad = -1;
    this._armorBoot = -1;
    this._weapon = -1;
    this._shield = -1;
    this._direction = Direction.DOWN;
    this.type = Entity.TYPE_UNKNOWN;
    this._battleMode = BattleMode.NORMAL;

    this.view = new EntityView(this);
    this.render = new EntityRender(this);
    this.action = new EntityAction(this);
    this.display = new EntityDisplay(this);
    this.control = new EntityControl(this);
  }

  clean() {
    this.display.clean();
  }

  /**
   * Sets the pixel position and cell position of the entity using the given pixel position.
   * @param {number} pixelX - The X component of the pixel position.
   * @param {number} pixelY - The Y component of the pixel position.
   */
  setPosition(pixelX, pixelY) {
    var cellPosition = pixelToCell(pixelX, pixelY);
    this.x = pixelX;
    this.y = pixelY;
    this.cellX = cellPosition.x;
    this.cellY = cellPosition.y;
  }

  /**
   * Sets the pixel position and cell position of the entity using the given cell position.
   * @param {number} cellX - The X component of the cell position.
   * @param {number} cellY - The Y component of the cell position.
   */
  setCellPosition(cellX, cellY) {
    var pixelPosition = cellToPixel(cellX, cellY);
    this.x = pixelPosition.x;
    this.y = pixelPosition.y;
    this.cellX = cellX;
    this.cellY = cellY;
  }

  getDirectionTo(toX, toY) {
    const x = toX - this.cellX;
    const y = toY - this.cellY;

    let dir;
    if (x >= 1) dir = y <= -1 ? Direction.UP_RIGHT : y == 0 ? Direction.RIGHT : Direction.DOWN_RIGHT;
    if (x == 0) dir = y <= -1 ? Direction.UP : Direction.DOWN;
    if (x <= -1) dir = y <= -1 ? Direction.UP_LEFT : y == 0 ? Direction.LEFT : Direction.DOWN_LEFT;

    return dir;
  }

  get skin() {
    return this._skin;
  }

  set skin(value) {
    this.view.updateBody(value, this._gender, this._job, this.action.get());
  }

  get hair() {
    return this._hair;
  }

  set hair(value) {
    this.view.updateHead(this._armorHelmet, value, this._gender, this._job, this.action.get());
  }

  get armorHelmet() {
    return this._armorHelmet;
  }

  set armorHelmet(value) {
    this.view.updateHead(value, this._hair, this._gender, this._job, this.action.get());
  }

  get armorTop() {
    return this._armorTop;
  }

  set armorTop(value) {
    this.view.updateEquipment('armorTop', value, this._gender, this.action.get());
  }

  get armorBoot() {
    return this._armorBoot;
  }

  set armorBoot(value) {
    this.view.updateEquipment('armorBoot', value, this._gender, this.action.get());
  }

  get armorPad() {
    return this._armorPad;
  }

  set armorPad(value) {
    this.view.updateEquipment('armorPad', value, this._gender, this.action.get());
  }

  get shield() {
    return this._shield;
  }

  set shield(value) {
    this.view.updateEquipment('shield', value, this._gender, this.action.get());
  }

  get weapon() {
    return this._weapon;
  }

  set weapon(value) {
    this.view.updateEquipment('weapon', value, this._gender, this.action.get());
  }

  get job() {
    return this._job;
  }

  set job(value) {
    this._job = value;
    this.view.updateAll();
  }

  get gender() {
    return this._gender;
  }

  set gender(value) {
    this._gender = value;
    this.view.updateAll();
  }

  get battleMode() {
    return this._battleMode;
  }

  set battleMode(value) {
    this._battleMode = value;
    this.view.updateAll();
  }

  get direction() {
    return this._direction;
  }

  set direction(value) {
    this._direction = value;
    this.view.updateDrawOrder();
  }
}

Entity.TYPE_UNKNOWN = -1;
Entity.TYPE_PC = 0;
Entity.TYPE_NPC = 1;

export default Entity;
