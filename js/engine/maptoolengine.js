/**
 * Map Engine
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import Session from 'engine/session';

import MapRenderer from 'renderer/maprenderer';
import Camera from 'renderer/camera';
import EntityList from 'renderer/entitylist';
import Entity from 'renderer/entity/entity';

import MapToolControl from 'controls/maptoolcontrol';

import glMatrix from 'lib/gl-matrix';

function initialize() {
  Session.gameStarted = false;

  onViewMap(1);

  MapToolControl.onPan = onPanMap;
  MapToolControl.onZoom = onZoomMap;
}

function onViewMap(zone) {
  console.log('onViewMap');

  Session.entity = new Entity();
  Session.entity.serverId = 1;
  Session.entity.setPosition(2048, 2048);

  EntityList.add(Session.entity);

  MapRenderer.onLoad = () => {
    Camera.follow(Session.entity);
    MapToolControl.initialize();
  };

  MapRenderer.setMap(zone);
}

function onPanMap(translation) {
  let positionX = Math.min(MapRenderer.getMapPixelWidth(), Math.max(0, Session.entity.x - translation.x));
  let positionY = Math.min(MapRenderer.getMapPixelHeight(), Math.max(0, Session.entity.y - translation.y));
  Session.entity.setPosition(positionX, positionY);
  console.log('onPanMap');
}

function onZoomMap(scaleFactor) {
  Camera.zoom = scaleFactor;
  glMatrix.mat4.ortho(Camera.projection, 0, 4096, 4096, 0, -100, 100);
}

const MapToolEngine = {
  initialize,
};

export default MapToolEngine;
