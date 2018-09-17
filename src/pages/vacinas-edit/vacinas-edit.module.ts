import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VacinasEditPage } from './vacinas-edit';

@NgModule({
  declarations: [
    VacinasEditPage,
  ],
  imports: [
    IonicPageModule.forChild(VacinasEditPage),
  ],
})
export class VacinasEditPageModule {}
