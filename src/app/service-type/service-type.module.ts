import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceTypePageRoutingModule } from './service-type-routing.module';

import { ServiceTypePage } from './service-type.page';


import { FormatFileSizeModule } from '../format-file-size/format-file-size.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceTypePageRoutingModule, FormatFileSizeModule
  ],
  declarations: [ServiceTypePage]
})
export class ServiceTypePageModule {}
