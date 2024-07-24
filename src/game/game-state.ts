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

  turret = new Map<PartType, Part>();

  @observable currentPartType?: PartType;
  currentPartChoice?: PartName;

  private mountPoint = new THREE.Vector3();

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

    // Start with the base
    this.nextPartType(PartType.BASE);

    // Start game
    this.update();
  }

  changePartChoice(direction: "prev" | "next") {
    if (!this.currentPartType || !this.currentPartChoice) {
      return;
    }

    const partNames = partsMap.get(this.currentPartType) ?? [];

    const currentIndex = partNames.findIndex(
      (partName) => partName === this.currentPartChoice
    );

    const nextIndex =
      direction === "next"
        ? this.getNextIndex(currentIndex, partNames.length)
        : this.getPrevIndex(currentIndex, partNames.length);

    const prevObject = this.assetManager.models.get(this.currentPartChoice);
    this.scene.remove(prevObject);

    const nextPartName = partNames[nextIndex];
    const nextObject = this.assetManager.models.get(nextPartName);
    nextObject.position.copy(this.mountPoint);
    this.scene.add(nextObject);

    this.currentPartChoice = nextPartName;
  }

  selectPartChoice = () => {
    // Get 3d object for this part
    const object = this.assetManager.models.get(
      this.currentPartChoice
    ) as THREE.Object3D;
    console.log(object);

    // Get mount point for next part choice
    const mountChild = getChildNameIncludes(object, "Mount");
    if (!mountChild) {
      console.error("No mounting point found");
      return;
    }

    // Position offsets need scaling as well
    const mountPosition = mountChild.position;
    mountPosition.multiplyScalar(0.01);

    this.mountPoint.copy(mountPosition);

    let nextPartType = PartType.BASE;
    switch (this.currentPartType) {
      case PartType.BASE:
        nextPartType = PartType.BASE_MOUNT;
        break;
    }

    this.nextPartType(nextPartType);
  };

  @action nextPartType(type: PartType) {
    this.currentPartType = type;

    // Get all the parts of this type
    const partNames = partsMap.get(type) ?? [];

    // Look at the first
    this.currentPartChoice = partNames[0];

    const object = this.assetManager.models.get(this.currentPartChoice);
    object.position.copy(this.mountPoint);
    this.scene.add(object);
  }

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

  private getNextIndex(currentIndex: number, length: number) {
    return currentIndex === length - 1 ? 0 : currentIndex + 1;
  }

  private getPrevIndex(currentIndex: number, length: number) {
    return currentIndex === 0 ? length - 1 : currentIndex - 1;
  }
}

function getChildNameIncludes(
  object: THREE.Object3D,
  name: string
): THREE.Object3D | undefined {
  let foundChild: THREE.Object3D | undefined = undefined;
  object.traverse((child) => {
    if (child.name.includes(name)) {
      foundChild = child as THREE.Object3D;
    }
  });

  return foundChild;
}
