export enum PartName {
  BASE_TURRET_0 = "Base_Turret_Lvl0",
  BASE_TURRET_1 = "Base_Turret_Lvl1",
  BASE_TURRET_2 = "Base_Turret_Lvl2",
  BASE_TURRET_3 = "Base_Turret_Lvl3",
  BASE_TURRET_4 = "Base_Turret_Lvl4",
  BASE_TURRET_5 = "Base_Turret_Lvl5",
  BASE_MOUNT = "Base_Top_Mount",
  BASE_MOUNT_SMALL = "Base_Top_Mount_Simple",
  HEAD_BOT_ROUND_1 = "Cockpit_Bot_Round_Lvl1",
  HEAD_BOT_ROUND_2 = "Cockpit_Bot_Round_Lvl2",
  HEAD_BOT_SPY = "Cockpit_Bot_Spy",
  HEAD_BOT_WEDGE_1 = "Cockpit_Bot_Wedge_Lvl1",
  HEAD_BOT_WEDGE_2 = "Cockpit_Bot_Wedge_Lvl2",
}

export enum PartType {
  BASE = "Base",
  MID = "Mid section",
  BASE_MOUNT = "Base mount",
  HEAD = "Head",
  ARM_MOUNT = "Arm mount",
  ARM = "Arm",
}

export const partsMap = new Map<PartType, PartName[]>([
  [
    PartType.BASE,
    [
      PartName.BASE_TURRET_0,
      PartName.BASE_TURRET_1,
      PartName.BASE_TURRET_2,
      PartName.BASE_TURRET_3,
      PartName.BASE_TURRET_4,
      PartName.BASE_TURRET_5,
    ],
  ],
  [PartType.BASE_MOUNT, [PartName.BASE_MOUNT, PartName.BASE_MOUNT_SMALL]],
  [
    PartType.HEAD,
    [
      PartName.HEAD_BOT_ROUND_1,
      PartName.HEAD_BOT_ROUND_2,
      PartName.HEAD_BOT_SPY,
      PartName.HEAD_BOT_WEDGE_1,
      PartName.HEAD_BOT_WEDGE_2,
    ],
  ],
]);

export const typesMap = new Map<PartType, PartType>([
  [PartType.BASE, PartType.BASE_MOUNT],
  [PartType.BASE_MOUNT, PartType.HEAD],
]);

export interface Part {
  name: PartName;
  type: PartType;
}
