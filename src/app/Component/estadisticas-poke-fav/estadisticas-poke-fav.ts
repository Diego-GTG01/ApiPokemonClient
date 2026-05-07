import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Pokemon } from '../../Interface/pokemonDTO';
import { PokemonFavoritoService } from '../../Service/pokemon-favorito-service';

@Component({
  selector: 'app-estadisticas-poke-fav',
  imports: [CommonModule],
  templateUrl: './estadisticas-poke-fav.html',
  styleUrl: './estadisticas-poke-fav.css',
})
export class EstadisticasPokeFav {
  constructor(
    private pokemonFavoritoService: PokemonFavoritoService,
  ) {
    this.pokemonFavoritoService.GetMostFavoritePokemon().subscribe((res) => {
      console.log(String(res.object[0]))
      this.favoriteStats.mostFavorite.nombre = res.object[0];
      this.favoriteStats.mostFavorite.idPokemon = res.object[1];
      this.favoriteStats.mostFavorite.total = res.object[2];
      this.favoriteStats.mostFavorite.tipo = "normal";
      
    });
    this.pokemonFavoritoService.GetLeastFavoritePokemon().subscribe((res) => {
      console.log(res)
    }
    );
    this.pokemonFavoritoService.GetAllFavoritePokemon().subscribe((res) => {
      console.log(res)
    }
    );
  }

  private typeColors: { [key: string]: string } = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    poison: '#A040A0',
    psychic: '#F85888',
    rock: '#B8A038',
    ground: '#E0C068',
    ice: '#98D8D8',
    bug: '#A8B820',
    dragon: '#7038F8',
    ghost: '#705898',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
    fighting: '#C03028',
    flying: '#A890F0',
  };
  favoriteStats = {
    mostFavorite: {
      nombre: 'Pikachu',
      total: 10,
      idPokemon: 25,
      tipo: 'electric',
      isFlipped: false,
    },
    leastFavorite: {
      nombre: 'Zubat',
      total: 1,
      idPokemon: 41,
      tipo: 'poison,flying',
      isFlipped: false,
    },
    allFavorites: [
      {
        pokemon: 'Pikachu',
        users: ['Ash', 'Misty', 'Brock'],
        idPokemon: 25,
        tipo: 'electric',
        isFlipped: false,
      },
      {
        pokemon: 'Charmander',
        users: ['Ash'],
        idPokemon: 4,
        tipo: 'fire',
        isFlipped: false,
      },{
        pokemon: 'Vulpix',
        users: ['Ash, Misty, Brock, James'],
        idPokemon: 4,
        tipo: 'fire',
        isFlipped: false,
      },
      {
        pokemon: 'Magnemite',
        users: ['Ash, Misty, Brock, James'],
        idPokemon: 4,
        tipo: 'electric',
        isFlipped: false,
      },
      {
        pokemon: 'Zapdos',
        users: ['Ash, Misty, Brock, James'],
        idPokemon: 4,
        tipo: 'electric',
        isFlipped: false,
      },
    ],
  };
  get mostFavoriteType() {
    const typeCounts: { [key: string]: number } = {};

    this.favoriteStats.allFavorites.forEach((fav) => {
      this.obtenerTipos(fav.tipo).forEach((t) => {
        typeCounts[t] = (typeCounts[t] || 0) + 1;
      });
    });

    const topType = Object.keys(typeCounts).reduce(
      (a, b) => (typeCounts[a] > typeCounts[b] ? a : b),
      'normal',
    );

    return {
      nombre: topType.toUpperCase(),
      cantidad: typeCounts[topType],
      color: this.getTypeColor(topType),
    };
  }

  getCardStyle(tipo: string): any {
    const tipos = this.obtenerTipos(tipo);
    if (tipos.length === 1) {
      return { background: this.getTypeColor(tipos[0]), transition: 'all 0.3s ease' };
    } else if (tipos.length >= 2) {
      return {
        background: `linear-gradient(135deg, ${this.getTypeColor(tipos[0])} 0%, ${this.getTypeColor(tipos[1])} 100%)`,
        transition: 'all 0.3s ease',
      };
    }
    return { background: '#A8A878' };
  }

  getTypeColor(tipo: string): string {
    return this.typeColors[tipo.toLowerCase()] || '#A8A878';
  }

  obtenerTipos(tipoString: string): string[] {
    return tipoString.split(',').map((t) => t.trim());
  }
}
