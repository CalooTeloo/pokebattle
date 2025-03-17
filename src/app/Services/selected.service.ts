import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pokemon } from '../Models/pokemon.mode';

@Injectable({ providedIn: 'root' })
export class SelectedService {
  private selectedSubject = new BehaviorSubject<Pokemon[]>([]);
  selected$ = this.selectedSubject.asObservable();

  get selectedCount(): number {
    return this.selectedSubject.value.length;
  }

  getSelectedPokemons(): Pokemon[] {
    return [...this.selectedSubject.value];
  }

  addPokemon(pokemon: Pokemon): void {
    const current = this.selectedSubject.value;
    if (current.length < 2 && !current.some(p => p.id === pokemon.id)) {
      this.selectedSubject.next([...current, pokemon]);
    }
  }

  removePokemon(pokemon: Pokemon): void {
    const updated = this.selectedSubject.value.filter(p => p.id !== pokemon.id);
    this.selectedSubject.next(updated);
  }

  clearSelection(): void {
    this.selectedSubject.next([]);
  }
}