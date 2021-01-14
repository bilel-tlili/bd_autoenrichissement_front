import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { HistoriqueRoutingModule } from './historique-routing.module';

import { MesDemandesComponent } from './mesdemandes/mesdemandes.component';


const COMPONENTS = [MesDemandesComponent];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [SharedModule, HistoriqueRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class HistoriqueModule {}
