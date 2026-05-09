export interface Pokemon {
  id: number;
  nombre: string;
  tipo: string;
  imagen: string;
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
  abilities?: string[];
  description?: string;
  selectedTab?: number;
  varieties?: { id: number; name: string }[];
  selectedVariety?: number;
  
}