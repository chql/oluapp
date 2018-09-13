import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { Vacina, VacinaProvider } from "../../providers/vacina/vacina";
import { FilePath } from '@ionic-native/file-path';

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
  vacinaAnexos : Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private fileChooser : FileChooser, private dbVacina : VacinaProvider, private path : FilePath) {
  }

  addAttachment() {
      this.fileChooser.open().then(uri => {
        this.path.resolveNativePath(uri).then(p => {
          console.log('Resolved attachment path to ' + p);
          let a = {
            caminho: p,
            nome: p.split('/').pop()
          };
          this.vacinaAnexos.push(a);
        });
        }
      );
  }

  submitSave() {
	let novaVacina = new Vacina();

	novaVacina.nome        = this.vacinaNome;
	novaVacina.tipo        = this.vacinaTipo;
	novaVacina.observacoes = this.vacinaObservacao;
	novaVacina.data        = new Date(this.vacinaData);
	novaVacina.anexos      = this.vacinaAnexos;

    this.dbVacina.insert(novaVacina)
		.then(() => {
			this.navParams.get('result').vacinaInsert = true;
			this.navCtrl.pop();
		});
  }

  removeAttachment(uri) {
	  let idx = this.vacinaAnexos.indexOf(uri);
	  console.log('Trying to remove attachament ' + uri + ' at idx ' + idx);
	  if(idx != -1) {
		  this.vacinaAnexos.splice(idx, 1);
	  }
  }

  attachmentName(uri) {
	  return uri.split('/').pop();
  }

  cancelEditing() {
	  this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VacinasAddPage');
  }

}
