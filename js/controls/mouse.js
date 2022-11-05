/**
 * Mouse
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
const Mouse = {
  /**
   * @var {boolean} Is the mouse enabled (map is being rendered)
   */
  enabled: false,

  /**
   * Mouse screen position
   */
  screen: {
    x: -1,
    y: -1,
    width: 0,
    height: 0
  },

  /**
   * Mouse world position (map cell)
   */
  world: {
    x: -1,
    y: -1
  }
};

$(document).mousemove((event) => {
  Mouse.screen.x = Math.min(Math.max(event.pageX, 0), Mouse.screen.width);
  Mouse.screen.y = Math.min(Math.max(event.pageY, 0), Mouse.screen.height);
});

export default Mouse;
