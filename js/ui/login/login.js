/**
 * Login UI
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import UIComponent from 'ui/uicomponent';
import Keys from 'input/keyboard';
import htmlText from './login.html!text';
import cssText from './login.css!text';

class Login extends UIComponent {
  /**
   * Login constructor
   * @constructor
   * @this {Login}
   */
  constructor() {
    super('Login', htmlText, cssText);
  }

  /**
   * Do Initialization.
   */
  onPrepare() {
    this.$inputUsername = this.$ui.find('.username');
    this.$inputPassword = this.$ui.find('.password');

    this.$ui.find('.ok').click(this.login.bind(this));
    this.$ui.find('.cancel').click(this.exit.bind(this));
  }

  onAppend() {
    this.$inputUsername.val('');
    this.$inputPassword.val('');
    this.$inputUsername.focus();
  }

  /**
   * Key Event Handler
   * @param {object} event
   * @returns {boolean} return false to stop bubbling and prevent default action.
   */
  onKeyDown(event) {
    switch (event.which) {
      case Keys.ENTER:
        console.log('keydown login');
        this.login();
        event.stopImmediatePropagation();
        return false;
      case Keys.ESCAPE:
        this.exit();
        event.stopImmediatePropagation();
        return false;
      case Keys.TAB:
        const input = document.activeElement === this.$inputUsername[0] ? this.$inputPassword : this.$inputUsername;
        input.focus().select();
        event.stopImmediatePropagation();
        return false;
      default:
        return true;
    }
  }

  login() {
    const username = this.$inputUsername.val();
    const password = this.$inputPassword.val();
    this.onConnectionRequest(username, password);
  }

  exit() {
    console.log('exit clicked, does nothing atm');
  }

  /**
   * Functions to be redefined elsewhere
   */
  onConnectionRequest(username, password) {}
}
export default new Login();
