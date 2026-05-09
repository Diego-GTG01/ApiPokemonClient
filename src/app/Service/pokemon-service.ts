import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, map, Observable } from 'rxjs';
import { Pokemon } from '../Interface/pokemonDTO';
import { PokemonApi } from '../Interface/pokemonApi';
import { PokemonFavoritoService } from './pokemon-favorito-service';
import { Result } from '../Interface/Result';

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
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon-species';
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

  favoriteIds: Set<number>[] = [];

  constructor(
    private http: HttpClient,
    private pokemonFavoritoService: PokemonFavoritoService,
  ) {
    this.start();
  }

  private start(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);

    if (stored) {
      try {
        const pokemons: Pokemon[] = JSON.parse(stored);
        if (pokemons.length === this.TOTAL_POKEMONS) {
          this.getStoredFavorites().subscribe((favoriteIds) => {
            pokemons.forEach((p) => {
              favoriteIds.forEach((pokeFav) => {
                if (p.id === pokeFav) {
                  p.isFavorite = true;
                }
              });
              p.isFlipped = false;
              p.selectedTab = 0;
            });
          });

          this.pokemonsSubject.next(pokemons);
          this.progressSubject.next(100);
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
    pokemonsMap: Map<number, Pokemon>,
  ): void {
    if (batchIndex >= batches.length) {
      const pokemons = Array.from(pokemonsMap.values()).sort((a, b) => a.id - b.id);
      this.getStoredFavorites().subscribe((favoriteIds) => {
        pokemons.forEach((p) => {
          favoriteIds.forEach((pokeFav) => {
            if (p.id === pokeFav) {
              p.isFavorite = true;
            }
          });
          this.getFlavorText(p.id).subscribe((flavorTexts) => {
            p.description = flavorTexts[0];
          });
          p.isFlipped = false;
          p.selectedTab = 0;
        });
      });

      this.pokemonsSubject.next(pokemons);
      this.loadingSubject.next(false);
      this.progressSubject.next(100);

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pokemons));
      return;
    }

    const batch = batches[batchIndex];
    const requests = batch.map((id) =>
      this.http.get<any>(`${this.apiUrl}/${id}`).pipe(map((data) => this.mapToPokemon(data))),
    );

    forkJoin(requests).subscribe({
      next: (pokemons) => {
        pokemons.forEach((p) => pokemonsMap.set(p.id, p));

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
        this.loadingSubject.next(false);

        const partial = Array.from(pokemonsMap.values()).sort((a, b) => a.id - b.id);
        if (partial.length) this.pokemonsSubject.next(partial);
      },
    });
  }

  private mapToDTO(pokemon: Pokemon): PokemonApi {
    return {
      idPokemon: pokemon?.id,
      name: pokemon?.nombre,
    };
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
      soundUrl: data.cries?.latest || data.cries?.legacy || null,
      moves: data.moves.slice(0, 5).map((m: any) => m.move.name),
      abilities: data.abilities.map((a: any) => a.ability.name),
      selectedTab: 0,
    };
  }

  private getStat(stats: any[], statName: string): number {
    return stats.find((s) => s.stat.name === statName)?.base_stat || 0;
  }

  private getStoredFavorites(): Observable<Set<number>> {
    return this.pokemonFavoritoService.getPokemonFavorite(21).pipe(
      map((res: Result<any>) => {
        const favSet = new Set<number>();

        if (!res?.object || !Array.isArray(res.object)) {
          return favSet;
        }

        res.object.forEach((p) => {
          const id = p?.idPokemon ?? p?.pokemonId ?? p?.id ?? p?.pokemon?.idPokemon;

          const parsed = Number(id);

          if (!Number.isNaN(parsed)) {
            favSet.add(parsed);
          }
        });
        return favSet;
      }),
    );
  }

  private persistFavorites(favs: Set<number>): void {
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(Array.from(favs)));
  }

  toggleFavorite(pokemon: Pokemon): void {
    this.getStoredFavorites().subscribe((favoriteIds) => {
      if (!pokemon.isFavorite) {
        this.pokemonFavoritoService
          .addPokemonFavorite(21, this.mapToDTO(pokemon))
          .subscribe((resultado) => {
            if (resultado.correct) {
              pokemon.isFavorite = !pokemon.isFavorite;
            }
          });
        favoriteIds.add(pokemon.id);
      } else {
        this.pokemonFavoritoService
          .deletePokemonFavorite(21, this.mapToDTO(pokemon))
          .subscribe((response) => {
            if (response.status == 204) {
              pokemon.isFavorite = !pokemon.isFavorite;
            }
          });
        favoriteIds.delete(pokemon.id);
      }

      this.persistFavorites(favoriteIds);
    });
  }

  forceReload(): void {
    this.clearCache();
    localStorage.removeItem(this.STORAGE_KEY);
    this.pokemonsSubject.next([]);
    this.fetchStarted = false;
    this.loadAllPokemons();
  }
  getFlavorText(id: number | string): Observable<string[]> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map((res) => {
        let entries = res.flavor_text_entries.filter((entry: any) => entry.language.name === 'es');
        if (entries.length === 0) {
          entries = res.flavor_text_entries.filter((entry: any) => entry.language.name === 'en');
        }

        return entries.map((entry: any) => entry.flavor_text);
      }),
    );
  }

  isDataComplete(): boolean {
    return this.pokemonsSubject.value.length === this.TOTAL_POKEMONS;
  }
}
