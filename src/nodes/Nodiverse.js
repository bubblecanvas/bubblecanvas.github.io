/**
 * Handles the dynamics of the 'universe' of nodes.
 */

const GravitifyApplication = require('../graphics/GravitifyApplication');
import { KineticSurfaceFriction, BoostForce } from './Forces'
import { Node }  from './Node'
const NodeDrawer = require('../graphics/NodeDrawer');

const globalGameConfig = GravitifyApplication.globalGameConfig;
const pixiApp = GravitifyApplication.pixiApp;

/**
 */
function applyDifferentialAsStack(...differentials) {
  for (let i = 1; i < differentials.length; i++) {
    differentials[i].x += differentials[i-1].x;
    differentials[i].y += differentials[i-1].y;
  }
}

class Nodiverse {

  constructor(nodeCount=15) {
    this.nodeCount = nodeCount;
    this.nodes = new Array(nodeCount);

    const step = globalGameConfig.width / nodeCount;
    for (let nIdx = 0; nIdx < nodeCount; nIdx++) {
      let pos = nIdx*step + Math.random()*step;
      let drawingObject = new PIXI.Sprite(NodeDrawer.AirNode.defaultTexture);

      pixiApp.stage.addChild(drawingObject);
      const node = new Node(pos, pos, 26, drawingObject);
      this.nodes[nIdx] = node;

      node.nodeTracker = {
        forces: [ new KineticSurfaceFriction(node, -1.5),
                  new BoostForce(node) ]
        // just friction & boost (keeping it in motion)
      }
    }

    this.render = this.render.bind(this);
    this.renderRecursive = this.renderRecursive.bind(this);
    this.updateTime = this.updateTime.bind(this);

    this.uiActive = true;
  }

  startLooper() {
    this.updateClock = setInterval(this.updateTime, 1 / GravitifyApplication.TIME_UNIT);
    this.renderRecursive();
  }

  stopLooper() {
    const updateClock = this.updateClock;
    if (updateClock != undefined) {
      clearInterval(updateClock);
    }
  }

  updateTime() {
    this.nodes.forEach(function(node) {
      // Apply force differential
      let netAcc = { x: 0, y: 0 };
      node.nodeTracker.forces.forEach(function(force) {
        const forceAcc = force.getCasualAcc();
        netAcc.x += forceAcc.x;
        netAcc.y += forceAcc.y;
      });
      applyDifferentialAsStack(netAcc, node.velocity);
      if (Math.abs(node.velocity.x) < 1)
        node.velocity.x = 0;
      if (Math.abs(node.velocity.y) < 1)
          node.velocity.y = 0;

      node.timeUpdate();
    });
  }

  render() {
    this.nodes.forEach(function(node) {
      node.renderUpdate();
    });

    pixiApp.render();
  }

  renderRecursive() {
    this.render();

    if (this.uiActive)
      requestAnimationFrame(this.renderRecursive);
  }

}

export default Nodiverse;
