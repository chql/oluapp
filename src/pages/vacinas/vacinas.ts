import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { VacinasAddPage } from '../vacinas-add/vacinas-add';

@IonicPage()
@Component({
  selector: 'page-vacinas',
  templateUrl: 'vacinas.html',
})
export class VacinasPage {

  vacinas : Array<any> = [];

  monthsName : Array<string> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public translate : TranslateService) {

	  this.vacinas = [
		  {
		    id: 1,
			nome: 'Penicilina',
			tipo: 'Antibiotica',
			observacao: 'Puta merda bixo!',
			data: new Date('2018-03-15'),
			anexos: []
		  },
		  {
			id: 2,
			nome: 'Morfina',
			tipo: 'Relaxante',
			observacao: 'Puta merda bixo!',
			data: new Date('2018-09-16'),
			anexos: []
		  },
		  {
			id: 3,
			nome: 'Morfina',
			tipo: 'Relaxante',
			observacao: 'Puta merda bixo!',
			data: new Date('2018-01-29'),
			anexos: []
	     }
	  ];

	translate.get([
		"MONTH_JAN",
		"MONTH_FEB",
		"MONTH_MAR",
		"MONTH_APR",
		"MONTH_MAY",
		"MONTH_JUN",
		"MONTH_JUL",
		"MONTH_AUG",
		"MONTH_SEP",
		"MONTH_OCT",
		"MONTH_NOV",
		"MONTH_DEC",
	]).subscribe((months) => {
		this.monthsName = [
			months.MONTH_JAN,
			months.MONTH_FEB,
			months.MONTH_MAR,
			months.MONTH_APR,
			months.MONTH_MAY,
			months.MONTH_JUN,
			months.MONTH_JUL,
			months.MONTH_AUG,
			months.MONTH_SEP,
			months.MONTH_OCT,
			months.MONTH_NOV,
			months.MONTH_DEC,
		];
	});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VacinasPage');
  }

  openAdd() {
	  this.navCtrl.push(VacinasAddPage);
  }

}
