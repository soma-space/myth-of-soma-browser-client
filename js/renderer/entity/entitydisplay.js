/**
 * EntityDisplay (Guild, Name, BubbleChat)
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import Entity from 'renderer/entity/entity';
import Camera from 'renderer/camera';
import Renderer from 'renderer/renderer';
import Mouse from 'controls/mouse';

class EntityDisplay {
  /**
   * EntityDisplay constructor
   * @constructor
   * @this {EntityDisplay}
   */
  constructor(entity) {
    this.entity = entity;

    this.display = false;

    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.zIndex = 1;

    this.context = this.canvas.getContext('2d');

    this.name = '';
    this.guildName = '';
    this._chat = '';

    this.maxWidth = 140;
    this.width = 0;
    this.height = 0;
  }

  add() {
    this.display = true;
  }

  remove() {
    if (!this.chat.length) {
      if (this.canvas.parentNode) {
        document.body.removeChild(this.canvas);
      }
    }

    this.display = false;
  }

  clean() {
    this.remove();
  }

  update() {
    const fontSize = 11;
    const lineHeight = fontSize + 2;

    this.width = 0;
    this.height = 0;

    if (this.guildName.length) {
      this.guildName = this.guildName.toUpperCase();
      const guildNameWidth = this.context.measureText(this.guildName).width;
      this.width = Math.min(this.maxWidth, guildNameWidth);
      this.height += lineHeight;
    }

    if (this.name.length) {
      this.name = this.name.toUpperCase();
      const nameWidth = this.context.measureText(this.name).width;
      this.width = Math.min(this.maxWidth, nameWidth);
      this.height += lineHeight;
    }

    let chatWidth = 0;
    let chatLines = [];
    if (this.chat.length) {
      let chat = this.chat;
      while (chat.length) {
        let i = chat.length;
        while (this.context.measureText(chat.substr(0, i)).width > this.maxWidth) {
          i--;
        }

        const result = chat.substr(0, i);
        let j = 0;
        if (i != chat.length) {
          while (result.indexOf(' ', j) != -1) {
            j = result.indexOf(' ', j) + 1;
          }
        }

        chatLines.push(result.substr(0, j || result.length));
        chatWidth = Math.max(chatWidth, this.context.measureText(chatLines[chatLines.length - 1]).width);
        chat = chat.substr(chatLines[chatLines.length - 1].length, chat.length);
      }

      this.width = Math.min(this.maxWidth, chatWidth);
      this.height += lineHeight * chatLines.length;
    }

    this.context.font = fontSize + 'px sans-serif';
    this.context.canvas.width = this.maxWidth;
    this.context.canvas.height = this.height;

    // set font again because setting canvas width and height resets the font.
    this.context.font = fontSize + 'px sans-serif';

    this.context.textBaseline = 'top';

    this.height = 0;

    if (this.guildName.length) {
      this.context.textAlign = 'center';
      this.context.fillStyle = 'black';
      this.context.fillText(this.guildName, Math.ceil(this.canvas.width / 2) + 1, this.height + 1, this.maxWidth);
      this.context.fillStyle = '#0E8C00';
      this.context.fillText(this.guildName, Math.ceil(this.canvas.width / 2), this.height, this.maxWidth);
      this.height += lineHeight;
    }

    if (this.name.length) {
      this.context.textAlign = 'center';
      this.context.fillStyle = 'black';
      this.context.fillText(this.name, Math.ceil(this.canvas.width / 2) + 1, this.height + 1, this.maxWidth);
      this.context.fillStyle = 'white';
      this.context.fillText(this.name, Math.ceil(this.canvas.width / 2), this.height, this.maxWidth);
      this.height += lineHeight;
    }

    this.context.textAlign = 'left';
    for (let i = 0; i < chatLines.length; i++) {
      this.context.fillStyle = 'black';
      this.context.fillText(chatLines[i], Math.ceil((this.maxWidth - chatWidth) / 2) + 1, this.height + 1, this.maxWidth);
      this.context.fillStyle = this._chatFading ? '#C0C0C0' : 'white';
      this.context.fillText(chatLines[i], Math.ceil((this.maxWidth - chatWidth) / 2), this.height, this.maxWidth);
      this.height += lineHeight;
    }
  }

  render() {
    if (this.chat.length) {
      if (this._chatTick + this._chatTimeSpan < Renderer.tick) {
        this._chat = '';
        this.update();
        if (!this.display) {
          if (this.canvas.parentNode) {
            document.body.removeChild(this.canvas);
          }

          return;
        }
      } else if (this._chatTick + (this._chatTimeSpan / 2) < Renderer.tick) {
        if (!this._chatFading) {
          this._chatFading = true;
          this.update();
        }
      } else {
        this._chatFading = false;
      }
    }

    let left = this.entity.x - (Camera.position[0] * -1) - 70;
    let top = this.entity.y - (Camera.position[1] * -1) - 80 - this.height;

    // // Keep the canvas within the scene bounding rect
    if (left + this.maxWidth - this.width < 0) {
      left += Math.abs(left);
    } else if (left + this.width > Mouse.screen.width) {
      left -= left + this.width - Mouse.screen.width;
    }

    if (top < 0) {
      top += 100 + this.height;
    }

    this.canvas.style.left = left + 'px';
    this.canvas.style.top = top + 'px';

    if (!this.canvas.parentNode) {
      document.body.appendChild(this.canvas);
    }
  }

  get chat() {
    return this._chat;
  }

  set chat(value) {
    this._chat = value;
    this._chatTick = Renderer.tick;
    this._chatTimeSpan = 3 * 1000 + (this.chat.length * 1000);
    this._chatFading = false;
  }
}

export default EntityDisplay;
