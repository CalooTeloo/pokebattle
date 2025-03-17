import { CommonModule, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { BattleService } from '../../Services/battle.service';

@Component({
  selector: 'app-battle-log',
  imports: [NgFor, CommonModule],
  templateUrl: './battle-log.component.html',
  styleUrl: './battle-log.component.css'
})
export class BattleLogComponent {
  @Input() log: string[] = [];
}