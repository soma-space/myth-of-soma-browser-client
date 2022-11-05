/**
 * Map Object entity
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import Entity from 'world/entity/entity';
import Client from 'core/client';
import Renderer from 'renderer/renderer';
import SpriteRenderer from 'renderer/spriterenderer';

class MapObject extends Entity {
  /**
   * MapObject constructor
   * @constructor
   * @this {MapObject}
   */
  constructor(spriteFileName, animationIndex) {
    super();

    this.spriteFileName = spriteFileName;
    this.animationIndex = animationIndex;
  }

  /**
   * Render the MapObject
   */
  render() {
    const sprite = Client.loadFile('resources/map/object/' + this.spriteFileName);
    if (sprite) {
      const frame = sprite.frames[this.animationIndex];
      if (frame) {
        SpriteRenderer.image.texture = frame.texture;
        SpriteRenderer.image.palette = sprite.paletteTexture;
        SpriteRenderer.image.size[0] = frame.width;
        SpriteRenderer.image.size[1] = frame.height;

        SpriteRenderer.color[0] = 1.0;
        SpriteRenderer.color[1] = 1.0;
        SpriteRenderer.color[2] = 1.0;
        SpriteRenderer.color[3] = 1.0;

        SpriteRenderer.size[0] = frame.width;
        SpriteRenderer.size[1] = frame.height;

        SpriteRenderer.position[0] = this.cellX * 32 + 16;
        SpriteRenderer.position[1] = this.cellY * 32 + 16;
        SpriteRenderer.position[2] = 20 + ((this.cellY * 32 + 16) / (800 * 32));

        SpriteRenderer.offset[0] = frame.offsetX;
        SpriteRenderer.offset[1] = frame.offsetY;

        SpriteRenderer.textureOffset[0] = 0;
        SpriteRenderer.textureOffset[1] = 0;

        SpriteRenderer.render();
      }
    }

    Renderer.gl.blendFunc(Renderer.gl.ZERO, Renderer.gl.DST_COLOR);

    const shadowFileName = this.spriteFileName.replace('.spl', 's.spl');
    const shadowSprite = Client.loadFile('resources/map/object/' + shadowFileName);
    if (shadowSprite) {
      const frame = shadowSprite.frames[this.animationIndex];
      if (frame) {
        SpriteRenderer.image.texture = frame.texture;
        SpriteRenderer.image.palette = shadowSprite.paletteTexture;
        SpriteRenderer.image.size[0] = frame.width;
        SpriteRenderer.image.size[1] = frame.height;

        SpriteRenderer.color[0] = 1.0;
        SpriteRenderer.color[1] = 1.0;
        SpriteRenderer.color[2] = 1.0;
        SpriteRenderer.color[3] = 1.0;

        SpriteRenderer.size[0] = frame.width;
        SpriteRenderer.size[1] = frame.height;

        SpriteRenderer.position[0] = this.cellX * 32 + 16;
        SpriteRenderer.position[1] = this.cellY * 32 + 16;
        SpriteRenderer.position[2] = 15 + ((this.cellY * 32 + 16) / (800 * 32));

        SpriteRenderer.offset[0] = frame.offsetX;
        SpriteRenderer.offset[1] = frame.offsetY;

        SpriteRenderer.textureOffset[0] = 0;
        SpriteRenderer.textureOffset[1] = 0;

        SpriteRenderer.render();
      }
    }

    Renderer.gl.blendFunc(Renderer.gl.SRC_ALPHA, Renderer.gl.ONE_MINUS_SRC_ALPHA);
  }
}
export default MapObject;
