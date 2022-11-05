/**
 * Entity
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import Client from 'core/client';

import Renderer from 'renderer/renderer';
import SpriteRenderer from 'renderer/spriterenderer';
import EntityDisplay from 'renderer/entity/entitydisplay';

import Camera from 'renderer/camera';

class EntityRender {
  /**
   * EntityRender constructor
   * @constructor
   * @param {object} entity
   * @this {EntityRender}
   */
  constructor(entity) {
    this.entity = entity;

    this.depth = 0;
    this.boundingRect = {x1: 0, y1: 0, x2: 0, y2: 0};
  }

  render() {
    SpriteRenderer.position[0] = this.entity.x;
    SpriteRenderer.position[1] = this.entity.y;
    SpriteRenderer.position[2] = this.depth = 20 + (this.entity.y / (800 * 32));

    const length = this.entity.view.drawOrder.length;
    for (let i = 0; i < length; i++) {
      const type = this.entity.view.drawOrder[i];
      if (type) {
        switch (type) {
          case 'head':
            if (this.entity.hair || this.entity.armorHelmet) {
              this.renderElement(this.entity.view[type], type);
            }

            break;
          case 'armorTop':
          case 'armorPad':
          case 'armorBoot':
          case 'weapon':
          case 'shield':
            if (this.entity[type]) {
              this.renderElement(this.entity.view[type], type);
            }

            break;
          default:
            this.renderElement(this.entity.view[type], type);
            break;
        }
      }
    }

    this.renderUI();
  }

  renderUI() {
    if (this.entity.display.display || this.entity.display.chat.length) {
      this.entity.display.render();
    }
  }

  renderElement(files, type) {
    if (!files.spl || !files.ani) {
      return;
    }

    const spl = Client.loadFile(files.spl);
    const ani = Client.loadFile(files.ani);
    if (!spl || !ani) {
      return;
    }

    const animation = ani.animations[0];
    let index = Math.floor(Renderer.tick / animation.delay);
    index %= animation.length;
    index = animation.frames[this.entity.direction * animation.length + index];

    const frame = spl.frames[index];
    if (!frame) {
      return;
    }

    if (type == 'shadow') {
      Renderer.gl.blendFunc(Renderer.gl.ZERO, Renderer.gl.DST_COLOR);
    }

    if (type == 'body') {
      this.boundingRect.x1 = this.entity.x + frame.offsetX;
      this.boundingRect.y1 = this.entity.y + frame.offsetY;
      this.boundingRect.x2 = this.boundingRect.x1 + frame.width;
      this.boundingRect.y2 = this.boundingRect.y1 + frame.height;
    }

    SpriteRenderer.image.texture = frame.texture;
    SpriteRenderer.image.palette = spl.paletteTexture;
    SpriteRenderer.image.size[0] = frame.width;
    SpriteRenderer.image.size[1] = frame.height;

    SpriteRenderer.sprite = frame;
    SpriteRenderer.palette = spl.palette;

    SpriteRenderer.color[0] = 1.0;
    SpriteRenderer.color[1] = 1.0;
    SpriteRenderer.color[2] = 1.0;
    SpriteRenderer.color[3] = 1.0;

    SpriteRenderer.size[0] = frame.width;
    SpriteRenderer.size[1] = frame.height;

    SpriteRenderer.offset[0] = frame.offsetX;
    SpriteRenderer.offset[1] = frame.offsetY;

    SpriteRenderer.textureOffset[0] = 0;
    SpriteRenderer.textureOffset[1] = 0;

    SpriteRenderer.render();

    if (type == 'shadow') {
      Renderer.gl.blendFunc(Renderer.gl.SRC_ALPHA, Renderer.gl.ONE_MINUS_SRC_ALPHA);
    }
  }
}
export default EntityRender;
