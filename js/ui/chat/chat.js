/**
 * Chat UI
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import UIComponent from 'ui/uicomponent';
import htmlText from './chat.html!text';
import cssText from './chat.css!text';
import ChatHistory from 'ui/chathistory/chathistory';
import Keys from 'input/keyboard';
import ChatType from 'db/chat/chattype';

class Chat extends UIComponent {
  constructor() {
    super('Chat', htmlText, cssText);

    this.mouseInteractMode = UIComponent.MouseInteractMode.SCENE;
    this.MAX_CHAT_LIST = 5;
  }

  onRemove() {
    this.$ui.find('.content').empty();
    this.$ui.find('.input').val('');

    clearInterval(this.timer);
  }

  hide() {
    this.$ui.find('.content').hide();
  }

  show() {
    this.$ui.find('.content').show();
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.removeOldChat();
    }, 5000);
  }

  removeOldChat() {
    this.$ui.find('.content div').first().remove();
  }

  addChat(text, type, color) {
    if (ChatHistory.isFiltered(type)) {
      return;
    }

    if (!color) {
      switch (type) {
        case ChatType.NORMAL:
          color = '#FFF';
          break;
        case ChatType.SHOUT:
          color = '#FD8B5D';
          break;
        case ChatType.GUILD:
          color = '#0F0';
          break;
        case ChatType.PARTY:
          color = '#FF80FF';
          break;
        case ChatType.SYSTEM:
          color = '#FF0';
          break;
        case ChatType.GM_NOTICE:
          color = '#0FF';
          break;
        case ChatType.YELLOW_STAT:
          color = '#FF0';
          break;
        case ChatType.BLUE_STAT:
          color = '#0FF';
          break;
        default:
          color = '#FFF';
          break;
      }
    }

    if (type != ChatType.NORMAL) {
      clearInterval(this.timer);
      this.startTimer();

      if (this.$ui.find('.content div').length >= this.MAX_CHAT_LIST) {
        this.removeOldChat();
      }

      this.$ui.find('.content').append($('<div/>').
        css('color', color).text(text)
      );
    }

    ChatHistory.addChat(text, type, color);
  }

  /**
   * Key Event Handler
   * @param {object} event
   * @returns {boolean} return false to stop bubbling and prevent default action.
   */
  onKeyDown(event) {
    switch (event.which) {
      case Keys.ENTER:
        this.toggleChatInput();
        break;
      case Keys.ESCAPE:
        if (this.$ui.find('.input').hasClass('active')) {
          this.hideChatInput();
          break;
        } else {
          return true;
        }

      default:
        return true;
    }

    event.stopImmediatePropagation();
    return false;
  }

  /**
   * Key event Handler for printable keys.
   * @param {object} event
   * @returns {boolean} return false to stop bubbling and prevent default action.
   */
  onKeyPress(event) {
    // Chat input does not print carriage return because
    // it is single line input.
    if (event.which == Keys.ENTER) {
      return false;
    }

    this.showChatInput();
    return true;
  }

  /**
   * Show the chat input box.
   */
  showChatInput() {
    this.$ui.find('.input').addClass('active').focus();
  }

  /**
   * Hide the chat input box.
   */
  hideChatInput() {
    this.$ui.find('.input').removeClass('active').blur();
  }

  /**
   * Toggle visibility of the chat input box.
   */
  toggleChatInput() {
    const $input = this.$ui.find('.input');
    if ($input.hasClass('active')) {
      const text = $input.val();
      if (text) {
        this.onRequestTalk(text);
        $input.val('');
      }

      this.hideChatInput();
    } else {
      this.showChatInput();
    }
  }

  /**
   * Functions to be redefined elsewhere
   */
  onRequestTalk(text) {}
}

export default new Chat();
