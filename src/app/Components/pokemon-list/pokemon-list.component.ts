import { Component, OnInit } from '@angular/core';
import { PokeApiService } from '../../Services/poke-api.service';
import { Pokemon } from '../../Models/pokemon.mode';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { CommonModule, NgFor } from '@angular/common';
import { SelectedPokemonComponent } from '../selected-pokemon/selected-pokemon.component';

@Component({
  selector: 'app-pokemon-list',
  imports: [PokemonCardComponent, NgFor, CommonModule, SelectedPokemonComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.css'
})
export class PokemonListComponent implements OnInit {
  pokemons: Pokemon[] = [];

  constructor(private pokeApi: PokeApiService) { }

  ngOnInit(): void {
    this.pokeApi.getPokemons().subscribe({
      next: (data) => this.pokemons = data,
      error: (err) => console.error('Error:', err)
    });
  }
}