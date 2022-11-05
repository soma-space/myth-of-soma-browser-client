/**
 * Map Renderer
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import Thread from 'core/thread';
import Client from 'core/client';
import Memory from 'core/memory';
import Renderer from 'renderer/renderer';
import SpriteRenderer from 'renderer/spriterenderer';
import Camera from 'renderer/camera';
import MapObject from 'world/entity/mapobject';
import {pad} from 'utils/number';
import EntityList from 'renderer/entitylist';
import EntityPicking from 'renderer/entitypicking';
import Mouse from 'controls/mouse';
import {pixelToCell} from 'utils/positionconvert';

/**
 * MapRenderer object for namespace
 */
const MapRenderer = {
  /**
   * Current map zone number
   * @var {number} currentZone
   */
  currentZone: 0,

  /**
   * Is the map currently being loaded
   * @var {boolean} loading
   */
  loading: false,

  /**
   * The map of tiles for the map.
   * @var {TileMap} tilemap
   */
  tilemap: null,

  /**
   * The map of objects for the map.
   * @var {ObjectMap} objectmap
   */
  objectmap: null,

  /**
   * The tileset for the map.
   * @var {TileSet} tileset
   */
  tileset: null,

  grid: null,

  grid2: null,

  gridSizeX: 0,

  gridSizeY: 0,

  tileSheetsUseCount: [],

  /**
   * Check if there is a valid tile on the layer at given location.
   * @param {number} layer The layer.
   * @param {number} x The x componeot of the location.
   * @param {number} x The y componeot of the location.
   * @return {boolean} True if there is a valid tile otherwise false.
   */
  hasTile(layer, x, y) {
    return this.tilemap.tiles[layer][y * this.tilemap.width + x] !== -1;
  },

  /**
   * Return the tile set on the layer at given location.
   * @param {number} layer The layer.
   * @param {number} x The x componeot of the location.
   * @param {number} x The y componeot of the location.
   * @return {number} The tile set value.
   */
  getTileSet(layer, x, y) {
    return this.tilemap.tiles[layer][y * this.tilemap.width + x] & 0x3FF;
  },

  /**
   * Return the sub tile set on the layer at given location.
   * @param {number} layer The layer.
   * @param {number} x The x componeot of the location.
   * @param {number} x The y componeot of the location.
   * @return {number} The sub tile set value.
   */
  getSubTileSet(layer, x, y) {
    return this.tilemap.tiles[layer][y * this.tilemap.width + x] >> 10 & 0x3F;
  },

  /**
   * Return the tile on the layer at given location.
   * @param {number} layer The layer.
   * @param {number} x The x componeot of the location.
   * @param {number} x The y componeot of the location.
   * @return {number} The tile value.
   */
  getTile(layer, x, y) {
    return this.tilemap.tiles[layer][y * this.tilemap.width + x] >> 16 & 0xFFF;
  },

  /**
   * Set the map
   * @param {number} zone The map zone number to change to
   */
  setMap(zone) {
    if (this.loading) {
      return;
    }

    if (this.currentZone !== zone) {
      this.currentZone = zone;
      this.loading = true;
      this.tilemap = null;
      this.tileset = null;
      this.objectmap = null;
      Thread.send('LOAD', {filename: `resources/map/mset${pad(this.currentZone, 2)}.tmn`}, this.onTileMapLoad.bind(this));
    } else {
      this.onLoad();
    }
  },

  /**
   * When the tilemap has finished loading
   */
  onTileMapLoad(data, error, input) {
    if (error) {
      console.error(error);
      return;
    }

    this.tilemap = data;
    Thread.send('LOAD', {filename: `resources/map/mset${pad(this.currentZone, 2)}.tsd`}, this.onTileSetLoad.bind(this));
  },

  /**
   * When the tileset has finished loading
   */
  onTileSetLoad(data, error, input) {
    if (error) {
      console.error(error);
      return;
    }

    this.tileset = data;
    Thread.send('LOAD', {filename: `resources/map/mset${pad(this.currentZone, 2)}.mod`}, this.onObjectMapLoad.bind(this));
  },

  /**
   * When the object map has finished loading
   */
  onObjectMapLoad(data, error, input) {
    if (error) {
      console.error(error);
      return;
    }

    this.objectmap = data;
    this.loading = false;
    this.onLoad();

    this.gridSizeX = Math.ceil(this.objectmap.width * 32 / 128);
    this.gridSizeY = Math.ceil(this.objectmap.height * 32 / 128);

    this.grid = new Array(this.gridSizeX * this.gridSizeY);
    for (var i = 0; i < this.gridSizeX * this.gridSizeY; ++i) {
      this.grid[i] = [];
    }

    this.grid2 = new Array(this.gridSizeX * this.gridSizeY);
    for (var i = 0; i < this.gridSizeX * this.gridSizeY; ++i) {
      this.grid2[i] = [];
    }

    for (var j = 0; j < 1; ++j)
      for (var i = 0; i < this.objectmap.objectMapObjects[j].length; ++i) {
        var object = this.objectmap.objectMapObjects[j][i];
        var mapObject = new MapObject(this.objectmap.objectMapFileNames[j][object.spriteLocator >> 8].sprite, object.spriteLocator & 0x00FF);
        var x = object.key % this.objectmap.width;
        var y = Math.floor(object.key / this.objectmap.width);
        mapObject.setCellPosition(x, y);

        var gridX = Math.floor((mapObject.cellX * 32 + 16) / 128);
        var gridY = Math.floor((mapObject.cellY * 32 + 16) / 128);
        var gridIndex = gridY * this.gridSizeX + gridX;
        this.grid[gridIndex].push(mapObject);
        //this.objectMapEntities.push(mapObject);
      }

    // for (var i = 0; i < this.objectmap.objectMapObjects[1].length; ++i) {
    // var object = this.objectmap.objectMapObjects[1][i];
    // var mapObject = new MapObject(this.objectmap.objectMapFileNames[1][object.spriteLocator >> 8].sprite, object.spriteLocator & 0x00FF);
    // var x = object.key % this.objectmap.width;
    // var y = Math.floor(object.key / this.objectmap.width);
    // mapObject.setCellPosition(x, y);

    // var gridX = Math.floor((mapObject.cellX * 32 + 16) / 128);
    // var gridY =  Math.floor((mapObject.cellY * 32 + 16) / 128);
    // var gridIndex = gridY * this.gridSizeX + gridX;
    // this.grid2[gridIndex].push(mapObject);
    // //this.objectMapEntities.push(mapObject);
    // }

    Mouse.enabled = true;

    Renderer.render(this.onRender.bind(this));
  },

  /**
   * Render the map
   * @param {object} GL context
   * @param {number} tick
   */
  onRender(gl, tick) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    Camera.update(tick);

    Mouse.world = pixelToCell(Mouse.screen.x + (Camera.position[0] * -1), Mouse.screen.y + (Camera.position[1] * -1));

    var tileSize = 32;
    var tileWidth = Math.ceil(800 / tileSize) + 1;
    var tileHeight = Math.ceil(600 / tileSize) + 1;
    var tileOffsetX = Math.floor(Math.ceil(Camera.position[0] * -1) / tileSize);
    var tileOffsetY = Math.floor(Math.ceil(Camera.position[1] * -1) / tileSize);

    var gridMinX = Math.floor(((tileOffsetX - (tileWidth / 2)) * 32) / 128);
    var gridMinY = Math.floor(((tileOffsetY - (tileHeight / 2)) * 32) / 128);
    var gridMaxX = Math.ceil(((tileOffsetX + tileWidth + (tileWidth / 2)) * 32) / 128);
    var gridMaxY = Math.ceil(((tileOffsetY + tileHeight + (tileHeight / 2)) * 32) / 128);

    SpriteRenderer.bind3DContext(gl);

    if (!this.tileSheetsUseCount) {
      this.tileSheetsUseCount = new Array(100);
    }

    for (var i = 0; i < this.tileSheetsUseCount.length; ++i) {
      this.tileSheetsUseCount[i] = null;
    }

    SpriteRenderer.color[0] = 1.0;
    SpriteRenderer.color[1] = 1.0;
    SpriteRenderer.color[2] = 1.0;
    SpriteRenderer.color[3] = 1.0;

    SpriteRenderer.size[0] = 32.0;
    SpriteRenderer.size[1] = 32.0;

    for (let l = 3; l >= 0; --l) {
      SpriteRenderer.position[2] = l;

      for (let y = tileOffsetY; y < tileOffsetY + tileHeight; y++) {
        for (let x = tileOffsetX; x < tileOffsetX + tileWidth; x++) {
          if (!this.hasTile(l, x, y)) {
            continue;
          }

          const ts = this.getTileSet(l, x, y);
          const sts = this.getSubTileSet(l, x, y);
          const t = this.getTile(l, x, y);

          if (ts < 0 || ts >= this.tileset.tileSets.length) {
            continue;
          }

          if (sts < 0 || sts >= this.tileset.tileSets[ts].subTileSets.length) {
            continue;
          }

          if (this.tileset.tileSets[ts].tileSheetFilename === '') {
            continue;
          }

          if (!this.tileSheetsUseCount[ts]) {
            this.tileSheetsUseCount[ts] = new Array(this.tileset.tileSets[ts].subTileSets.length);
            for (var i = 0; i < this.tileSheetsUseCount[ts].length; ++i) {
              this.tileSheetsUseCount[ts][i] = 0;
            }

            this.tileSheetsUseCount[ts][sts] = 1;
          } else {
            ++this.tileSheetsUseCount[ts][sts];
          }

          const tileSprite = Client.loadFile('resources/bmp/' + this.tileset.tileSets[ts].tileSheetFilename.replace('.bmp', '.obm'));
          if (tileSprite) {
            const firstTileOffset = this.tileset.tileSets[ts].subTileSets[sts].tiles[0];
            const tileOffset = this.tileset.tileSets[ts].subTileSets[sts].tiles[t];
            if (tileOffset) {
              const frame = tileSprite.frames[sts];
              SpriteRenderer.image.texture = frame.texture;
              SpriteRenderer.image.palette = tileSprite.paletteTexture;
              SpriteRenderer.image.size[0] = frame.width;
              SpriteRenderer.image.size[1] = frame.height;

              SpriteRenderer.position[0] = x * tileSize;
              SpriteRenderer.position[1] = y * tileSize;

              SpriteRenderer.offset[0] = frame.offsetX;
              SpriteRenderer.offset[1] = frame.offsetY;

              SpriteRenderer.textureOffset[0] = (tileOffset.x - firstTileOffset.x) * tileSize;
              SpriteRenderer.textureOffset[1] = (tileOffset.y - firstTileOffset.y) * tileSize;

              SpriteRenderer.render();
            }
          }
        }
      }
    }

    EntityList.forEach((entity) => {
      entity.render.render();
    });

    for (var y = gridMinY; y <= gridMaxY; ++y) {
      for (var x = gridMinX; x <= gridMaxX; ++x) {
        var gridIndex = y * this.gridSizeX + x;
        for (var i = 0; i < this.grid[gridIndex].length; ++i) {
          this.grid[gridIndex][i].render();
        }
      }
    }

    SpriteRenderer.unbind3DContext(gl);

    // Renderer.gl.blendFunc(gl.DST_COLOR, gl.ZERO);

    // for (var y = gridMinY; y <= gridMaxY; ++y) {
    // for (var x = gridMinX; x <= gridMaxX; ++x) {
    // var gridIndex = y * this.gridSizeX + x;
    // for (var i = 0; i < this.grid2[gridIndex].length; ++i) {
    // this.grid2[gridIndex][i].render();
    // }
    // }
    // }

    //Renderer.gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    if (Mouse.enabled) {
      const entity = EntityPicking.intersect();
      EntityPicking.setOverEntity(entity);
    }

    Memory.clean(gl, tick);
  },

  /**
   * Functions to be redefined elsewhere
   */
  onLoad() {}
};

export default MapRenderer;
