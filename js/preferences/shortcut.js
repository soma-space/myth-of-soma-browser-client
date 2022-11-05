/**
 * Shortcut Preferences
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import Keys from 'input/keyboard';

const Shortcut = {};

Shortcut[Keys.TAB] = {component: 'HUD', action: 'change_battle_mode'};
Shortcut[Keys.F12] = {component: 'ChatHistory', action: 'toggle'};

export default Shortcut;
