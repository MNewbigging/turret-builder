import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

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
    // turret bases

    const baseTurret0 = new URL("/models/Base_Turret_Lvl0.fbx", import.meta.url)
      .href;
    fbxLoader.load(baseTurret0, (group) => this.models.set(group.name, group));

    const baseTurret1 = new URL("/models/Base_Turret_Lvl1.fbx", import.meta.url)
      .href;
    fbxLoader.load(baseTurret1, (group) => this.models.set(group.name, group));

    const baseTurret2 = new URL("/models/Base_Turret_Lvl2.fbx", import.meta.url)
      .href;
    fbxLoader.load(baseTurret2, (group) => this.models.set(group.name, group));

    const baseTurret3 = new URL("/models/Base_Turret_Lvl3.fbx", import.meta.url)
      .href;
    fbxLoader.load(baseTurret3, (group) => this.models.set(group.name, group));

    const baseTurret4 = new URL("/models/Base_Turret_Lvl4.fbx", import.meta.url)
      .href;
    fbxLoader.load(baseTurret4, (group) => this.models.set(group.name, group));

    const baseTurret5 = new URL("/models/Base_Turret_Lvl5.fbx", import.meta.url)
      .href;
    fbxLoader.load(baseTurret5, (group) => this.models.set(group.name, group));

    // base mounts

    const baseMount = new URL("/models/Base_Top_Mount.fbx", import.meta.url)
      .href;
    fbxLoader.load(baseMount, (group) => this.models.set(group.name, group));

    const baseMountSimple = new URL(
      "/models/Base_Top_Mount_Simple.fbx",
      import.meta.url
    ).href;
    fbxLoader.load(baseMountSimple, (group) =>
      this.models.set(group.name, group)
    );

    // cockpits

    const botRound1 = new URL(
      "/models/Cockpit_Bot_Round_Lvl1.fbx",
      import.meta.url
    ).href;
    fbxLoader.load(botRound1, (group) => {
      group.name = "Cockpit_Bot_Round_Lvl1";
      this.models.set(group.name, group);
    });

    const botRound2 = new URL(
      "/models/Cockpit_Bot_Round_Lvl2.fbx",
      import.meta.url
    ).href;
    fbxLoader.load(botRound2, (group) => {
      group.name = "Cockpit_Bot_Round_Lvl2";
      this.models.set(group.name, group);
    });

    const botSpy = new URL("/models/Cockpit_Bot_Spy.fbx", import.meta.url).href;
    fbxLoader.load(botSpy, (group) => {
      group.name = "Cockpit_Bot_Spy";
      this.models.set(group.name, group);
    });

    const wedge1 = new URL(
      "/models/Cockpit_Bot_Wedge_Lvl1.fbx",
      import.meta.url
    ).href;
    fbxLoader.load(wedge1, (group) => {
      console.log(group);
      this.models.set(group.name, group);
    });

    const wedge2 = new URL(
      "/models/Cockpit_Bot_Wedge_Lvl2.fbx",
      import.meta.url
    ).href;
    fbxLoader.load(wedge2, (group) => this.models.set(group.name, group));

    // backpack brackets

    const bracket1 = new URL(
      "/models/Backpack_Bracket_Lvl1.fbx",
      import.meta.url
    ).href;
    fbxLoader.load(bracket1, (group) => this.models.set(group.name, group));

    const bracket2 = new URL(
      "/models/Backpack_Bracket_Lvl2.fbx",
      import.meta.url
    ).href;
    fbxLoader.load(bracket2, (group) => this.models.set(group.name, group));

    const bracket3 = new URL(
      "/models/Backpack_Bracket_Lvl3.fbx",
      import.meta.url
    ).href;
    fbxLoader.load(bracket3, (group) => this.models.set(group.name, group));
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
