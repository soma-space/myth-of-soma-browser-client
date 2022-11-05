/**
 * Shortcut
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import Mouse from 'controls/mouse';
import Keys from 'input/keyboard';
import Preferences from 'preferences/shortcut';
import UIComponent from 'ui/uicomponent';

const Shortcut = {
  /**
   * Process shortcut
   * @param {number} key code
   */
  process(keyCode) {
    const shortcut = Preferences[keyCode];
    if (shortcut &&
        (!!shortcut.shift) === Keys.SHIFT &&
        (!!shortcut.ctrl) === Keys.CTRL &&
        (!!shortcut.alt) === Keys.ALT) {
      const component = UIComponent.getComponent(shortcut.component);
      if (component.onShortcut) {
        component.onShortcut(shortcut);
        return true;
      }
    }

    return false;
  }
};

export default Shortcut;
