export enum PartName {
  BASE_TURRET_1 = "Turret Base 1",
  BASE_TURRET_LEGS_1 = "Turret Base Legs 1",
  BASE_TOWER_1 = "Tower Base 1",
  HEAD_MOUNT_LARGE = "Head Mount Large",
}

export enum PartType {
  BASE = "Base",
  MID = "Mid section",
  HEAD_MOUNT = "Head mount",
  HEAD = "Head",
  ARM_MOUNT = "Arm mount",
  ARM = "Arm",
}

export const partsMap = new Map<PartType, PartName[]>([
  [
    PartType.BASE,
    [
      PartName.BASE_TURRET_1,
      PartName.BASE_TURRET_LEGS_1,
      PartName.BASE_TOWER_1,
    ],
  ],
  [PartType.HEAD_MOUNT, [PartName.HEAD_MOUNT_LARGE]],
]);

export interface Part {
  name: PartName;
  type: PartType;
}
