/**
 * ORDER:
 * - Base
 * - ? Mid section
 * - Base mount
 * - Head
 * - ? Head bracket or Back plate
 * - Left arm
 * - Right arm
 * - Top
 */
export enum PartType {
  BASE = "Base",
  BASE_SECTION = "Base section",
  BASE_MOUNT = "Base mount",
  HEAD = "Head",
  HEAD_BRACKET = "Head bracket",
  ARM_MOUNT = "Arm mount",
  ARM = "Arm",
}

export interface Part {
  name: string;
  type: PartType;
  getAccepted: () => Part[];
  mountsTo: string; // refers to name of mount object on previous part
}

export function getBases(): Part[] {
  const turretBases: Part[] = [];
  for (let i = 0; i < 6; i++) {
    const turretBase: Part = {
      name: `Base_Turret_Lvl${i}`,
      type: PartType.BASE,
      getAccepted: getBaseMounts,
      mountsTo: "",
    };
    turretBases.push(turretBase);
  }

  return turretBases;
}

export function getBaseMounts(): Part[] {
  return ["Base_Top_Mount", "Base_Top_Mount_Simple"].map((name) => ({
    name,
    type: PartType.BASE_MOUNT,
    getAccepted: getHeads,
    mountsTo: "SOCKET_Mount_Top",
  }));
}

export function getHeads(): Part[] {
  return [
    "Cockpit_Bot_Round_Lvl1",
    "Cockpit_Bot_Round_Lvl2",
    "Cockpit_Bot_Spy",
    "Cockpit_Bot_Wedge_Lvl1",
    "Cockpit_Bot_Wedge_Lvl2",
  ].map((name) => ({
    name,
    type: PartType.HEAD,
    getAccepted: getBrackets,
    mountsTo: "SOCKET_Mount_Top",
  }));
}

export function getBrackets(): Part[] {
  return [
    "Backpack_Bracket_Lvl1",
    "Backpack_Bracket_Lvl2",
    "Backpack_Bracket_Lvl3",
  ].map((name) => ({
    name,
    type: PartType.HEAD_BRACKET,
    getAccepted: () => [],
    mountsTo: "Mount_Backpack",
  }));
}
