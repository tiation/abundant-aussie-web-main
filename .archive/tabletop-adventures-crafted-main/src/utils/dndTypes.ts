
export interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  background: string;
  alignment: string;
  experience: number;
  attributes: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  proficiencyBonus: number;
  savingThrows: string[];
  skills: string[];
  hitPoints: {
    maximum: number;
    current: number;
    temporary: number;
  };
  armorClass: number;
  initiative: number;
  speed: number;
  hitDice: {
    total: number;
    type: string;
    used: number;
  };
  inventory: Item[];
  spells?: Spell[];
  features: Feature[];
  avatarUrl?: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
  weight: number;
  value: number;
  equipped: boolean;
}

export interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string[];
  duration: string;
  description: string;
  prepared: boolean;
}

export interface Feature {
  id: string;
  name: string;
  source: string;
  description: string;
}

export type CharacterClass = 
  | "Barbarian" 
  | "Bard" 
  | "Cleric" 
  | "Druid" 
  | "Fighter" 
  | "Monk" 
  | "Paladin" 
  | "Ranger" 
  | "Rogue" 
  | "Sorcerer" 
  | "Warlock" 
  | "Wizard";

export type Race = 
  | "Dragonborn"
  | "Dwarf"
  | "Elf"
  | "Gnome"
  | "Half-Elf"
  | "Half-Orc"
  | "Halfling"
  | "Human"
  | "Tiefling";

export type Alignment = 
  | "Lawful Good"
  | "Neutral Good"
  | "Chaotic Good"
  | "Lawful Neutral"
  | "True Neutral"
  | "Chaotic Neutral"
  | "Lawful Evil"
  | "Neutral Evil"
  | "Chaotic Evil";

export const getModifier = (score: number): number => {
  return Math.floor((score - 10) / 2);
};

export const formatModifier = (mod: number): string => {
  return mod >= 0 ? `+${mod}` : `${mod}`;
};
