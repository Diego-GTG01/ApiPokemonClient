export interface Pokemon {
  id: number;
  nombre: string;
  tipo: string;
  imagen: string;
  imagenShiny: string;
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  isFlipped: boolean;
  isFavorite: boolean;
  soundUrl?: string;
  moves?: string[];
  abilities?: {
    name: string;
    url: string;
    description: string;
  }[];
  description?: string;
  selectedTab?: number;
  varieties?: { id: number; name: string }[];
  selectedVariety?: number;
  height?: number;
  weight?: number;
  sprites?: {
    back_default: string;
    back_female: string;
    back_shiny_female: string;
    front_default: string;
    front_female: string;
    front_shiny: string;
    front_shiny_female: string;
  };
  spriteSelected: string;
  chainEvolution: {
    url: string,
    evolutions: number[]
  }
}
