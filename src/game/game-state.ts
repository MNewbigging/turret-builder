import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { RenderPipeline } from "./render-pipeline";
import { AssetManager } from "./asset-manager";
import { action, makeAutoObservable, observable } from "mobx";
import { getBases, Part } from "./parts";

export class GameState {
  private renderPipeline: RenderPipeline;
  private clock = new THREE.Clock();

  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera();
  private controls: OrbitControls;

  private availableParts: Part[] = [];
  @observable currentPart: Part;

  private mountPoint = new THREE.Vector3();

  private turret: Part[] = [];

  constructor(private assetManager: AssetManager) {
    makeAutoObservable(this);

    this.setupCamera();

    this.renderPipeline = new RenderPipeline(this.scene, this.camera);

    this.controls = new OrbitControls(this.camera, this.renderPipeline.canvas);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.target.set(0, 1, 0);
    this.camera.position.z = 5;

    this.scene.background = new THREE.Color("#1680AF");
    const envMap = this.assetManager.textures.get("env-map");
    this.scene.environment = envMap;

    // Start with the bases
    this.availableParts = [...getBases()];
    this.currentPart = this.availableParts[0];
    const baseObject = this.assetManager.models.get(this.currentPart.name);
    this.scene.add(baseObject);

    // Start game
    this.update();
  }

  @action changePartChoice(direction: "prev" | "next") {
    // Cycle through currently available part choices
    const currentIndex = this.availableParts.findIndex(
      (part) => part.name === this.currentPart.name
    );

    const nextIndex =
      direction === "next"
        ? this.getNextIndex(currentIndex, this.availableParts.length)
        : this.getPrevIndex(currentIndex, this.availableParts.length);

    const prevOjbect = this.assetManager.models.get(this.currentPart.name);
    this.scene.remove(prevOjbect);

    const nextPart = this.availableParts[nextIndex];

    const nextObject = this.assetManager.models.get(nextPart.name);
    nextObject.position.copy(this.mountPoint);
    this.scene.add(nextObject);

    this.currentPart = nextPart;
    console.log(nextObject);
  }

  selectPartChoice = () => {
    // Add this part to the turret
    this.turret.push(this.currentPart);

    // Get the next set of available parts
    this.availableParts = this.currentPart.getAccepted();
    const nextPart = this.availableParts[0];

    // Get the mount point on current part for the new available parts
    this.updateMountPoint(this.currentPart, nextPart.mountsTo);

    // Show first choice immediately
    this.currentPart = this.availableParts[0];
    const object = this.assetManager.models.get(this.currentPart.name);
    object.position.copy(this.mountPoint);
    this.scene.add(object);
  };

  private setupCamera() {
    this.camera.fov = 75;
    this.camera.far = 500;
    this.camera.position.set(0, 1.5, 3);
  }

  private updateMountPoint(fromPart: Part, mountName: string) {
    const object = this.assetManager.models.get(
      fromPart.name
    ) as THREE.Object3D;
    const mountObject = object.getObjectByName(mountName);
    if (!mountObject) {
      return;
    }

    // Position offsets need scaling as well
    const mountPosition = mountObject.position;
    mountPosition.multiplyScalar(0.01);

    this.mountPoint.add(mountPosition);
  }

  private update = () => {
    requestAnimationFrame(this.update);

    const dt = this.clock.getDelta();

    this.controls.update();

    this.renderPipeline.render(dt);
  };

  private getNextIndex(currentIndex: number, length: number) {
    return currentIndex === length - 1 ? 0 : currentIndex + 1;
  }

  private getPrevIndex(currentIndex: number, length: number) {
    return currentIndex === 0 ? length - 1 : currentIndex - 1;
  }
}
