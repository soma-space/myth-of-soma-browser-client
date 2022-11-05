/**
 * MessageBox UI
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import UIComponent from 'ui/uicomponent';
import Keys from 'input/keyboard';
import htmlText from './messagebox.html!text';
import cssText from './messagebox.css!text';

class MessageBox extends UIComponent {
  /**
   * MessageBox constructor
   * @constructor
   * @this {MessageBox}
   */
  constructor(text, callback) {
    super('MessageBox', htmlText, cssText);

    this.text = text;
    this.callback = callback;
  }

  /**
   * Do Initialization.
   */
  onPrepare() {
    this.$messageBox = this.$ui.find('.message-box');
	
	this.$ui.find('.message-box').click(this.accept.bind(this));
  }

  onAppend() {
    this.$messageBox.find('.text').text(this.text);

    // Push this UI component's keydown event to the top
    // so that it is handled first and can block all
    // keydown events using event.stopImmediatePropagation();
    const events = $._data(document, 'events').keydown;
    events.unshift(events.pop());

    document.activeElement.blur();
  }

  /**
   * Key Event Handler
   * @param {object} event
   * @returns {boolean} return false to stop bubbling and prevent default action.
   */
  onKeyDown(event) {
    event.stopImmediatePropagation();
    switch (event.which) {
      case Keys.ENTER:
      case Keys.ESCAPE:
        this.accept();

        return false;
      default:
        return false;
    }
  }
  
  accept() {
	this.remove();
	if (this.callback) {
	  this.callback();
	}
  }
}

/**
 * Show a message box
 *
 * @param {string} the message to be shown.
 * @param {callback} callback when message box is closed.
 */
function showMessageBox(text, callback) {
  messageBox = new MessageBox(text, callback);
  messageBox.append();
}

export default showMessageBox;
