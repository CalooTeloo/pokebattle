// src/app/components/battle/battle.component.ts
import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../../Models/pokemon.mode';
import { PokemonService } from '../../Services/pokemon.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { NotificationComponent } from '../notification/notification.component';


@Component({
  selector: 'app-battle',
  imports: [FormsModule, CommonModule, NgIf, NgFor, NotificationComponent, TitleCasePipe],
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss']
})
export class BattleComponent implements OnInit {
  pokemonList: any[] = [];
  selectedPokemon1: string = '';
  selectedPokemon2: string = '';
  player1!: Pokemon;
  player2!: Pokemon;
  currentAttacker!: Pokemon;
  currentDefender!: Pokemon;
  notificationMessage: string = '';
  battleStarted: boolean = false;
  isGameOver: boolean = false;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.loadPokemonList();
  }

  private loadPokemonList(): void {
    this.pokemonService.getPokemonList().subscribe({
      next: (list) => this.pokemonList = list,
      error: (err) => console.error('Error loading Pokémon list:', err)
    });
  }

  selectPokemon(player: number, pokemon: any): void {
    if (player === 1) this.selectedPokemon1 = pokemon.name;
    else this.selectedPokemon2 = pokemon.name;
  }

  startBattle(): void {
    if (this.selectedPokemon1 && this.selectedPokemon2) {
      this.pokemonService.getPokemon(this.selectedPokemon1).subscribe(p1 => {
        this.pokemonService.getPokemon(this.selectedPokemon2).subscribe(p2 => {
          this.initializePlayers(p1, p2);
          this.battleStarted = true;
          this.notificationMessage = `¡Comienza la batalla! ${p1.name} ataca primero.`;
        });
      });
    }
  }

  private initializePlayers(p1: Pokemon, p2: Pokemon): void {
    this.player1 = { ...p1, health: p1.maxHealth };
    this.player2 = { ...p2, health: p2.maxHealth };
    this.currentAttacker = this.player1;
    this.currentDefender = this.player2;
  }

  useAbility(attacker: Pokemon, defender: Pokemon, ability: any): void {
    if (this.isGameOver) return;

    const damage = this.calculateDamage(attacker, defender, ability);
    defender.health = Math.max(defender.health - damage, 0);

    this.notificationMessage = `${attacker.name} usó ${this.formatMoveName(ability.name)} (${damage} daño)!`;

    if (defender.health <= 0) {
      this.endBattle(attacker);
    } else {
      this.switchTurn();
    }
  }

  private calculateDamage(attacker: Pokemon, defender: Pokemon, ability: any): number {
    const level = 50;
    const attackStat = attacker.attack;
    const defenseStat = defender.defense;
    const power = ability.damage;

    const damage = Math.floor((((2 * level / 5 + 2) * attackStat * power) / defenseStat) / 50) + 2;
    return Math.max(damage, 1);
  }

  private switchTurn(): void {
    [this.currentAttacker, this.currentDefender] = [this.currentDefender, this.currentAttacker];
    this.notificationMessage += ` Turno de ${this.currentAttacker.name}.`;
  }

  private endBattle(winner: Pokemon): void {
    this.isGameOver = true;
    this.notificationMessage = `¡${winner.name} ha ganado el combate!`;
    setTimeout(() => this.resetGame(), 5000);
  }

  private resetGame(): void {
    this.battleStarted = false;
    this.selectedPokemon1 = '';
    this.selectedPokemon2 = '';
    this.isGameOver = false;
    this.notificationMessage = '';
  }

  formatMoveName(moveName: string): string {
    return moveName.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
}