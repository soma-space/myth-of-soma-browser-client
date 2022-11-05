/**
 * HUD UI
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import Mouse from 'controls/mouse';

import EntityPicking from 'renderer/entitypicking';

const _components = [];

class UIComponent {
  /**
   * Create an UI Component
   * @param {string} name
   * @param {string} htmlText
   * @param {string} cssText
   * @constructor
   * @this {UIComponent}
   */
  constructor(name, htmlText, cssText) {
    let $style = $('style:first');
    if (!$style.length) {
      $style = $('<style type="text/css"></style>').appendTo('head');
    }

    this.name = name;
    this.htmlText = htmlText || null;
    this.cssText = cssText || null;
    this.prepared = false;
    this.appended = false;
    this.mouseInteractMode = UIComponent.MouseInteractMode.OVER_UI;

    _components[this.name] = this;
  }

  /**
   * Prepare the component for use.
   */
  prepare() {
    if (this.prepared) {
      return;
    }

    if (this.htmlText) {
      this.$ui = $(this.htmlText);
      this.$ui.css('zIndex', 100);
    }

    if (this.cssText) {
      const $style = $('style:first');
      if ($style.text().indexOf('\n\n/** ' + this.name + ' **/\n') === -1) {
        $style.append('\n\n/** ' + this.name + ' **/\n' + this.cssText);
      }
    }

    if (this.onPrepare) {
      this.onPrepare();
    }

    if (this.mouseInteractMode == UIComponent.MouseInteractMode.OVER_UI) {
      //  Prevent the mouse interacting with the scene when mouse is within
      // the UI element.
      // mouseenter is protected against being triggered multiple times.

      let enter = 0;
      let enabled = false;

      // Stop the mouse being able to interact with the scene
      this.$ui.mouseenter(() => {
        if (enter == 0) {
          enabled = Mouse.enabled;
          enter++;
          if (enabled) {
            Mouse.enabled = false;
          }
        }
      });

      // Restore to previous interaction state.
      this.$ui.mouseleave(() => {
        if (enter > 0) {
          enter--;
          if (enter == 0 && enabled) {
            Mouse.enabled = true;
            //EntityPicking.setOverEntity(null);
          }
        }
      });

      // Fix for an issue where firefox will not fire a mouseleave
      // event for an element that is removed from the DOM.
      this.$ui.on('ui-removed', () => {
        if (enter > 0) {
          enter = 0;
          if (enabled) {
            Mouse.enabled = true;
            //EntityPicking.setOverEntity(null);
          }
        }
      });
    }

    this.prepared = true;
  }

  /**
   * Append the component to the DOM
   */
  append() {
    if (this.appended) {
      return;
    }

    if (!this.prepared) {
      this.prepare();
    }

    $('body').append(this.$ui);

    if (this.onKeyDown) {
      $(document).off('keydown.' + this.name).on('keydown.' + this.name, this.onKeyDown.bind(this));
    }

    if (this.onKeyPress) {
      $(document).off('keypress.' + this.name).on('keypress.' + this.name, this.onKeyPress.bind(this));
    }

    if (this.mouseInteractMode == UIComponent.MouseInteractMode.ONLY_UI) {
      Mouse.intersect = false;
    }

    if (this.onAppend) {
      this.onAppend();
    }

    this.appended = true;
  }

  /**
   * Remove the component from the DOM
   */
  remove() {
    if (this.appended && this.$ui.parent().length) {
      if (this.onRemove) {
        this.onRemove();
      }

      if (this.onKeyDown) {
        $(document).off('keydown.' + this.name);
      }

      if (this.onKeyPress) {
        $(document).off('onKeyPress.' + this.name);
      }

      this.$ui.trigger('ui-removed');
      this.$ui.detach();

      if (this.mouseInteractMode == UIComponent.MouseInteractMode.ONLY_UI) {
        Mouse.intersect = true;
      }

      this.appended = false;
    }
  }

  /**
   * Remove all components from the DOM
   */
  static removeAll() {
    for (let component of _components) {
      component.remove();
    }
  }

  /**
   * Get a component by name
   * @param {string} name
   * @returns {object} UIComponent
   */
  static getComponent(name) {
    if (!name in _components) {
      throw new Error(`UIComponent ${name} not found`);
    }

    return _components[name];
  }
}

UIComponent.MouseInteractMode = {
  SCENE: 0,   // Can interact with the scene
  OVER_UI: 1, // Cannot interact with the scene when mouse over the UI
  ONLY_UI: 2  // Cannot interact with the scene when the UI is alive.
}

export default UIComponent;
