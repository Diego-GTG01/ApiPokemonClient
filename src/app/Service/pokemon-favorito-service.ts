import { inject, Injectable } from '@angular/core';
import { Pokemon } from '../Interface/pokemonDTO';
import { map, Observable } from 'rxjs';
import { Result } from '../Interface/Result';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { PokemonApi } from '../Interface/pokemonApi';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class PokemonFavoritoService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private readonly pokeapi = 'https://pokeapi.co/api/v2/pokemon/';


  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  getPokemonFavorite(idUsuario: Number): Observable<Result<any[]>> {
    return this.http.get<Result<any[]>>(this.apiUrl + idUsuario);
  }
  addPokemonFavorite(idUsuario: Number, pokemon: PokemonApi): Observable<Result<any>> {
    this.httpOptions.headers.append(
      'Authorization: Bearer',
      'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGZvbnNvbWowMkBvdXRsb29rLmNvbSIsInJvbCI6Ik1hZXN0cm8iLCJpYXQiOjE3Nzc0OTk0MTcsImV4cCI6MTc3NzUwMzAxN30.gwe9Z-fVuEj3n_jmGIEm52F9h_WCA_4enmVXgyTl8rw',
    );
    return this.http.post<Result<any>>(`${this.apiUrl}/` + idUsuario, pokemon, this.httpOptions);
  }
  deletePokemonFavorite(
    idUsuario: Number,
    pokemon: PokemonApi,
  ): Observable<HttpResponse<Result<any>>> {
    return this.http.delete<Result<any>>(`${this.apiUrl}/` + idUsuario, {
      body: pokemon,
      observe: 'response',
    });
  }
  GetMostFavoritePokemon(): Observable<Result<any>> {
    return this.http.get<Result<any>>(this.apiUrl + '/usuario/pokeFavs/mostFavorite');
  }
  GetLeastFavoritePokemon(): Observable<Result<any>> {
    return this.http.get<Result<any>>(this.apiUrl + '/usuario/pokeFavs/leastFavorite');
  }
  GetAllFavoritePokemon(): Observable<Result<any[]>> {
    return this.http.get<Result<any[]>>(this.apiUrl + '/usuario/pokeFavs/allFavorites');
  }
  getTypesByPokemonId(id: number): Observable<string[]> {
    return this.http
      .get<any>(`${this.pokeapi}${id}`)
      .pipe(map((data) => data.types.map((t: any) => t.type.name)));
  }
}