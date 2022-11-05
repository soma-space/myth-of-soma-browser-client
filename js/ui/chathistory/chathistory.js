/**
 * Chat History UI
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import UIComponent from 'ui/uicomponent';
import htmlText from './chathistory.html!text';
import cssText from './chathistory.css!text';
import Keys from 'input/keyboard';
import ChatType from 'db/chat/chattype';
import Chat from 'ui/chat/chat';

class ChatHistory extends UIComponent {
  constructor() {
    super('ChatHistory', htmlText, cssText);

    this.MAX_CHAT_HISTORY = 1000;
  }

  onPrepare() {
    this.$ui.find('.content').jScrollPane({
      showArrows: true,
      arrowButtonSpeed: 14,
      verticalDragMinHeight: 8,
      verticalDragMaxHeight: 8,
      alwaysShowScroll: true,
      contentWidth: 267
    });
    this.$jScrollPane = this.$ui.find('.content').data('jsp');
    this.$content = this.$jScrollPane.getContentPane();
    this.$content.on('mousewheel', this.onScroll.bind(this));
    this.$ui.find('.close').click(() => this.hide());

    this.$ui.hide();
  }

  onAppend() {
    this.$jScrollPane.reinitialise();
  }

  onRemove() {
    this.$ui.find('.content').empty();
  }

  /**
   * Show/Hide UI
   */
  toggle() {
    this.$ui.toggle();

    if (this.$ui.is(':hidden')) {
      Chat.show();
    } else {
      Chat.hide();
    }

    this.$jScrollPane.reinitialise();
    this.$jScrollPane.scrollToBottom();
  }

  /**
   * Hide UI
   */
  hide() {
    this.$ui.hide();
    Chat.show();
  }

  /**
   * Append chat to the DOM
   */
  addChat(text, type, color) {
    if (this.$content.find('div').length >= this.MAX_CHAT_HISTORY) {
      this.$content.find('div').first().remove();
    }

    this.$content.append($('<div/>').css('color', color).text(text));
    this.$jScrollPane.reinitialise();
  }

  /**
   * Is the chat type being filtered
   * @param {number} type The chat type
   * @returns {boolean} Filtered
   */
  isFiltered(type) {
    switch (type) {
      case ChatType.NORMAL:
        return this.$ui.find('#filter-normal-chat').prop('checked');
      case ChatType.SHOUT:
        return this.$ui.find('#filter-shout-chat').prop('checked');
      case ChatType.PARTY:
        return this.$ui.find('#filter-party-chat').prop('checked');
      case ChatType.ZONE:
        return this.$ui.find('#filter-zone-chat').prop('checked');
      case ChatType.GUILD:
        return this.$ui.find('#filter-guild-chat').prop('checked');
      default:
        return false;
    }
  }

  /**
   * Process Shortcut
   * @param {object} shortcut
   */
  onShortcut(shortcut) {
    switch (shortcut.action) {
      case 'toggle':
        this.toggle();
        break;
    }
  }

  /**
   * Key Event Handler
   * @param {object} event
   * @returns {boolean} return false to stop bubbling and prevent default action.
   */
  onKeyDown(event) {
    if (this.$ui.is(':hidden')) {
      return true;
    }

    switch (event.which) {
      case Keys.ESCAPE:
        this.hide();
        break;
      default:
        return true;
    }

    event.stopImmediatePropagation();
    return false;
  }

  /**
   * Mouse wheel scroll
   * @param {object} event
   * @returns {boolean} return false to stop bubbling and prevent default action.
   */
  onScroll(event) {
    this.$jScrollPane.scrollToY(
      Math.floor(this.$jScrollPane.getContentPositionY() / 14) * 14 - (event.deltaY * 14));
    return false;
  }
}

export default new ChatHistory();
