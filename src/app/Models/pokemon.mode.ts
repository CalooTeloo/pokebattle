// pokemon.model.ts
export interface Pokemon {
  id: number;
  name: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  abilities: {
    name: string;
    damage: number;
  }[];
  image: string;
}