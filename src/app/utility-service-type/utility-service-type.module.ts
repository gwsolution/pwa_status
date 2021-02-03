import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UtilityServiceTypePageRoutingModule } from './utility-service-type-routing.module';

import { UtilityServiceTypePage } from './utility-service-type.page';
import { FormatFileSizeModule } from '../format-file-size/format-file-size.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UtilityServiceTypePageRoutingModule,FormatFileSizeModule
  ],
  declarations: [UtilityServiceTypePage]
})
export class UtilityServiceTypePageModule {}
