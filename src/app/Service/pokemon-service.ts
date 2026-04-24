import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Pokemon } from '../Interface/pokemonDTO';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  baseRuta: string =
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

  constructor(private http: HttpClient) {}

  getPokemon(id: Number): Observable<Pokemon> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((data) => ({
        id: data.id,
        nombre: data.name,
        tipo: data.types.map((t: any) => t.type.name).join(', '),
        imagen: `${this.baseRuta}${id}.png`,
        hp: this.getStat(data.stats, 'hp'),
        attack: this.getStat(data.stats, 'attack'),
        defense: this.getStat(data.stats, 'defense'),
        specialAttack: this.getStat(data.stats, 'special-attack'),
        specialDefense: this.getStat(data.stats, 'special-defense'),
        speed: this.getStat(data.stats, 'speed'),

        isFlipped: false,

        soundUrl: data.cries?.latest,
        moves: data.moves.slice(0, 5).map((m: any) => m.move.name),

        abilities: data.abilities.map((a: any) => a.ability.name),

        selectedTab: 0,
      })),
    );
  }

  private getStat(stats: any[], statName: string): number {
    return stats.find((s) => s.stat.name === statName)?.base_stat || 0;
  }
}
