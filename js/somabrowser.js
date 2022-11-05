/**
 * Myth of Soma Browser Client entry point.
 *
 * This file is part of the Myth of Soma Browser Client.
 *
 * @author finito
 */
(function () {
    'use strict';

    /**
     * SomaBrowser constructor
     * @constructor
     * @this {SomaBrowser}
     */
    var SomaBrowser = function () {
    };

    /**
     * @var {number} client screen width
     */
    SomaBrowser.prototype.width = 800;

    /**
     * @var {number} client screen height
     */
    SomaBrowser.prototype.height = 600;

    SomaBrowser.prototype.run = function () {
        // Create the popup window
        var script = document.getElementsByTagName('script');
        var appUrl = script[script.length-2].src.replace('js/somabrowser.js', 'somabrowser.html');
        this._window = window.open(
            appUrl,
            '_blank',
            [
                'directories = 0',
                'fullscreen = 0',
                'top = ' + ((window.innerHeight || document.body.clientHeight) - this.height) / 2,
                'left = ' + ((window.innerWidth || document.body.clientWidth) - this.width) / 2,
                'height = ' + this.height,
                'width = ' + this.width,
                'location = 0',
                'menubar = 0',
                'resizable = 0',
                'scrollbars = 0',
                'status = 0',
                'toolbar = 0'
            ].join(',')
        );

        // Wait for the app to be ready
        var somaBrowser = this;
        function onMessage(event) {
            clearInterval(somaBrowser._interval);
            window.removeEventListener('message', onMessage, false);
        }
        this._interval = setInterval(function () {
            somaBrowser._window.postMessage({}, '*');
        }, 100);
        window.addEventListener('message', onMessage, false);
    }

    /**
     * Export
     */
    window.SomaBrowser = SomaBrowser;
})();