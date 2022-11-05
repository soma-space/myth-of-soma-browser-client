/**
 * Background Music
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
import Client from 'core/client';

const _audio = document.createElement('audio');
let _volume = 0;

function play(filename) {
  _audio.src = filename;
  _audio.volume = _volume;
  _audio.play();
}

function stop() {
  _audio.pause();
}

function setVolume(value) {
  _volume = value;
  _audio.volume = _volume;
}

const BGM = {play, stop, setVolume};
export default BGM;
