import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExamesEditPage } from './exames-edit';

@NgModule({
  declarations: [
    ExamesEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ExamesEditPage),
  ]
})
export class ExamesEditPageModule {}
