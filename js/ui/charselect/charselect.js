/**
 * Login UI
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import UIComponent from 'ui/uicomponent';
import Keys from 'input/keyboard';
import htmlText from './charselect.html!text';
import cssText from './charselect.css!text';
import Renderer from 'renderer/renderer';
import SpriteRenderer from 'renderer/spriterenderer';

class CharSelect extends UIComponent {
  /**
   * CharSelect constructor
   * @constructor
   * @this {Login}
   */
  constructor() {
    super('CharSelect', htmlText, cssText);

    this.index = 0;
    this.maxSlots = 3;
    this.context = [];
    this.slots = [];
    this.entitySlots = [];
  }

  /**
   * Do Initialization.
   */
  onPrepare() {
    this.$ui.find('.ok').click(this.ok.bind(this));
    this.$ui.find('.exit').click(this.exit.bind(this));
    this.$ui.find('.human-world').click(this.createHumanCharacter.bind(this));
    this.$ui.find('.devil-world').click(this.createDevilCharacter.bind(this));
    this.$ui.find('.arrow-left').click(() => this.moveToSlot(this.index - 1));
    this.$ui.find('.arrow-right').click(() => this.moveToSlot(this.index + 1));

    this.$ui.find('canvas').each((index, canvas) => {
      console.log('add context');
      this.context.push(canvas.getContext('2d'));
    });

    this.$charInfo = this.$ui.find('.char-info');
  }

  onAppend() {
    Renderer.render(this.render.bind(this));
  }

  onRemove() {
    this.slots.length = 0;

    Renderer.stop(this.render);
  }

  /**
   * Key Event Handler
   * @param {object} event
   * @returns {boolean} return false to stop bubbling and prevent default action.
   */
  onKeyDown(event) {
    switch (event.which) {
      case Keys.ENTER:
        this.ok();
        break;
      case Keys.LEFT:
        this.moveToSlot(this.index - 1);
        break;
      case Keys.RIGHT:
        this.moveToSlot(this.index + 1);
        break;
      default:
        return true;
    }
    event.stopImmediatePropagation();
    return false;
  }

  ok() {
    if (this.slots[this.index]) {
      this.onCharacterSelected(this.slots[this.index]);
    }
  }

  exit() {
    this.onExitRequest();
  }

  createHumanCharacter() {
    console.log(`create human character`);
  }

  createDevilCharacter() {
    console.log(`create devil character`);
  }

  moveToSlot(index) {
    this.index = (index + this.maxSlots) % this.maxSlots;

    if (!this.slots[this.index]) {
      this.$charInfo.find('div').empty();
      return;
    }

    const character = this.slots[this.index];
    this.$charInfo.find('.name').text(character.name);
    this.$charInfo.find('.guild').text(character.guildName);
    this.$charInfo.find('.age').text(character.age);
    this.$charInfo.find('.position').text(character.fame);
    this.$charInfo.find('.moral').text(character.moral);
    this.$charInfo.find('.level').text(character.level);
    this.$charInfo.find('.health').text(`${character.health} / ${character.healthMaximum}`);
    this.$charInfo.find('.mana').text(`${character.mana} / ${character.manaMaximum}`);
    this.$charInfo.find('.stamina').text(`${character.stamina} / ${character.staminaMaximum}`);
    this.$charInfo.find('.main-weapon').text('');
    this.$charInfo.find('.main-skill').text('');
    this.$charInfo.find('.strength').text((character.strength / 10).toFixed(1));
    this.$charInfo.find('.intelligence').text((character.intelligence / 10).toFixed(1));
    this.$charInfo.find('.dexterity').text((character.dexterity / 10).toFixed(1));
    this.$charInfo.find('.wisdom').text((character.wisdom / 10).toFixed(1));
    this.$charInfo.find('.charisma').text((character.charisma / 10).toFixed(1));
    this.$charInfo.find('.constitution').text((character.constitution / 10).toFixed(1));

    console.log(`currently selected slot index is ${this.index}`);
  }

  render() {
    for (let i = 0; i < this.context.length; i++) {
      this.context[i].clearRect(0, 0, this.context[i].canvas.width, this.context[i].canvas.height);
      SpriteRenderer.bind2DContext(this.context[i], 0, 0);
      if (this.entitySlots[i]) {
        this.entitySlots[i].render();
      }
    }
  }

  addCharacter(character) {
    this.slots.push(character);
  }

  /**
   * Functions to be redefined elsewhere
   */
  onCharacterSelected(character) {}

  onExitRequest() {}
}
export default new CharSelect();
