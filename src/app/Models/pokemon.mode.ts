export interface Move {
    name: string;
    power: number;
    type: string;
    pp: number;
    maxPp: number;
}

export interface Pokemon {
    id: number;
    name: string;
    types: string[];
    imageUrl: string;
    selected?: boolean;
    hp: number;
    maxHp: number;
    stats: {
        attack: number;
        defense: number;
        speed: number;
    };
    moves: Move[];
}

export interface BattleState {
    player: Pokemon;
    enemy: Pokemon;
}