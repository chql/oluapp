import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VacinasAddPage } from './vacinas-add';

@NgModule({
  declarations: [
    VacinasAddPage,
  ],
  imports: [
    IonicPageModule.forChild(VacinasAddPage),
  ],
})
export class VacinasAddPageModule {}
