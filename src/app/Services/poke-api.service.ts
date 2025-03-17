import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { Pokemon } from '../Models/pokemon.mode';

interface PokeListResponse {
  results: Array<{ name: string; url: string }>;
}

interface PokeDetailsResponse {
  id: number;
  name: string;
  types: Array<{ type: { name: string } }>;
  sprites: { other: { 'official-artwork': { front_default: string } } };
  stats: Array<{ base_stat: number }>;
  moves: Array<{ move: { url: string } }>;
}

interface MoveResponse {
  name: string;
  power: number;
  pp: number;
  type: { name: string };
  accuracy: number;
  damage_class: { name: string };
}

@Injectable({ providedIn: 'root' })
export class PokeApiService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) { }

  getPokemons(limit: number = 151): Observable<Pokemon[]> {
    return this.http.get<PokeListResponse>(`${this.apiUrl}?limit=${limit}`).pipe(
      map(response => response.results),
      switchMap(results => forkJoin(results.map((result, index) =>
        this.http.get<PokeDetailsResponse>(result.url).pipe(
          switchMap(details => {
            const moveRequests = details.moves
              .slice(0, 4)
              .map(m => this.http.get<MoveResponse>(m.move.url));

            return forkJoin(moveRequests).pipe(
              map(moves => this.mapPokemon(details, index + 1, moves))
            );
          })
        )
      )))
    );
  }

  private mapPokemon(details: PokeDetailsResponse, id: number, moves: MoveResponse[]): Pokemon {
    return {
      id: details.id || id,
      name: details.name,
      types: details.types.map(t => t.type.name),
      imageUrl: details.sprites.other['official-artwork'].front_default,
      hp: details.stats[0].base_stat,
      maxHp: details.stats[0].base_stat,
      stats: {
        attack: details.stats[1].base_stat,
        defense: details.stats[2].base_stat,
        speed: details.stats[5].base_stat
      },
      moves: moves.map(m => ({
        name: m.name.replace(/-/g, ' '),
        power: m.power || 60,
        type: m.type.name,
        pp: m.pp || 20,
        maxPp: m.pp || 20
      }))
    };
  }
}