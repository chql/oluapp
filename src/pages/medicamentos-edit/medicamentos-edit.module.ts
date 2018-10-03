import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicamentosEditPage } from './medicamentos-edit';

@NgModule({
  declarations: [
    MedicamentosEditPage,
  ],
  imports: [
    IonicPageModule.forChild(MedicamentosEditPage),
  ],
})
export class MedicamentosEditPageModule {}
