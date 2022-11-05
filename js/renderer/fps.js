define(function () {
	'use strict';

	var FPS = function () {
		this.frameTime = null;
		this.frameText = null;
		this.frameCount = 0;
	}
	
	FPS.prototype.draw = function (render) {
		this.frameCount += 1;
		var time = new Date().getTime();
		if (time - this.frameTime >= 1000) {
			var fps = this.frameCount;
			var mspf = 1000 / fps;

			this.frameText = "FPS: " + fps + " MSPF: " + mspf;

			this.frameCount = 0;
			this.frameTime = time;
		}
		render.drawText(this.frameText, 0, 0, "20pt Calibri", "#00ff00");
	}
	
	return FPS;
});