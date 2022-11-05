/**
 * Map Control
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import Mouse from 'controls/mouse';

const MapToolControl = {
  /**
   * @var {boolean} Are we panning?
   */
  panning: false,

  /**
   * The page position of where the panning started.
   */
  panPosition: {
    x: -1,
    y: -1,
  },

  /**
   * @var {number} The zoom scale.
   */
  zoom: 1.0,

  /**
   * Initialize map control
   */
  initialize() {
    $(document).on('mousedown.maptoolcontrol', onMouseDown.bind(this));
    $(document).on('mouseup.maptoolcontrol', onMouseUp.bind(this));
    $(document).on('mousemove.maptoolcontrl', onMouseMove.bind(this));
    $(document).on('mousewheel.maptoolcontrol', onMouseWheel.bind(this));
  },

  /**
   * Functions to be redefined elsewhere
   */
  onPan(translation) {},

  onZoom(scaleFactor) {},
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
      this.panning = true;
      this.panPosition.x = event.clientX;
      this.panPosition.y = event.clientY;
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
      this.panning = false;
      break;
  }
}

/**
 * Mouse move on the map
 */
function onMouseMove(event) {
  if (!Mouse.enabled) {
    return;
  }

  if (this.panning) {
    let translation = {
      x: event.clientX - this.panPosition.x,
      y: event.clientY - this.panPosition.y,
    };

    this.panPosition.x = event.clientX;
    this.panPosition.y = event.clientY;

    this.onPan(translation);
  }
}

function onMouseWheel(event) {
  if (!Mouse.enabled) {
    return;
  }

  let delta = event.originalEvent.wheelDelta;
  if (delta > 0) {
    this.zoom = Math.min(100.0, this.zoom + 1);
    this.onZoom(this.zoom);
  } else if (delta < 0) {
    this.zoom = Math.max(1, this.zoom - 1);
    this.onZoom(this.zoom);
  }
}

export default MapToolControl;
