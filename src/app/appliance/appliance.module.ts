import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppliancePageRoutingModule } from './appliance-routing.module';

import { AppliancePage } from './appliance.page';
import { FormatFileSizePipe } from 'src/providers/pipe/format-file-size.pipe';
import { FormatFileSizeModule } from '../format-file-size/format-file-size.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppliancePageRoutingModule, FormatFileSizeModule
  ],
  declarations: [AppliancePage]
})
export class AppliancePageModule {}
