/**
 * Main state for client.
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import Thread from 'core/thread';

import Renderer from 'renderer/renderer';
import SpriteRenderer from 'renderer/spriterenderer';

import LoginEngine from 'engine/loginengine';

$(function() {
  const cursor = 'resources/cursor.cur';
  $('head').append([
    '<style>',
      'button {cursor: url(' + cursor + '), auto;}',
      'button:active {cursor: url(' + cursor + '), auto;}',
    '</style>'
  ].join('\n'));

  let threadStarted = false;
  Thread.onStart = function() {
    console.debug('Thread has started');
    threadStarted = true;
    Thread.send('FILESYSTEM_INIT', '', function() {
      LoginEngine.initialize();
    });
  };

  Thread.initialize();
  Renderer.initialize();
  SpriteRenderer.initialize(Renderer.gl);
});
