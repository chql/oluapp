import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { Vacina, VacinaProvider } from "../../providers/vacina/vacina";
import { DatabaseProvider } from "../../providers/database/database";

@IonicPage()
@Component({
  selector: 'page-vacinas-add',
  templateUrl: 'vacinas-add.html',
})
export class VacinasAddPage {
  vacinaNome : string = "";
  vacinaTipo : string = "";
  vacinaObservacao : string = "";
  vacinaData : string = (new Date()).toISOString();
  vacinaAnexos : Array<string> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private fileChooser : FileChooser, private db : DatabaseProvider) {
    this.db = db;
  }

  addAttachment() {
      this.fileChooser.open().then(uri => this.vacinaAnexos.push(uri));
  }

  submitSave() {
    let v = new Vacina();
    v.nome = this.vacinaNome;
    v.tipo = this.vacinaTipo;
    v.observacoes = this.vacinaObservacao;
    v.data = new Date(this.vacinaData);
    v.anexos = this.vacinaAnexos;
    let provider = new VacinaProvider(this.db);
    console.log(provider.insert(v));
  }

  cancelEditing() {
	  this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VacinasAddPage');
  }

}
