import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConsultasEditPage } from './consultas-edit';

@NgModule({
  declarations: [
    ConsultasEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ConsultasEditPage),
  ],
})
export class ConsultasEditPageModule {}
