import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController, Platform } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';
import {Vacina, VacinaProvider} from "../../providers/vacina/vacina";
import {DatabaseProvider} from "../../providers/database/database";

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
    let v = new Vacina();
    v.nome = this.vacina['nome'];
    v.tipo = this.vacina['tipo'];
    v.data = this.vacina['data'];
    v.observacoes = this.vacina['observacoes'];
    let save = new VacinaProvider(this.db);
    console.log(save.insert(v));
    console.log("chamou heim");
    console.log(this.vacina);
    console.log(save.getAll());
    console.log(save.get(2));
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