import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Move } from '../../Models/pokemon.mode';
import { CommonModule, NgFor, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-move-selector',
  imports: [NgFor, CommonModule],
  templateUrl: './move-selector.component.html',
  styleUrl: './move-selector.component.css'
})
export class MoveSelectorComponent {
  @Input() moves!: Move[];
  @Input() isPlayerTurn: boolean = false;
  @Output() moveSelected = new EventEmitter<Move>();

  selectMove(move: Move): void {
    if (this.isPlayerTurn && move.pp > 0) {
      this.moveSelected.emit(move);
    }
  }
}