import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SelectedService } from './selected.service';
import { Router } from '@angular/router';
import { Move, Pokemon } from '../Models/pokemon.mode';

interface BattleState {
  player: Pokemon;
  enemy: Pokemon;
}

@Injectable({ providedIn: 'root' })
export class BattleService {
  private playerPokemon!: Pokemon;
  private enemyPokemon!: Pokemon;
  private battleLog = new BehaviorSubject<string[]>([]);
  private isPlayerTurn = new BehaviorSubject<boolean>(true);
  public battleState$ = new BehaviorSubject<BattleState | null>(null);

  battleLog$ = this.battleLog.asObservable();
  isPlayerTurn$ = this.isPlayerTurn.asObservable();

  constructor(
    private selectedService: SelectedService,
    private router: Router
  ) { }

  startBattle(pokemons: Pokemon[]): void {
    this.playerPokemon = { ...pokemons[0], hp: pokemons[0].maxHp };
    this.enemyPokemon = { ...pokemons[1], hp: pokemons[1].maxHp };
    this.updateBattleState();
    this.battleLog.next([`¡Comienza el combate! ${this.playerPokemon.name} vs ${this.enemyPokemon.name}`]);
  }

  // Actualizar el estado en cada cambio
  private updateBattleState(): void {
    this.battleState$.next({
      player: { ...this.playerPokemon },
      enemy: { ...this.enemyPokemon }
    });
  }

  getBattleState(): Observable<BattleState | null> {
    return this.battleState$.asObservable();
  }


  useMove(move: Move): void {
    if (!this.isPlayerTurn.value || move.pp <= 0) return;

    // Reducir PP
    move.pp--;

    // Calcular daño
    const damage = this.calculateDamage(move, this.playerPokemon, this.enemyPokemon);

    // Aplicar daño
    this.enemyPokemon.hp = Math.max(0, this.enemyPokemon.hp - damage);

    // Actualizar log
    this.updateLog(`${this.playerPokemon.name} usó ${move.name}! (-${damage} HP)`);

    // Verificar si el enemigo fue derrotado
    if (this.enemyPokemon.hp === 0) {
      this.endBattle(true);
      return;
    }

    // Cambiar turno
    this.isPlayerTurn.next(false);
    setTimeout(() => this.enemyTurn(), 1500);
    this.updateBattleState(); // Añadir esta línea

  }

  private enemyTurn(): void {
    const availableMoves = this.enemyPokemon.moves.filter(m => m.pp > 0);

    if (availableMoves.length === 0) {
      this.updateLog(`${this.enemyPokemon.name} no puede atacar!`);
      return;
    }

    const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    move.pp--;
    const damage = this.calculateDamage(move, this.enemyPokemon, this.playerPokemon);

    this.playerPokemon.hp = Math.max(0, this.playerPokemon.hp - damage);
    this.updateLog(`${this.enemyPokemon.name} usó ${move.name}! (-${damage} HP)`);

    if (this.playerPokemon.hp === 0) {
      this.endBattle(false);
      return;
    }

    this.isPlayerTurn.next(true);
    this.updateBattleState(); // Añadir esta línea
  }

  private calculateDamage(move: Move, attacker: Pokemon, defender: Pokemon): number {
    const attackStat = attacker.stats.attack;
    const defenseStat = defender.stats.defense;
    const baseDamage = ((2 * attackStat * move.power) / defenseStat) / 50 + 2;
    const modifier = Math.random() * 0.15 + 0.85;
    return Math.floor(baseDamage * modifier);
  }

  private endBattle(playerWon: boolean): void {
    this.updateLog(playerWon ? '¡Has ganado el combate!' : '¡Has perdido el combate!');
    this.isPlayerTurn.next(false);
  }

  private updateLog(message: string): void {
    const currentLog = this.battleLog.value;
    this.battleLog.next([...currentLog.slice(-9), message]);
  }

  resetBattle(): void {
    this.playerPokemon = null!;
    this.enemyPokemon = null!;
    this.battleLog.next([]);
    this.isPlayerTurn.next(true);
  }
}