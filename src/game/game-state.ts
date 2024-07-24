import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { RenderPipeline } from "./render-pipeline";
import { AssetManager } from "./asset-manager";
import { action, makeAutoObservable, observable } from "mobx";
import { Part, PartName, partsMap, PartType } from "./parts";

export class GameState {
  private renderPipeline: RenderPipeline;
  private clock = new THREE.Clock();

  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera();
  private controls: OrbitControls;

  currentTurret = new Map<PartType, Part>();

  constructor(private assetManager: AssetManager) {
    makeAutoObservable(this);

    this.setupCamera();

    this.renderPipeline = new RenderPipeline(this.scene, this.camera);

    //this.setupLights();

    this.controls = new OrbitControls(this.camera, this.renderPipeline.canvas);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.target.set(0, 1, 0);
    this.camera.position.z = 5;

    this.scene.background = new THREE.Color("#1680AF");
    const envMap = this.assetManager.textures.get("env-map");
    this.scene.environment = envMap;

    // There must always be a base part
    this.currentTurret.set(PartType.BASE, {
      name: PartName.BASE_TURRET_1,
      type: PartType.BASE,
    });
    const base = this.assetManager.models.get(PartName.BASE_TOWER_1);
    this.scene.add(base);

    // Start game
    this.update();
  }

  // Cycles through other parts of the same type
  @action nextPartItem = (part: Part) => {
    // Get list of other parts of this type
    const partNames = partsMap.get(part.type) ?? [];

    // Get the index of current part in that list
    const currentIndex = partNames.findIndex(
      (partName) => partName === part.name
    );

    // Find the index of the next part, wrap around the list
    const nextIndex =
      currentIndex === partNames.length - 1 ? 0 : currentIndex + 1;

    // Can now get the next part name
    const nextPartName = partNames[nextIndex];

    // Remove the previous part from the scene
    const prevObject = this.assetManager.models.get(part.name);
    this.scene.remove(prevObject);

    // Add the new one to the scene
    const nextObject = this.assetManager.models.get(nextPartName);
    this.scene.add(nextObject);

    // This is now the new part of its type
    this.currentTurret.set(part.type, { name: nextPartName, type: part.type });
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

  private update = () => {
    requestAnimationFrame(this.update);

    const dt = this.clock.getDelta();

    this.controls.update();

    this.renderPipeline.render(dt);
  };
}
