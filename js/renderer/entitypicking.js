/**
 * Entity Picking
 * Functions for doing picking of entity.
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import EntityList from 'renderer/entitylist';
import Mouse from 'controls/mouse';
import Camera from 'renderer/camera';

/**
 * @var {Entity} entity the mouse is over
 */
let _over = null;

/**
 * @var {Entity} focused entity
 */
let _focus = null;

/**
 * Get over Entity
 * @returns {Entity} over entity
 */
function getOverEntity() {
  return _over;
}

/**
 * Set over Entity
 * @param {Entity} over Entity
 */
function setOverEntity(entity) {
  const current = _over;
  if (current == entity) {
    return;
  }

  if (current && current.control) {
    current.control.onMouseLeave();
  }

  if (entity && entity.control) {
    _over = entity;
    entity.control.onMouseOver();
  } else {
    _over = null;
  }
}

/**
 * Get focus Entity
 * @returns {Entity} focus entity
 */
function getFocusEntity() {
  return _focus;
}

/**
 * Set focus Entity
 * @param {Entity} focused Entity
 */
function setFocusEntity(entity) {
  _focus = entity;
}

/**
 * Returns the entity that the mouse screen position intersects with or null.
 */
function intersect() {
  const x = Mouse.screen.x - Camera.position[0];
  const y = Mouse.screen.y - Camera.position[1];

  EntityList.sort((a, b) => {
    return b.render.depth - a.render.depth;
  });

  let intersectEntity = null;
  EntityList.forEach((entity) => {
    if (x > entity.render.boundingRect.x1 &&
        x < entity.render.boundingRect.x2 &&
        y > entity.render.boundingRect.y1 &&
        y < entity.render.boundingRect.y2) {
      intersectEntity = entity;
      return true;
    }
  });

  return intersectEntity;
}

const EntityPicking = {
  getOverEntity,
  setOverEntity,
  getFocusEntity,
  setFocusEntity,
  intersect
};

export default EntityPicking;
