import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        loadComponent: () => import('./Components/pokemon-list/pokemon-list.component').then(m => m.PokemonListComponent)
    },
    {
        path:'selected',
        loadComponent: () => import('./Components/selected-pokemon/selected-pokemon.component').then(m => m.SelectedPokemonComponent)
    },
    {
        path:'battle',
        loadComponent: () => import('./Components/battle/battle.component').then(m => m.BattleComponent)
    }
    
];
