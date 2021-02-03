import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UtilityServiceTypePage } from './utility-service-type.page';

const routes: Routes = [
  {
    path: '',
    component: UtilityServiceTypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UtilityServiceTypePageRoutingModule {}
