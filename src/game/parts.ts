export enum PartName {
  BASE_TURRET_0 = "Base_Turret_Lvl0",
  BASE_TURRET_1 = "Base_Turret_Lvl1",
  BASE_TURRET_2 = "Base_Turret_Lvl2",
  BASE_TURRET_3 = "Base_Turret_Lvl3",
  BASE_TURRET_4 = "Base_Turret_Lvl4",
  BASE_TURRET_5 = "Base_Turret_Lvl5",
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
      PartName.BASE_TURRET_4,
      PartName.BASE_TURRET_5,
    ],
  ],
]);

export interface Part {
  name: PartName;
  type: PartType;
}
