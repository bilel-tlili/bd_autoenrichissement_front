import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RoutesRoutingModule } from './routes-routing.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './sessions/login/login.component';
import { RegisterComponent } from './sessions/register/register.component';
import { MesDemandesComponent } from './mes-demandes/mes-demandes.component';
import { NouvelleDemandeComponent } from './nouvelle-demande/nouvelle-demande.component';

import { CreateUserComponent } from './create-user/create-user.component';


const COMPONENTS = [DashboardComponent, LoginComponent, RegisterComponent,NouvelleDemandeComponent,MesDemandesComponent];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [SharedModule, RoutesRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC, MesDemandesComponent, NouvelleDemandeComponent, CreateUserComponent],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class RoutesModule {}
