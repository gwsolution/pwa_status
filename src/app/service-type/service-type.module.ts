import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceTypePageRoutingModule } from './service-type-routing.module';

import { ServiceTypePage } from './service-type.page';
import { FormatFileSizePipe } from 'src/providers/pipe/format-file-size.pipe';
import { FormatFileSizePipe2 } from 'src/providers/pipe/format-file-size2.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceTypePageRoutingModule
  ],
  declarations: [ServiceTypePage,FormatFileSizePipe2]
})
export class ServiceTypePageModule {}
