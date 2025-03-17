import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { SelectedService } from '../../Services/selected.service';

@Component({
  selector: 'app-selected-pokemon',
  imports: [CommonModule, NgFor],
  templateUrl: './selected-pokemon.component.html',
  styleUrl: './selected-pokemon.component.css'
})
export class SelectedPokemonComponent {
  constructor(
    public selectedService: SelectedService,
    private router: Router
  ) { }

  startBattle(): void {
    if (this.selectedService.selectedCount === 2) {
      this.router.navigate(['/battle']);
    }
  }
}