
import { Character } from "../utils/dndTypes";

export const dummyCharacters: Character[] = [
  {
    id: "1",
    name: "Thorin Stonehelm",
    race: "Dwarf",
    class: "Fighter",
    level: 5,
    background: "Soldier",
    alignment: "Lawful Good",
    experience: 6500,
    attributes: {
      strength: 17,
      dexterity: 12,
      constitution: 16,
      intelligence: 10,
      wisdom: 13,
      charisma: 8
    },
    proficiencyBonus: 3,
    savingThrows: ["Strength", "Constitution"],
    skills: ["Athletics", "Intimidation", "Perception", "Survival"],
    hitPoints: {
      maximum: 47,
      current: 47,
      temporary: 0
    },
    armorClass: 17,
    initiative: 1,
    speed: 25,
    hitDice: {
      total: 5,
      type: "d10",
      used: 0
    },
    inventory: [
      {
        id: "i1",
        name: "Battleaxe",
        description: "Martial melee weapon",
        quantity: 1,
        weight: 4,
        value: 10,
        equipped: true
      },
      {
        id: "i2",
        name: "Chain mail",
        description: "Heavy armor",
        quantity: 1,
        weight: 55,
        value: 75,
        equipped: true
      },
      {
        id: "i3",
        name: "Shield",
        description: "+2 AC",
        quantity: 1,
        weight: 6,
        value: 10,
        equipped: true
      }
    ],
    features: [
      {
        id: "f1",
        name: "Second Wind",
        source: "Fighter",
        description: "You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level."
      },
      {
        id: "f2",
        name: "Action Surge",
        source: "Fighter",
        description: "You can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action."
      },
      {
        id: "f3",
        name: "Martial Archetype: Battle Master",
        source: "Fighter",
        description: "You adopt a style of martial arts. You learn maneuvers that are fueled by special dice called superiority dice."
      }
    ],
    avatarUrl: "https://i.imgur.com/GHv8oS2.jpg"
  },
  {
    id: "2",
    name: "Lyra Nightshade",
    race: "Elf",
    class: "Rogue",
    level: 4,
    background: "Charlatan",
    alignment: "Chaotic Neutral",
    experience: 3800,
    attributes: {
      strength: 10,
      dexterity: 18,
      constitution: 12,
      intelligence: 14,
      wisdom: 13,
      charisma: 15
    },
    proficiencyBonus: 2,
    savingThrows: ["Dexterity", "Intelligence"],
    skills: ["Acrobatics", "Deception", "Insight", "Perception", "Persuasion", "Sleight of Hand", "Stealth"],
    hitPoints: {
      maximum: 27,
      current: 22,
      temporary: 0
    },
    armorClass: 15,
    initiative: 4,
    speed: 30,
    hitDice: {
      total: 4,
      type: "d8",
      used: 0
    },
    inventory: [
      {
        id: "i4",
        name: "Rapier",
        description: "Finesse weapon",
        quantity: 1,
        weight: 2,
        value: 25,
        equipped: true
      },
      {
        id: "i5",
        name: "Shortbow",
        description: "Ranged weapon",
        quantity: 1,
        weight: 2,
        value: 25,
        equipped: false
      },
      {
        id: "i6",
        name: "Leather Armor",
        description: "Light armor",
        quantity: 1,
        weight: 10,
        value: 10,
        equipped: true
      },
      {
        id: "i7",
        name: "Thieves' tools",
        description: "For picking locks",
        quantity: 1,
        weight: 1,
        value: 25,
        equipped: true
      }
    ],
    features: [
      {
        id: "f4",
        name: "Sneak Attack",
        source: "Rogue",
        description: "Once per turn, you can deal extra 2d6 damage to one creature you hit with an attack if you have advantage on the attack roll."
      },
      {
        id: "f5",
        name: "Cunning Action",
        source: "Rogue",
        description: "You can take a bonus action on each of your turns to take the Dash, Disengage, or Hide action."
      },
      {
        id: "f6",
        name: "Roguish Archetype: Assassin",
        source: "Rogue",
        description: "You focus your training on the grim art of death."
      }
    ],
    avatarUrl: "https://i.imgur.com/4Ugqn3A.jpg"
  },
  {
    id: "3",
    name: "Alaric Flameheart",
    race: "Human",
    class: "Wizard",
    level: 3,
    background: "Sage",
    alignment: "Neutral Good",
    experience: 2700,
    attributes: {
      strength: 8,
      dexterity: 14,
      constitution: 13,
      intelligence: 17,
      wisdom: 12,
      charisma: 10
    },
    proficiencyBonus: 2,
    savingThrows: ["Intelligence", "Wisdom"],
    skills: ["Arcana", "History", "Investigation", "Medicine"],
    hitPoints: {
      maximum: 20,
      current: 15,
      temporary: 0
    },
    armorClass: 12,
    initiative: 2,
    speed: 30,
    hitDice: {
      total: 3,
      type: "d6",
      used: 0
    },
    inventory: [
      {
        id: "i8",
        name: "Quarterstaff",
        description: "Simple melee weapon",
        quantity: 1,
        weight: 4,
        value: 2,
        equipped: true
      },
      {
        id: "i9",
        name: "Spellbook",
        description: "Contains wizard spells",
        quantity: 1,
        weight: 3,
        value: 50,
        equipped: true
      },
      {
        id: "i10",
        name: "Component pouch",
        description: "Contains spell components",
        quantity: 1,
        weight: 2,
        value: 25,
        equipped: true
      }
    ],
    spells: [
      {
        id: "s1",
        name: "Magic Missile",
        level: 1,
        school: "Evocation",
        castingTime: "1 action",
        range: "120 feet",
        components: ["V", "S"],
        duration: "Instantaneous",
        description: "You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range.",
        prepared: true
      },
      {
        id: "s2",
        name: "Burning Hands",
        level: 1,
        school: "Evocation",
        castingTime: "1 action",
        range: "Self (15-foot cone)",
        components: ["V", "S"],
        duration: "Instantaneous",
        description: "A thin sheet of flames shoots forth from your outstretched fingertips.",
        prepared: true
      },
      {
        id: "s3",
        name: "Mage Armor",
        level: 1,
        school: "Abjuration",
        castingTime: "1 action",
        range: "Touch",
        components: ["V", "S", "M"],
        duration: "8 hours",
        description: "You touch a willing creature who isn't wearing armor, and a protective magical force surrounds it until the spell ends.",
        prepared: true
      },
      {
        id: "s4",
        name: "Scorching Ray",
        level: 2,
        school: "Evocation",
        castingTime: "1 action",
        range: "120 feet",
        components: ["V", "S"],
        duration: "Instantaneous",
        description: "You create three rays of fire and hurl them at targets within range.",
        prepared: true
      }
    ],
    features: [
      {
        id: "f7",
        name: "Arcane Recovery",
        source: "Wizard",
        description: "Once per day when you finish a short rest, you can recover spell slots with a combined level equal to half your wizard level (rounded up)."
      },
      {
        id: "f8",
        name: "Arcane Tradition: Evocation",
        source: "Wizard",
        description: "You focus your study on magic that creates powerful elemental effects."
      },
      {
        id: "f9",
        name: "Sculpt Spells",
        source: "Wizard (Evocation)",
        description: "You can create pockets of relative safety within the effects of your evocation spells."
      }
    ],
    avatarUrl: "https://i.imgur.com/uEIdkfL.jpg"
  }
];
