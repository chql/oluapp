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
    let v = new VacinaProvider(this.db);
    v.search(this.vacina['nome']).then((d) => {
      console.log(d);
    });
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
