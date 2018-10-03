import {Component} from '@angular/core';
import {IonicPage, MenuController, NavController, Platform} from 'ionic-angular';

import {TranslateService} from '@ngx-translate/core';
import {DatabaseProvider} from "../../providers/database/database";
import {
  Medicamento,
  MedicamentoProvider,
  tarjaMedicamento,
  tipoMedicamento
} from "../../providers/medicamento/medicamento";

export interface Slide {
  title: string;
  description: string;
  image: string;
}

@IonicPage()
@Component({
  selector: 'page-testes',
  templateUrl: 'testes.html'
})
export class TestPage {
  slides: Slide[];
  showSkip = true;
  dir: string = 'ltr';
  vacina = {};

  constructor(public navCtrl: NavController, public menu: MenuController, translate: TranslateService, public platform: Platform, private db: DatabaseProvider) {
    this.dir = platform.dir();
    this.db = db;
  }

  save () {
    let m = new MedicamentoProvider(this.db);
    let med = new Medicamento();
    med.nome = "nome";
    med.alergico = false;
    med.causa = "causa";
    med.data_vencimento = new Date();
    //med.horario = new Date();
    med.periodo_inicio = new Date();
    med.periodo_fim = new Date();
    med.dosagem = "hiperdosagem";
    med.observacoes = "minhas obs";
    med.tarja = tarjaMedicamento.vermelha;
    med.tipo = tipoMedicamento.manipulado;
    med.anexos = [];
    console.log(m.search('XXX'));
  }
  /*
    onSlideChangeStart(slider) {
      this.showSkip = !slider.isEnd();
    }

    ionViewDidEnter() {
      // the root left menu should be disabled on the tutorial page
      this.menu.enable(true);
    }

    ionViewWillLeave() {
      // enable the root left menu when leaving the tutorial page
      this.menu.enable(true);
    }
  */
}
