import { Component, Input } from '@angular/core';
import { Pokemon } from '../../Models/pokemon.mode';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-battle-pokemon',
  standalone: true, // ← Añadir esta línea
  imports: [TitleCasePipe],
  templateUrl: './battle-pokemon.component.html',
  styleUrl: './battle-pokemon.component.css'
})
export class BattlePokemonComponent {
  @Input() pokemon!: Pokemon;

  get hpPercentage() {
    return (this.pokemon.hp / this.pokemon.maxHp) * 100;
  }
}