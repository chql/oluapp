import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';

import { Vacina, VacinaProvider } from "../../providers/vacina/vacina";

@IonicPage()
@Component({
  selector: 'page-vacinas-edit',
  templateUrl: 'vacinas-edit.html',
})
/**
 * Componente especifico para alterar dados de vacinas individuais.
 * Permite adiciona novas vacinas e alterar vacinas ja existentes.
 */
export class VacinasEditPage {
  /**
   * Identificao da vacina sendo editada.
   * Nulo durante a adicao de nova vacina.
   */
  vacinaId : number = null;

  /**
   * Nome da vacina sendo modificada.
   */
  vacinaNome : string = "";

  /**
   * Tipo da vacina sendo modificada.
   */
  vacinaTipo : string = "";

  /**
   * Texto de observacoes da vacina.
   */
  vacinaObservacao : string = "";

  /**
   * Data de aplicacao da vacina.
   * Inicia com data atual na criacao de nova vacina.
   */
  vacinaData : string = (new Date(new Date().getTime() - new Date().getTimezoneOffset()*6000)).toISOString();

  /**
   * Anexos correspondentes a essa vacina.
   */
  vacinaAnexos : Array<any> = [];

  /**
   * Resultado retornado para tela de listagem.
   * Utilizado em caso de uma nova vacina ser adicionada ou alterada.
   */
  pageResult : any = { result: false, message: '' };

  /**
   *
   * @param navCtrl Para retornar ao finalizar edicao.
   * @param navParams Parametros de resultado da edicao.
   * @param fileChooser Dialogo para adicao de anexos.
   * @param dbVacina Acesso aos dados da vacina.
   * @param path Resolve caminho de anexos apos selecao do usuario.
   * @param alert Exibe mensagem em caso de campos insuficientes.
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alert : AlertController,
              private fileChooser : FileChooser,
              private dbVacina : VacinaProvider,
              private path : FilePath) {

    // recupera os parametros de navegacao
    this.vacinaId = this.navParams.get('itemId');
    this.pageResult = this.navParams.get('result');

    if(this.vacinaId) {
      // solicitado edicao de uma vacina ja existente
      this.dbVacina.get(this.vacinaId).then((vacina) => {
        this.vacinaId = vacina.id;
        this.vacinaNome = vacina.nome;
        this.vacinaTipo = vacina.tipo;
        this.vacinaObservacao = vacina.observacoes;
        this.vacinaData = vacina.data.toISOString();
        this.vacinaAnexos = vacina.anexos;
      });
    }
  }

  /**
   * Exibe dialogo para adicao de anexo.
   * Resolve caminho do anexo selecionado para armazenamento.
   */
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

  /**
   * Verifica e notifica sobre campos obrigatorios.
   */
  formValidate() {
    let hasError : boolean = false;
    let message  : string = '';

    /* if(this.vacinaTipo.length < 1) {
      hasError = true;
      message = 'Preencha o tipo da vacina';
    }*/

    if(this.vacinaNome.length < 1) {
      hasError = true;
      message = 'Preencha o nome da vacina';
    }

    if(hasError) {
      this.alert.create({
        title: 'Erro',
        subTitle: message,
        buttons: ['OK']
      }).present();
    }

    return !hasError;
  }

  /**
   * Salva os dados da vacina que foi adicionada ou modificada.
   * Preenche o resultado da adicao/modificacao e retorna para tela anterior.
   */
  submitSave() {
    if(!this.formValidate()) {
      return;
    }

    let novaVacina = new Vacina();

    novaVacina.nome        = this.vacinaNome;
    novaVacina.tipo        = this.vacinaTipo;
    novaVacina.observacoes = this.vacinaObservacao;
    novaVacina.data        = new Date(this.vacinaData);
    novaVacina.anexos      = this.vacinaAnexos;

    if(this.vacinaId) {
      this.dbVacina.save(novaVacina, this.vacinaId).then((result) => {
        if(result > 0){
          this.pageResult.result = true;
          this.pageResult.message = 'Vacina alterada com sucesso!';
          this.navCtrl.pop();
        }
        else {
          alert("Já existe vacina com este nome nesta data.");
        }
      });
    }
    else {
      this.dbVacina.insert(novaVacina, -1).then((result) => {
        if(result > 0){
          this.pageResult.result = true;
          this.pageResult.message = 'Vacina adicionada com sucesso!';
          this.navCtrl.pop();
        }
        else {
          alert("Já existe vacina com este nome nesta data.");
        }
      });
    }
  }

  /**
   * Remove um anexo da lista de anexos.
   * @param uri
   */
  removeAttachment(uri : string) {
	  let idx = this.vacinaAnexos.indexOf(uri);
	  console.log('Trying to remove attachament ' + uri + ' at idx ' + idx);
	  if(idx != -1) {
		  this.vacinaAnexos.splice(idx, 1);
	  }
  }

  /**
   * Resolve o nome de um anexo.
   * @param uri
   */
  attachmentName(uri : string) {
	  return uri.split('/').pop();
  }

  /**
   * Cancela modificacoes pendentes e retorna para tela anterior.
   */
  cancelEditing() {
	  this.navCtrl.pop();
  }

}
