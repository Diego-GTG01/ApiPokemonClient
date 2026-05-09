import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Pokemon } from '../../Interface/pokemonDTO';
import { PokemonFavoritoService } from '../../Service/pokemon-favorito-service';
import { forkJoin, map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estadisticas-poke-fav',
  imports: [CommonModule],
  templateUrl: './estadisticas-poke-fav.html',
  styleUrl: './estadisticas-poke-fav.css',
})
export class EstadisticasPokeFav {
  constructor(private pokemonFavoritoService: PokemonFavoritoService,
    private router: Router
  ) {
    this.pokemonFavoritoService.GetMostFavoritePokemon().subscribe({
      next: (res) => {
        this.favoriteStats.mostFavorite.nombre = res.object[0];
        this.favoriteStats.mostFavorite.idPokemon = res.object[1];
        this.favoriteStats.mostFavorite.total = res.object[2];
        this.favoriteStats.mostFavorite.tipo = 'normal';
      },
      error: (erro) => {
        this.favoriteStats.mostFavorite.nombre = 'Pokemon no encontrado';
        this.favoriteStats.mostFavorite.idPokemon = 0;
        this.favoriteStats.mostFavorite.total = 0;
        this.favoriteStats.mostFavorite.tipo = 'normal';
      },
    });
    this.pokemonFavoritoService.GetLeastFavoritePokemon().subscribe({
      next: (res) => {
        this.favoriteStats.leastFavorite.nombre = res.object[0];
        this.favoriteStats.leastFavorite.idPokemon = res.object[1];
        this.favoriteStats.leastFavorite.total = res.object[2];
        this.favoriteStats.leastFavorite.tipo = 'normal';
      },
      error: (erro) => {
        this.favoriteStats.leastFavorite.nombre = 'Pokemon no encontrado';
        this.favoriteStats.leastFavorite.idPokemon = 0;
        this.favoriteStats.leastFavorite.total = 0;
        this.favoriteStats.leastFavorite.tipo = 'normal';
      },
    });
    this.pokemonFavoritoService.GetAllFavoritePokemon().subscribe({
      next: (res) => {

        const requests = res.objects.map((obj: any) => {

          const idPokemon = obj[0];

          return this.pokemonFavoritoService
            .getTypesByPokemonId(idPokemon)
            .pipe(
              map((tipoRes: String[]) => {

                let tipos ="";
                tipoRes.forEach((t, index) => { 
                  console.log(index);
                  if(index==1){
                    tipos= tipos +",";
                  }
                  tipos = tipos + t;
                 });

                return {
                  pokemon: obj[1],
                  idPokemon: idPokemon,
                  tipo: tipos,
                  users: obj[2]
                    .split(',')
                    .map((u: string) => u.trim()),
                  isFlipped: false,
                };
              })
            );
        });

        forkJoin(requests).subscribe({
          next: (resultadoFinal) => {
            this.favoriteStats.allFavorites = resultadoFinal;
            console.log(resultadoFinal);
          },
          error: (error) => {
            console.error('Error obteniendo tipos:', error);
            this.favoriteStats.allFavorites = [];
          },
        });
      },

      error: () => {
        this.favoriteStats.allFavorites = [];
      },
    });
  
    
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
      nombre: '',
      total: 0,
      idPokemon: 0,
      tipo: '',
      isFlipped: false,
    },
    leastFavorite: {
      nombre: '',
      total: 0,
      idPokemon: 0,
      tipo: '',
      isFlipped: false,
    },
    allFavorites: [
      {
        pokemon: '',
        users: [''],
        idPokemon: 0,
        tipo: '',
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

  volver(): void {
    this.router.navigate(['/main']);
  }
}
