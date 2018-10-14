import {Component} from '@angular/core';
import {IonicPage, MenuController, NavController, Platform} from 'ionic-angular';

import {TranslateService} from '@ngx-translate/core';
import {DatabaseProvider} from "../../providers/database/database";
import {Consulta, ConsultaProvider} from "../../providers/consulta/consulta";

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
    let c = new ConsultaProvider(this.db);
    let con = new Consulta();
    con.nome = "Nome da Consulta";
    con.especialidade = "especialidade da consulta";
    con.data = new Date();
    con.causa = "labirintite";
    con.preco = 12.52;
    con.exames = "fezes";
    con.retorno = new Date();
    con.observacoes = "obssssss";
    con.anexos = [];
    c.insert(con, -1);
    console.log(c.getAll().then((data) => console.log(data)));

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
