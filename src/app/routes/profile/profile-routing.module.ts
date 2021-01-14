import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileLayoutComponent } from './profile-layout/profile-layout.component';

import {SettingsComponent } from './settings/settings.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileLayoutComponent,
    children: [
      { path: '', redirectTo: 'change-password', pathMatch: 'full' },
      {
        path: 'overview',
        component: OverviewComponent,
        data: { title: 'Overview Profile' },
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: { title: 'Profile Settings' },
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        data: { title: 'Password Update' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
