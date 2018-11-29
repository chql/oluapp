import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController, Platform } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';
import { VacinasPage } from '../vacinas/vacinas';
import { MedicamentosPage } from '../medicamentos/medicamentos';
import { ConsultasPage } from "../consultas/consultas";
import { AlergiasPage } from "../alergias/alergias";
import { CirurgiasPage } from "../cirurgias/cirurgias";
import { ExamesPage } from "../exames/exames";

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public menu: MenuController, translate: TranslateService, public platform: Platform) {
    
  }

  openMedicamentos() {
      this.navCtrl.push(MedicamentosPage);
  }

  openVacinas() {
    this.navCtrl.push(VacinasPage);
  }

  openConsultas() {
    this.navCtrl.push(ConsultasPage);
  }

  openAlergias() {
    this.navCtrl.push(AlergiasPage);
  }

  openCirurgias() {
    this.navCtrl.push(CirurgiasPage);
  }

  openExames() {
    this.navCtrl.push(ExamesPage);
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

}
