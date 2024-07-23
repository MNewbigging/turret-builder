import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { RenderPipeline } from "./render-pipeline";
import { AssetManager } from "./asset-manager";
import { makeAutoObservable, observable } from "mobx";

interface Part {
  id: string;
  name: string;
  object: THREE.Object3D;
}

export class GameState {
  private renderPipeline: RenderPipeline;
  private clock = new THREE.Clock();

  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera();
  private controls: OrbitControls;

  @observable basePart?: Part;

  constructor(private assetManager: AssetManager) {
    makeAutoObservable(this);

    this.setupCamera();

    this.renderPipeline = new RenderPipeline(this.scene, this.camera);

    this.setupLights();

    this.controls = new OrbitControls(this.camera, this.renderPipeline.canvas);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.target.set(0, 1, 0);

    this.scene.background = new THREE.Color("#1680AF");

    // Start game
    this.update();
  }

  nextBaseItem = () => {
    // Get list of base items
    const ids = this.getBaseItemIds();

    let nextIdIndex = 0;

    if (this.basePart) {
      const currentIndex = ids.findIndex((id) => id === this.basePart?.id);
      nextIdIndex = currentIndex === ids.length - 1 ? 0 : currentIndex + 1; // loop around
      this.scene.remove(this.basePart.object);
    }

    const id = ids[nextIdIndex];

    const basePart: Part = {
      id,
      name: id, // todo - create nicer user-facing names for items
      object: this.assetManager.models.get(id),
    };

    this.basePart = basePart;
    this.scene.add(this.basePart.object);
  };

  private setupCamera() {
    this.camera.fov = 75;
    this.camera.far = 500;
    this.camera.position.set(0, 1.5, 3);
  }

  private setupLights() {
    const ambientLight = new THREE.AmbientLight(undefined, 0.25);
    this.scene.add(ambientLight);

    const directLight = new THREE.DirectionalLight(undefined, 2);
    directLight.position.copy(new THREE.Vector3(0.75, 1, 0.75).normalize());
    this.scene.add(directLight);
  }

  private getBaseItemIds() {
    return [
      "base-turret-lvl0",
      "base-turret-lvl1",
      "base-turret-lvl2",
      "base-turret-lt-lvl1",
    ];
  }

  private update = () => {
    requestAnimationFrame(this.update);

    const dt = this.clock.getDelta();

    this.controls.update();

    this.renderPipeline.render(dt);
  };
}
