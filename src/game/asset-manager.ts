import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { PartName } from "./parts";

export class AssetManager {
  models = new Map();
  textures = new Map();
  animations = new Map();

  private loadingManager = new THREE.LoadingManager();

  applyModelTexture(model: THREE.Object3D, textureName: string) {
    const texture = this.textures.get(textureName);
    if (!texture) {
      return;
    }

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.map = texture;
      }
    });
  }

  cloneModel(name: string): THREE.Object3D {
    const model = this.models.get(name);
    if (model) {
      return SkeletonUtils.clone(model);
    }

    // Ensure we always return an object 3d
    return new THREE.Mesh(
      new THREE.SphereGeometry(),
      new THREE.MeshBasicMaterial({ color: "red" })
    );
  }

  load(): Promise<void> {
    const fbxLoader = new FBXLoader(this.loadingManager);
    const gltfLoader = new GLTFLoader(this.loadingManager);
    const rgbeLoader = new RGBELoader(this.loadingManager);
    const textureLoader = new THREE.TextureLoader(this.loadingManager);

    this.loadModels(fbxLoader, gltfLoader);
    this.loadTextures(rgbeLoader, textureLoader);

    return new Promise((resolve) => {
      this.loadingManager.onLoad = () => {
        this.setupTurrets();
        resolve();
      };
    });
  }

  private loadModels(fbxLoader: FBXLoader, gltfLoader: GLTFLoader) {
    // bases
    const baseTurrets = new URL("/models/Base_Turrets.fbx", import.meta.url)
      .href;
    fbxLoader.load(baseTurrets, (group) => {
      // Pull out the children
      group.children.forEach((child) => {
        console.log(child.name);
        this.models.set(child.name, child);
      });
    });
  }

  private loadTextures(
    rgbeLoader: RGBELoader,
    textureLoader: THREE.TextureLoader
  ) {
    // env map
    const envMap = new URL(
      "/textures/zwartkops_straight_morning_1k.hdr",
      import.meta.url
    ).href;
    rgbeLoader.load(envMap, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.textures.set("env-map", texture);
    });

    // turret textures

    const turretBlackUrl = new URL(
      "/textures/Turrets_albedo_Black.png",
      import.meta.url
    ).href;
    textureLoader.load(turretBlackUrl, (texture) => {
      this.textures.set("turret-black", texture);
    });

    const turretRed = new URL(
      "/textures/Turrets_albedo_Red.png",
      import.meta.url
    ).href;
    textureLoader.load(turretRed, (texture) =>
      this.textures.set("turret-red", texture)
    );

    const turretNormal = new URL(
      "/textures/Turrets_normal_PBR.png",
      import.meta.url
    ).href;
    textureLoader.load(turretNormal, (texture) => {
      texture.colorSpace = THREE.LinearSRGBColorSpace;
      this.textures.set("turret-normal", texture);
    });

    const turretAo = new URL("/textures/Turrets_AO.png", import.meta.url).href;
    textureLoader.load(turretAo, (texture) => {
      texture.colorSpace = THREE.LinearSRGBColorSpace;
      this.textures.set("turret-ao", texture);
    });

    const turretEmission = new URL(
      "/textures/Turrets_Emission.png",
      import.meta.url
    ).href;
    textureLoader.load(turretEmission, (texture) => {
      texture.colorSpace = THREE.LinearSRGBColorSpace;
      this.textures.set("turret-emission", texture);
    });

    const turretRoughness = new URL(
      "/textures/Turrets_Roughness.png",
      import.meta.url
    ).href;
    textureLoader.load(turretRoughness, (texture) => {
      texture.colorSpace = THREE.LinearSRGBColorSpace;
      this.textures.set("turret-roughness", texture);
    });

    const turretMetalness = new URL(
      "/textures/Turrets_Metalness.png",
      import.meta.url
    ).href;
    textureLoader.load(turretMetalness, (texture) => {
      texture.colorSpace = THREE.LinearSRGBColorSpace;
      this.textures.set("turret-metalness", texture);
    });
  }

  private setupTurrets() {
    // Get each turret piece and apply shared maps and default albedo map
    this.models.forEach((model: THREE.Group) => {
      model.scale.multiplyScalar(0.01);
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = new THREE.MeshPhysicalMaterial();
          mat.map = this.textures.get("turret-red");
          mat.normalMap = this.textures.get("turret-normal");
          mat.aoMap = this.textures.get("turret-ao");
          mat.roughnessMap = this.textures.get("turret-roughness");
          mat.metalness = 1;
          mat.emissiveMap = this.textures.get("turret-emission");
          mat.emissiveIntensity = 10;
          mat.emissive = new THREE.Color(0xff0000);
          child.material = mat;
        }
      });
    });
  }
}
