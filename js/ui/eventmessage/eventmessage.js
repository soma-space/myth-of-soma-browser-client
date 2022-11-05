/**
 * EventMessage UI
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import UIComponent from 'ui/uicomponent';
import Keys from 'input/keyboard';
import htmlText from './eventmessage.html!text';
import cssText from './eventmessage.css!text';

class EventMessage extends UIComponent {
  /**
   * EventMessage constructor
   * @constructor
   * @this {EventMessage}
   */
  constructor() {
    super('EventMessage', htmlText, cssText);
  }

  onAppend() {
    this.$ui.find('.content').jScrollPane({
      showArrows: true,
      arrowButtonSpeed: 14,
      verticalDragMinHeight: 8,
      verticalDragMaxHeight: 8,
      contentWidth: 337
    });
    this.$jScrollPane = this.$ui.find('.content').data('jsp');
    this.$content = this.$jScrollPane.getContentPane();
    this.$content.on('mousewheel', this.onScroll.bind(this));
  }

  onRemove() {
    this.$content.empty();
    this.$jScrollPane.destroy();
  }

  /**
   * Key Event Handler
   * @param {object} event
   * @returns {boolean} return false to stop bubbling and prevent default action.
   */
  onKeyDown(event) {
    event.stopImmediatePropagation();
    switch (event.which) {
      case Keys.ESCAPE:
        this.remove();
        return false;
      default:
        return true;
    }
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

  /**
   * Set the text to be shown.
   * @param {string} text
   */
  setMessage(text) {
    if (text) {
      this.$content.append($('<div/>')
        .addClass('text')
        .text(text));

      this.$ui.on('click.hide-text', (event) => {
        this.remove();
      });
    }

    this.$jScrollPane.reinitialise();
  }
}

export default new EventMessage();
