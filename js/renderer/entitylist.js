/**
 * Entity List
 * List of entities that the client knows about and functions to use with the list.
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import Session from 'engine/session';

const _list = [];

/**
 * Find an entity in the list and return the index
 * @param {number} serverId
 * @returns {number} index
 */
function getEntityIndex(serverId) {
  if (serverId < 0) {
    return -1;
  }

  const length = _list.length;
  for (let i = 0; i < length; i++) {
    if (_list[i].serverId === serverId) {
      return i;
    }
  }

  return -1;
}

/**
 * Add entity to list or modify existing entity.
 * @param {object} entity
 */
function addEntity(entity) {
  const index = getEntityIndex(entity.serverId);
  if (index < 0) {
    _list.push(entity);
  } else {
    _list[index].set(entity);
  }
}

/**
 * Remove an entity from the list
 * @param {number} serverId
 */
function removeEntity(serverId) {
  const index = getEntityIndex(serverId);
  if (index > -1) {
    _list[index].clean();
    _list.splice(index, 1);
  }
}

/**
 * Get an entity fro mthe list with serverId
 * @param {number} serverId
 */
function getEntity(serverId) {
  if (Session.entity.serverId === serverId) {
    return Session.entity;
  }

  const index = getEntityIndex(serverId);
  if (index < 0) {
    return null;
  }

  return _list[index];
}

/**
 * Execute a provided function once for each entity
 * @param {callback} function to execute for each entity, single argument the entity.
 */
function forEachEntity(callback) {
  const length = _list.length;
  for (let i = 0; i < length; i++) {
    if (callback(_list[i])) {
      return;
    }
  }
}

/**
 * Sort the entities list using the given comparison function
 * @param {function} Comparison function
 */
function sort(compareFunction) {
  _list.sort(compareFunction);
}

/**
 * Clean up each entity in the list and zero list length (garbage collection)
 */
function free() {
  const length = _list.length;
  for (let i = 0; i < length; i++) {
    _list[i].clean();
  }

  _list.length = 0;
}

const EntityList = {
  add: addEntity,
  remove: removeEntity,
  get: getEntity,
  forEach: forEachEntity,
  sort,
  free
};

export default EntityList;
