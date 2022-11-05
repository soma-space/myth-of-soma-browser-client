define(function () {
	'use strict';

	var Sprite = function (image) {
		this.image = image;
		this.position = {x: 0, y: 0};
		this.offset = {x: 0, y: 0};
		this.texture = null;
		this.palette = null;
	}

	return Sprite;
});