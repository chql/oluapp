import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CirurgiaProvider, Cirurgia } from "../../providers/cirurgia/cirurgia";
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';

@IonicPage()
@Component({
  selector: 'page-cirurgias-edit',
  templateUrl: 'cirurgias-edit.html',
})
export class CirurgiasEditPage {

  /**
   * Nome que descreve a cirurgia.
   */
  cirurgiaNome : string = '';

  /**
   * Texto que descreve o tipo da cirurgia.
   */
  cirurgiaTipo : string = '';

  /**
   * Data para qual esta marcada a cirurgia.
   */
  cirurgiaData : string = (new Date()).toISOString();

  /**
   * Data maxima para cirurgia.
   */
  cirurgiaMaxDate : string = ((new Date()).getFullYear()+10).toString();

  /**
   * Anestesia aplicada durante a cirurgia.
   */
  cirurgiaAnestesia : string = '';

  /**
   * Motivo/necessidade para cirurgia.
   */
  cirurgiaMotivo : string = '';

  /**
   * Area de especialidade da cirurgia.
   */
  cirurgiaEspecialidade : string = '';

  /**
   * Nome do medico responsavel pela cirurgia.
   */
  cirurgiaMedico : string = '';

  /**
   * Local do corpo sujeito a cirurgia.
   */
  cirurgiaLocal : string = '';

  /**
   * Observacoes adicionais do procedimento.
   */
  cirurgiaObservacoes : string = '';

  /**
   * Documentos anexos relacionados a cirurgia.
   */
  cirurgiaAnexos : Array<any> = [];

  /**
   * Id da cirurgia sendo editada.
   */
  cirurgiaId : number = null;

  /**
   * Resultado retornado para tela de listagem.
   */
  pageResult : any = { result: false, message: '' };

  /**
   *
   * @param navCtrl
   * @param navParams
   * @param dbCirurgia
   * @param fileChooser
   * @param path
   * @param alert
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private dbCirurgia : CirurgiaProvider,
              private fileChooser : FileChooser,
              private path : FilePath,
              private alert : AlertController) {

    this.cirurgiaId = this.navParams.get('itemId');
    this.pageResult = this.navParams.get('result');

    if(this.cirurgiaId) {
      this.dbCirurgia.get(this.cirurgiaId).then(cirurgia => {
        this.cirurgiaNome = cirurgia.nome;
        this.cirurgiaTipo = cirurgia.tipo;
        this.cirurgiaData = cirurgia.data.toISOString();
        this.cirurgiaAnestesia = cirurgia.anestesia;
        this.cirurgiaMotivo = cirurgia.motivo;
        this.cirurgiaEspecialidade = cirurgia.especialidade;
        this.cirurgiaMedico = cirurgia.medico;
        this.cirurgiaLocal = cirurgia.local;
        this.cirurgiaObservacoes = cirurgia.observacoes;
        this.cirurgiaAnexos = cirurgia.anexos;
      });
    }
  }

  /**
   * Verifica e notifica sobre campos obrigatorios.
   */
  formValidate() {
    let hasError: boolean = false;
    let message: string = '';

    if(this.cirurgiaNome.length < 1) {
      hasError = true;
      message = 'Identifique o nome da cirurgia';
    }

    if(this.cirurgiaTipo.length < 1) {
      hasError = true;
      message = 'Especifique o tipo da cirurgia';
    }

    if(this.cirurgiaAnestesia.length < 1) {
      hasError = true;
      message = 'Informe as anestesias do procedimento';
    }

    if(this.cirurgiaMotivo.length < 1) {
      hasError = true;
      message = 'Indique o motivo para a cirurgia';
    }

    if(this.cirurgiaEspecialidade.length < 1) {
      hasError = true;
      message = 'Especifique a especialidade da cirurgia';
    }

    if(this.cirurgiaMedico.length < 1) {
      hasError = true;
      message = 'Informe o nome do médico responsável pela cirurgia';
    }

    if(this.cirurgiaLocal.length < 1) {
      hasError = true;
      message = 'Indique o local sujeito a cirurgia';
    }

    if (hasError) {
      this.alert.create({
        title: 'Erro',
        subTitle: message,
        buttons: ['OK']
      }).present();
    }

    return !hasError;
  }

  submitSave() {
    if (!this.formValidate()) {
      return;
    }

    let novaCirurgia = new Cirurgia();

    novaCirurgia.nome = this.cirurgiaNome;
    novaCirurgia.tipo = this.cirurgiaTipo;
    novaCirurgia.data = new Date(this.cirurgiaData);
    novaCirurgia.anestesia = this.cirurgiaAnestesia;
    novaCirurgia.motivo = this.cirurgiaMotivo;
    novaCirurgia.especialidade = this.cirurgiaEspecialidade;
    novaCirurgia.medico = this.cirurgiaMedico;
    novaCirurgia.local = this.cirurgiaLocal;
    novaCirurgia.observacoes = this.cirurgiaObservacoes;
    novaCirurgia.anexos = this.cirurgiaAnexos;

    if(this.cirurgiaId) {
      this.dbCirurgia.save(novaCirurgia, this.cirurgiaId).then((result) => {
        if(result > 0){
          this.pageResult.result = true;
          this.pageResult.message = 'Cirurgia alterada com sucesso!';
          this.navCtrl.pop();
        }
        else {
          alert('Já existe uma cirurgia com esses nome e data!');
        }
      });
    }
    else {
      this.dbCirurgia.insert(novaCirurgia, -1).then((result) => {
        if(result > 0) {
          this.pageResult.result = true;
          this.pageResult.message = 'Cirurgia adicionada com sucesso!';
          this.navCtrl.pop();
        }
        else {
          alert('Já existe uma cirurgia com esses nome e data!');
        }
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
          this.cirurgiaAnexos.push(a);
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
    let idx = this.cirurgiaAnexos.indexOf(uri);
    console.log('Trying to remove attachament ' + uri + ' at idx ' + idx);
    if(idx != -1) {
      this.cirurgiaAnexos.splice(idx, 1);
    }
  }

  /**
   * Cancela modificacoes pendentes e retorna para tela anterior.
   */
  cancelEditing() {
    this.navCtrl.pop();
  }
}
