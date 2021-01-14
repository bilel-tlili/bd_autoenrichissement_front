import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MesDemandesComponent } from './mesdemandes/mesdemandes.component';


const routes: Routes = [
  { path: 'mesdemandes', component: MesDemandesComponent, data: { title: 'Mes demandes' } },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoriqueRoutingModule {}
