import { Component, OnInit } from '@angular/core';
import { BattleService } from '../../Services/battle.service';
import { SelectedService } from '../../Services/selected.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { BattleState, Move } from '../../Models/pokemon.mode';
import { MoveSelectorComponent } from '../move-selector/move-selector.component';
import { BattleLogComponent } from '../battle-log/battle-log.component';
import { BattlePokemonComponent } from '../battle-pokemon/battle-pokemon.component';

@Component({
  selector: 'app-battle',
  imports: [CommonModule, MoveSelectorComponent, BattleLogComponent, BattlePokemonComponent],
  templateUrl: './battle.component.html',
  styleUrl: './battle.component.css'
})
export class BattleComponent implements OnInit {
  battleState: BattleState | null = null;
  battleLog: string[] = [];
  isPlayerTurn: boolean = true;

  constructor(
    public battleService: BattleService,
    public selectedService: SelectedService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const selected = this.selectedService.getSelectedPokemons();
    if (selected.length === 2) {
      this.battleService.startBattle(selected);
      this.setupSubscriptions();
    } else {
      this.router.navigate(['/']);
    }
  }

  private setupSubscriptions(): void {
    this.battleService.battleState$.subscribe((state) => {
      this.battleState = state;
    });

    this.battleService.battleLog$.subscribe((log) => {
      this.battleLog = log;
    });

    this.battleService.isPlayerTurn$.subscribe((turn) => {
      this.isPlayerTurn = turn;
    });
  }

  useMove(move: Move): void {
    this.battleService.useMove(move);
  }

  returnToSelection(): void {
    this.battleService.resetBattle();
    this.selectedService.clearSelection();
    this.router.navigate(['/']);
  }
}