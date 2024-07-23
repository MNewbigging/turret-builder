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

    const baseTurretLvl0 = new URL(
      "/models/base_turret_lvl0.fbx",
      import.meta.url
    ).href;
    fbxLoader.load(baseTurretLvl0, (group) =>
      this.models.set(PartName.BASE_TURRET_1, group)
    );

    const baseTurretLtLvl1 = new URL(
      "/models/base_turret_lt_lvl1.fbx",
      import.meta.url
    ).href;
    fbxLoader.load(baseTurretLtLvl1, (group) =>
      this.models.set(PartName.BASE_TURRET_LEGS_1, group)
    );

    const baseTower0 = new URL("/models/base_tower_lvl0.fbx", import.meta.url)
      .href;
    fbxLoader.load(baseTower0, (group) =>
      this.models.set(PartName.BASE_TOWER_1, group)
    );

    // mounts

    const baseTopMount = new URL("/models/base_top_mount.fbx", import.meta.url)
      .href;
    fbxLoader.load(baseTopMount, (group) =>
      this.models.set("base-top-mount", group)
    );
  }

  private loadTextures(
    rgbeLoader: RGBELoader,
    textureLoader: THREE.TextureLoader
  ) {
    // turret textures

    const turretBlackUrl = new URL(
      "/textures/Turrets_albedo_Black.png",
      import.meta.url
    ).href;
    textureLoader.load(turretBlackUrl, (texture) => {
      this.textures.set("turret-black", texture);
    });

    const turretNormal = new URL(
      "/textures/Turrets_normal_PBR.png",
      import.meta.url
    ).href;
    textureLoader.load(turretNormal, (texture) =>
      this.textures.set("turret-normal", texture)
    );

    const turretAo = new URL("/textures/Turrets_AO.png", import.meta.url).href;
    textureLoader.load(turretAo, (texture) =>
      this.textures.set("turret-ao", texture)
    );

    const turretEmission = new URL(
      "/textures/Turrets_Emission.png",
      import.meta.url
    ).href;
    textureLoader.load(turretEmission, (texture) =>
      this.textures.set("turret-emission", texture)
    );

    const turretRoughness = new URL(
      "/textures/Turrets_Roughness.png",
      import.meta.url
    ).href;
    textureLoader.load(turretRoughness, (texture) =>
      this.textures.set("turret-roughness", texture)
    );

    const turretMetalness = new URL(
      "/textures/Turrets_Metalness.png",
      import.meta.url
    ).href;
    textureLoader.load(turretMetalness, (texture) =>
      this.textures.set("turret-metalness", texture)
    );
  }

  private setupTurrets() {
    // Get each turret piece and apply shared maps and default albedo map
    this.models.forEach((model: THREE.Group) => {
      model.scale.multiplyScalar(0.01);
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = new THREE.MeshPhysicalMaterial();
          mat.map = this.textures.get("turret-black");
          mat.normalMap = this.textures.get("turret-normal");
          mat.aoMap = this.textures.get("turret-ao");
          mat.roughnessMap = this.textures.get("turret-roughness");
          mat.metalnessMap = this.textures.get("turret-metalness");
          mat.emissiveMap = this.textures.get("turret-emission");
          child.material = mat;
        }
      });
    });
  }
}
