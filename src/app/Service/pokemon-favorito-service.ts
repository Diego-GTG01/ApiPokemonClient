import { inject, Injectable } from '@angular/core';
import { Pokemon } from '../Interface/pokemonDTO';
import { Observable } from 'rxjs';
import { Result } from '../Interface/Result';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { PokemonApi } from '../Interface/pokemonApi';

@Injectable({
  providedIn: 'root',
})
export class PokemonFavoritoService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://127.0.0.1:8080/usuario/pokeFavs/';

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
    return this.http.post<Result<any>>(this.apiUrl + idUsuario, pokemon, this.httpOptions);
  }
  deletePokemonFavorite(
    idUsuario: Number,
    pokemon: PokemonApi,
  ): Observable<HttpResponse<Result<any>>> {
    return this.http.delete<Result<any>>(this.apiUrl + idUsuario, {
      body: pokemon,
      observe: 'response',
    });
  }
  GetMostFavoritePokemon(): Observable<Result<any>> {
    return this.http.get<Result<any>>(this.apiUrl + 'mostFavorite');
  }
  GetLeastFavoritePokemon(): Observable<Result<any>> {
    return this.http.get<Result<any>>(this.apiUrl + 'leastFavorite');
  }
  GetAllFavoritePokemon(): Observable<Result<any[]>> {
    return this.http.get<Result<any[]>>(this.apiUrl + 'allFavorites');
  }

}
