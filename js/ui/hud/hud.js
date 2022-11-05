/**
 * HUD UI
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import UIComponent from 'ui/uicomponent';
import htmlText from './hud.html!text';
import cssText from './hud.css!text';
import Keys from 'input/keyboard';
import BattleMode from 'db/entity/battlemode';
import ChatHistory from 'ui/chathistory/chathistory';
import Shortcut from 'controls/shortcut';

class HUD extends UIComponent {
  /**
   * HUD constructor
   * @constructor
   * @this {HUD}
   */
  constructor() {
    super('HUD', htmlText, cssText);
  }

  /**
   * Do Initialization.
   */
  onPrepare() {
    this.$ui.find('.hud-toolbar-toggle').click(function() {
      $(this).parent('.hud-toolbar').toggleClass('active')
    });

    this.$battleMode = this.$ui.find('.hud-toolbar-battle');
    this.$battleMode.click(this.changeBattleMode.bind(this));

    this.$ui.find('.hud-toolbar-chat').click(() => ChatHistory.toggle());
  }

  /**
   * Process Shortcut
   * @param {object} shortcut
   */
  onShortcut(shortcut) {
    switch (shortcut.action) {
      case 'change_battle_mode':
        this.changeBattleMode();
        break;
    }
  }

  /**
   * Key Event Handler
   * @param {object} event
   * @returns {boolean} return false to stop bubbling and prevent default action.
   */
  onKeyDown(event) {
    switch (event.which) {
      default:
        if (Shortcut.process(event.which)) {
          break;
        } else {
          return true;
        }
    }

    event.stopImmediatePropagation();
    return false;
  }

  changeBattleMode() {
    if (this.$battleMode.hasClass('off')) {
      this.$battleMode.removeClass('off').addClass('battle');
      this.onBattleModeChange(BattleMode.BATTLE);
    } else if (this.$battleMode.hasClass('battle')) {
      this.$battleMode.removeClass('battle').addClass('pk');
      this.onBattleModeChange(BattleMode.PK);
    } else {
      this.$battleMode.removeClass('pk').addClass('off');
      this.onBattleModeChange(BattleMode.NORMAL);
    }
  }

  /**
   * Functions to be redefined elsewhere
   */
  onBattleModeChange(/*battleMode*/) {}
}
export default new HUD();
