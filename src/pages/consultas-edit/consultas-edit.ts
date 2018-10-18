import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ConsultaProvider, Consulta } from "../../providers/consulta/consulta";
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';


@IonicPage()
@Component({
  selector: 'page-consultas-edit',
  templateUrl: 'consultas-edit.html',
})
export class ConsultasEditPage {

  /**
   * Nome para a consulta.
   */
  consultaNome : string = '';

  /**
   * Area de especialidade da consulta.
   */
  consultaEspecialidade : string = '';

  /**
   * Data em que a consulta ocorreu.
   */
  consultaData : string = (new Date()).toISOString();

  /**
   * Motivos para a consulta.
   */
  consultaCausa : string = '';

  /**
   * Valor pago pela consulta.
   */
  consultaPreco : number = 0;

  /**
   * Exames solicitados antes ou depois da consulta.
   */
  consultaExames : string = '';

  /**
   * Prazo de retorno apos a consulta.
   */
  consultaRetorno : string = (new Date()).toISOString();

  /**
   * Data maxima para intervalo de retorno.
   */
  retornoMaxDate : string = ((new Date()).getFullYear()+10).toString();

  /**
   * Observacoes.
   */
  consultaObservacoes : string = '';

  /**
   * Anexos da consulta.
   */
  consultaAnexos : Array<any> = [];

  /**
   * Id da consulta sendo editada.
   */
  consultaId : number = null;

  /**
   * Resultado retornado para tela de listagem.
   */
  pageResult : any = { result: false, message: '' };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private dbConsulta : ConsultaProvider,
              private fileChooser : FileChooser,
              private path : FilePath,
              private alert : AlertController) {

    this.consultaId = this.navParams.get('consultaId');
    this.pageResult = this.navParams.get('result');

    if(this.consultaId) {
      this.dbConsulta.get(this.consultaId).then(consulta => {
        this.consultaNome          = consulta.nome;
        this.consultaEspecialidade = consulta.especialidade;
        this.consultaData          = consulta.data.toISOString();
        this.consultaCausa         = consulta.causa;
        this.consultaPreco         = consulta.preco;
        this.consultaExames        = consulta.exames;
        this.consultaRetorno       = consulta.retorno.toISOString();
        this.consultaObservacoes   = consulta.observacoes;
        this.consultaAnexos        = consulta.anexos;
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
          let a = {
            caminho: p,
            nome: p.split('/').pop()
          };
          this.consultaAnexos.push(a);
        });
      }
    );
  }

  /**
   * Resolve o nome de um anexo.
   * @param uri
   */
  attachmentName(uri : string) {
    return uri.split('/').pop();
  }

  /**
   * Remove um anexo da lista de anexos.
   * @param uri
   */
  removeAttachment(uri : string) {
    let idx = this.consultaAnexos.indexOf(uri);
    console.log('Trying to remove attachament ' + uri + ' at idx ' + idx);
    if(idx != -1) {
      this.consultaAnexos.splice(idx, 1);
    }
  }

  /**
   * Verifica e notifica sobre campos obrigatorios.
   */
  formValidate() {
    let hasError : boolean = false;
    let message  : string = '';

    if(this.consultaNome.length < 1) {
      hasError = true;
      message = 'Escolha um nome para a consulta';
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
   * Salva os dados da consulta que foi adicionada ou modificada.
   * Preenche o resultado da adicao/modificacao e retorna para tela anterior.
   */
  submitSave() {
    if(!this.formValidate()) {
      return;
    }

    let novaConsulta = new Consulta();

    novaConsulta.nome = this.consultaNome;
    novaConsulta.especialidade = this.consultaEspecialidade;
    novaConsulta.data = new Date(this.consultaData);
    novaConsulta.causa = this.consultaCausa;
    novaConsulta.preco = this.consultaPreco;
    novaConsulta.exames = this.consultaExames;
    novaConsulta.retorno = new Date(this.consultaRetorno);
    novaConsulta.observacoes = this.consultaObservacoes;
    novaConsulta.anexos = this.consultaAnexos;

    if(this.consultaId) {
      this.dbConsulta.save(novaConsulta, this.consultaId).then((result) => {
        if(result > 0){
          this.pageResult.result = true;
          this.pageResult.message = 'Consulta alterada com sucesso!';
          this.navCtrl.pop();
        }
        else {
          alert("Já existe uma consulta com mesmo nome na mesma data.");
        }
      });
    }
    else {
      this.dbConsulta.insert(novaConsulta, -1).then((result) => {
        if(result > 0) {
          this.pageResult.result = true;
          this.pageResult.message = 'Consulta adicionada com sucesso!';
          this.navCtrl.pop();
        }
        else {
          alert("Já existe uma consulta com mesmo nome na mesma data.");
        }
      });
    }
  }

  /**
   * Cancela modificacoes pendentes e retorna para tela anterior.
   */
  cancelEditing() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConsultasEditPage');
  }
}
