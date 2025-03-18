// pokemon.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) { }

  getPokemonList(limit: number = 151): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}?limit=${limit}`).pipe(
      map(response => response.results.map((pokemon: any, index: number) => ({
        name: pokemon.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`
      })))
    );
  }

  getPokemon(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${name}`).pipe(
      switchMap(data => {
        const hpStat = data.stats.find((s: any) => s.stat.name === 'hp').base_stat;
        const moves = data.moves.slice(0, 4); // Tomamos primeros 4 movimientos

        const moveRequests = moves.map((move: any) =>
          this.http.get<any>(move.move.url).pipe(
            map(moveData => ({
              name: moveData.name,
              damage: moveData.power || this.getDefaultDamage(moveData.damage_class.name)
            }))
          )
        );

        return forkJoin(moveRequests).pipe(
          map(abilities => ({
            id: data.id,
            name: data.name,
            health: hpStat,
            maxHealth: hpStat,
            attack: data.stats.find((s: any) => s.stat.name === 'attack').base_stat,
            defense: data.stats.find((s: any) => s.stat.name === 'defense').base_stat,
            abilities: abilities,
            image: data.sprites.other['official-artwork'].front_default
          }))
        );
      })
    );
  }

  private getDefaultDamage(damageClass: string): number {
    const damageClasses: { [key: string]: number } = {
      'physical': 40,
      'special': 50,
      'status': 20
    };
    return damageClasses[damageClass] || 30;
  }
}