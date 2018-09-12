import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private fileChooser : FileChooser) {
  }

  addAttachment() {
      this.fileChooser.open().then(uri => this.vacinaAnexos.push(uri));
  }

  submitSave() {
    console.log(this.vacinaNome);
    console.log(this.vacinaTipo);
    console.log(this.vacinaObservacao);
    console.log(this.vacinaData);
    console.log(this.vacinaAnexos);
  }

  cancelEditing() {
	  this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VacinasAddPage');
  }

}
