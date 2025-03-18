import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        loadComponent: () => import('./Components/battle/battle.component').then(m => m.BattleComponent)
    },
];
