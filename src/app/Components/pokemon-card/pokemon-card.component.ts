import { Component, Input, OnDestroy } from '@angular/core';
import { Pokemon } from '../../Models/pokemon.mode';
import { CommonModule, NgFor, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { SelectedService } from '../../Services/selected.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pokemon-card',
  imports: [CommonModule, NgFor, TitleCasePipe, UpperCasePipe],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.css'
})
export class PokemonCardComponent implements OnDestroy {
  @Input() pokemon!: Pokemon;
  isSelected = false;
  private subscription: Subscription;

  constructor(public selectedService: SelectedService) {
    this.subscription = this.selectedService.selected$.subscribe(selected => {
      this.isSelected = selected.some(p => p.id === this.pokemon.id);
    });
  }

  toggleSelection(): void {
    if (this.isSelected) {
      this.selectedService.removePokemon(this.pokemon);
    } else {
      if (this.selectedService.selectedCount < 2) {
        this.selectedService.addPokemon(this.pokemon);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}