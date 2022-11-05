/**
 * Map Control
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import Mouse from 'controls/mouse';
import EntityPicking from 'renderer/entitypicking';

const MapControl = {
  /**
   * Initialize map control
   */
  initialize() {
    $(document).on('mousedown.mapcontrol', onMouseDown.bind(this));
    $(document).on('mouseup.mapcontrol', onMouseUp.bind(this));
  },

  /**
   * Functions to be redefined elsewhere
   */
  onRequestWalk() {},

  onRequestStopWalk() {}
};

/**
 * Mouse down on the map
 */
function onMouseDown(event) {
  if (!Mouse.enabled) {
    return;
  }

  switch (event.which) {
    // Left button
    case 1:
      const entityFocus = EntityPicking.getFocusEntity();
      const entityOver = EntityPicking.getOverEntity();
      let stop = false;

      if (entityFocus && entityFocus != entityOver) {
        entityFocus.control.onLoseFocus();
        EntityPicking.setFocusEntity(null);
      }

      if (entityOver) {
        stop = stop || entityOver.control.onMouseDown();
        stop = stop || entityOver.control.onFocus();
        EntityPicking.setFocusEntity(entityOver);
      }

      if (!stop) {
        this.onRequestWalk();
      }

      break;
  }
}

/**
 * Mouse up on the map
 */
function onMouseUp(event) {
  if (!Mouse.enabled) {
    return;
  }

  switch (event.which) {
    // Left button
    case 1:
      const entity = EntityPicking.getFocusEntity();
      if (entity) {
        entity.control.onMouseUp();
        EntityPicking.setFocusEntity(null);
        entity.control.onLoseFocus();
      }

      break;
  }
}

export default MapControl;
