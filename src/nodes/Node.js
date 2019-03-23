/**
 * A Gravitifiy node is an object floating in the canvas that
 * experiences mututal forces from other nodes.
 */
const GravitifyApplication = require('../graphics/GravitifyApplication');
const PIXI = require('pixi.js');

const DEFAULT_DENSITY = 2;
const PI = Math.PI;

const defaultClipWidth = GravitifyApplication.globalGameConfig.width;
const defaultClipHeight = GravitifyApplication.globalGameConfig.height;

export class Node {

  constructor(initX, initY, radius, drawingObject, density=DEFAULT_DENSITY) {
    this.position = {
      x: initX,
      y: initY
    };

    this.velocity = {
      x: 0,
      y: 0
    }

    this.metrics = {
      density: density,
      mass: PI * radius * radius * density,
      radius: radius
    };

    this.drawingObject = drawingObject;
  }

  getX() {
    return this.position.x;
  }

  getY() {
    return this.position.y;
  }

  setX(newX) {
    this.position.x = newX;
  }

  setY(newY) {
    this.position.y = newY;
  }

  isOutOfBounds(x, y) {
    const radius = this.metrics.radius;
    return (x <0 || y < 0
        || x > defaultClipWidth-radius*2 || y > defaultClipHeight-radius*2);
  }

  timeUpdate() {
    this.translate(this.velocity.x, this.velocity.y);
  }

  renderUpdate() {
    this.drawingObject.position.x = this.position.x;
    this.drawingObject.position.y = this.position.y;
  }

  translate(dx, dy, checker) {
    const nx = this.position.x + dx;
    const ny = this.position.y + dy;

    if (checker != undefined && !checker(nx, ny))
      return false;
    else if (!this.isOutOfBounds(nx, ny, defaultClipWidth, defaultClipHeight)) {
      this.position.x = nx;
      this.position.y = ny;
      return true;
    } else {
      this.velocity.x = 0;
      this.velocity.y = 0;
    }

    return false;
  }

}
