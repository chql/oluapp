import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { VacinasAddPage } from '../vacinas-add/vacinas-add';
import { VacinaProvider } from "../../providers/vacina/vacina";

@IonicPage()
@Component({
  selector: 'page-vacinas',
  templateUrl: 'vacinas.html',
})
export class VacinasPage {

  vacinas : Array<any> = [];

  monthsName : Array<string> = [];

  addPageResult : any = { vacinaInsert : false };

  constructor(public navCtrl: NavController, public navParams: NavParams, public translate : TranslateService, private dbVacina: VacinaProvider, private toast : ToastController) {
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

	this.getVacinas();
  }

  getVacinas() {
    return this.dbVacina.getAll().then(vacinas => {
		this.vacinas = vacinas;
		console.log(vacinas);
	});
  }

  attachmentName(uri) {
	  return uri.split('/').pop();
  }

  expandView(vacina) {
	  if(vacina.detail === undefined) {
		  vacina.detail = true;
	  }
	  else {
		  vacina.detail = !vacina.detail;
	  }
  }

  dateFormat(rawDate) {
	  let date = new Date(rawDate);
	  return date.getDate() + '/' + (date.getMonth()+1) + '/' + (date.getFullYear());
  }

  getDate(str) {
      return new Date(str);
  }

  ionViewDidEnter() {
	  if(this.addPageResult.vacinaInsert) {
		this.getVacinas().then(() => this.toast.create({ message: 'Vacina adicionada com sucesso', duration: 3000 }).present());
	  }
  }

  openAdd() {
	  this.navCtrl.push(VacinasAddPage, {result: this.addPageResult});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VacinasPage');
  }


}
