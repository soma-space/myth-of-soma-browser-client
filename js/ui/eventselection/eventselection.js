/**
 * EventSelection UI
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import UIComponent from 'ui/uicomponent';
import Keys from 'input/keyboard';
import htmlText from './eventselection.html!text';
import cssText from './eventselection.css!text';

class EventSelection extends UIComponent {
  /**
   * EventSelection constructor
   * @constructor
   * @this {EventSelection}
   */
  constructor() {
    super('EventSelection', htmlText, cssText);
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
   * Set the text and selections to be shown.
   * @param {string} text
   * @param {array} selections
   */
  setSelection(text, selections) {
    if (text) {
      this.$content.append($('<div/>')
        .addClass('text')
        .text(text));

      this.$ui.on('click.hide-text', (event) => {
        this.$content.find('.text').remove();
        this.$content.find('.selection').show();
        this.$jScrollPane.reinitialise();
        this.$ui.off('click.hide-text');
      });
    }

    for (let index = 0; index < selections.length; index++) {
      this.$content.append($('<div/>')
        .addClass('selection')
        .data('index', index)
        .hide()
        .text(selections[index]));
    }

    this.$content.find('.selection').on('click', () => {
      this.onSelect($(event.target).data('index'));
      this.remove();
    });

    this.$jScrollPane.reinitialise();
  }

  /**
   * Functions to be redefined elsewhere
   */
  onSelect(index) {}
}

export default new EventSelection();
