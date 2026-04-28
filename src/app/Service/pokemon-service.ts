import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, map, Observable } from 'rxjs';
import { Pokemon } from '../Interface/pokemonDTO';

export interface FavoritePayload {
  pokemonId: number;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  baseRuta: string =
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

  private pokemonsSubject = new BehaviorSubject<Pokemon[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private progressSubject = new BehaviorSubject<number>(0);

  private fetchStarted = false;

  private readonly STORAGE_KEY = 'pokemons_data';
  private readonly FAVORITES_KEY = 'pokemons_favorites';
  private readonly TOTAL_POKEMONS = 1025;

  public loading$ = this.loadingSubject.asObservable();
  public progress$ = this.progressSubject.asObservable();
  public pokemons$ = this.pokemonsSubject.asObservable();

  constructor(private http: HttpClient) {

    this.bootstrap();
  }

  private bootstrap(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    
    if (stored) {
      try {
        const pokemons: Pokemon[] = JSON.parse(stored);
        if (pokemons.length === this.TOTAL_POKEMONS) {
          const favs = this.getStoredFavorites();
          pokemons.forEach(p => {
            p.isFavorite = favs.has(p.id);
            p.isFlipped = false;
            p.selectedTab = 0;
          });
          this.pokemonsSubject.next(pokemons);
          this.progressSubject.next(100);
          console.log('[PokemonService] Pokémons cargados desde localStorage');
          return;
        }
      } catch (_) {
        console.warn('[PokemonService] Error parseando localStorage, se ignorará');
      }
    }


    this.loadAllPokemons();
  }

  clearCache(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.pokemonsSubject.next([]);
    this.fetchStarted = false;
  }

  getAllPokemons(): Observable<Pokemon[]> {
    if (!this.fetchStarted && this.pokemonsSubject.value.length < this.TOTAL_POKEMONS) {
      this.loadAllPokemons();
    }
    return this.pokemonsSubject.asObservable();
  }


  private loadAllPokemons(): void {
    if (this.fetchStarted) return;
    this.fetchStarted = true;

    this.loadingSubject.next(true);
    this.progressSubject.next(0);

    const BATCH_SIZE = 50;
    const batches: number[][] = [];
    for (let i = 1; i <= this.TOTAL_POKEMONS; i += BATCH_SIZE) {
      const batch: number[] = [];
      for (let j = i; j < i + BATCH_SIZE && j <= this.TOTAL_POKEMONS; j++) {
        batch.push(j);
      }
      batches.push(batch);
    }
    this.processBatches(batches, 0, new Map<number, Pokemon>());
  }

  private processBatches(
    batches: number[][],
    batchIndex: number,
    pokemonsMap: Map<number, Pokemon>
  ): void {
    if (batchIndex >= batches.length) {
      const pokemons = Array.from(pokemonsMap.values()).sort((a, b) => a.id - b.id);
      const favs = this.getStoredFavorites();
      pokemons.forEach(p => { p.isFavorite = favs.has(p.id); });

      this.pokemonsSubject.next(pokemons);
      this.loadingSubject.next(false);
      this.progressSubject.next(100);

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pokemons));
      console.log('[PokemonService] Todos los pokémons cargados y guardados');
      return;
    }

    const batch = batches[batchIndex];
    const requests = batch.map(id =>
      this.http.get<any>(`${this.apiUrl}/${id}`).pipe(map(data => this.mapToPokemon(data)))
    );

    forkJoin(requests).subscribe({
      next: (pokemons) => {
        pokemons.forEach(p => pokemonsMap.set(p.id, p));

        const progress = Math.round((pokemonsMap.size / this.TOTAL_POKEMONS) * 100);
        this.progressSubject.next(progress);

        const partial = Array.from(pokemonsMap.values()).sort((a, b) => a.id - b.id);
        this.pokemonsSubject.next(partial);

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(partial));

        setTimeout(() => {
          this.processBatches(batches, batchIndex + 1, pokemonsMap);
        }, 200);
      },
      error: (err) => {
        console.error('[PokemonService] Error en lote', batchIndex, err);
        this.loadingSubject.next(false);
        const partial = Array.from(pokemonsMap.values()).sort((a, b) => a.id - b.id);
        if (partial.length) this.pokemonsSubject.next(partial);
      }
    });
  }

  private mapToPokemon(data: any): Pokemon {
    return {
      id: data.id,
      nombre: data.name,
      tipo: data.types.map((t: any) => t.type.name).join(', '),
      imagen: `${this.baseRuta}${data.id}.png`,
      hp: this.getStat(data.stats, 'hp'),
      attack: this.getStat(data.stats, 'attack'),
      defense: this.getStat(data.stats, 'defense'),
      specialAttack: this.getStat(data.stats, 'special-attack'),
      specialDefense: this.getStat(data.stats, 'special-defense'),
      speed: this.getStat(data.stats, 'speed'),
      isFlipped: false,
      isFavorite: false,
      soundUrl: data.cries?.latest,
      moves: data.moves.slice(0, 5).map((m: any) => m.move.name),
      abilities: data.abilities.map((a: any) => a.ability.name),
      selectedTab: 0,
    };
  }

  private getStat(stats: any[], statName: string): number {
    return stats.find((s) => s.stat.name === statName)?.base_stat || 0;
  }


  private getStoredFavorites(): Set<number> {
    try {
      const raw = localStorage.getItem(this.FAVORITES_KEY);
      if (raw) return new Set<number>(JSON.parse(raw));
    } catch (_) { }
    return new Set<number>();
  }

  private persistFavorites(favs: Set<number>): void {
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(Array.from(favs)));
  }

  toggleFavorite(pokemon: Pokemon): void {
    pokemon.isFavorite = !pokemon.isFavorite;

    const favs = this.getStoredFavorites();
    if (pokemon.isFavorite) {
      favs.add(pokemon.id);
    } else {
      favs.delete(pokemon.id);
    }
    this.persistFavorites(favs);

    //mandar al backend 
  }




  forceReload(): void {
    this.clearCache();
    localStorage.removeItem(this.STORAGE_KEY);
    this.pokemonsSubject.next([]);
    this.fetchStarted = false;
    this.loadAllPokemons();
  }

  isDataComplete(): boolean {
    return this.pokemonsSubject.value.length === this.TOTAL_POKEMONS;
  }
}