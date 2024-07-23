export enum PartName {
  BASE_TURRET_1 = "Turret Base 1",
  BASE_TURRET_2 = "Turret Base 2",
  BASE_TURRET_3 = "Turret Base 3",
  BASE_TURRET_LEGS_1 = "Turret Base Legs 1",
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
      PartName.BASE_TURRET_2,
      PartName.BASE_TURRET_3,
      PartName.BASE_TURRET_LEGS_1,
    ],
  ],
]);

export interface Part {
  name: PartName;
  type: PartType;
}
