import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {
  Medicamento,
  MedicamentoProvider,
  tarjaMedicamento,
  tipoMedicamento
} from "../../providers/medicamento/medicamento";
import {FileChooser} from '@ionic-native/file-chooser';
import {FilePath} from '@ionic-native/file-path';

@IonicPage()
@Component({
  selector: 'page-medicamentos-edit',
  templateUrl: 'medicamentos-edit.html',
})
/**
 * Permite o cadastro e edicao de medicamentos.
 */
export class MedicamentosEditPage {

  /**
   * Medicamento sendo editado.
   * Nulo para adicao de novo medicamento.
   */
  medicamentoId : number = null;

  /**
   * Nome do medicamento.
   */
  medicamentoNome : string = '';

  /**
   * Tipo do medicamento.
   */
  medicamentoTipo : string = 'fitoterapico';

  /**
   * Tarja do medicamento.
   */
  medicamentoTarja : string = 'amarela';

  /**
   * Dosagem do medicamento.
   */
  medicamentoDosagem : string = '';

  /**
   * Causa para uso do medicamento.
   */
  medicamentoCausa : string = '';

  /**
   * Observacao sobre o medicamento.
   */
  medicamentoObservacao : string = '';

  /**
   * Anexos.
   */
  medicamentoAnexos : Array<any> = [];

  /**
   * Medicamento para tratamento de alergias.
   */
  medicamentoAlergico : boolean = false;

  /**
   * Data de vencimento do medicamento.
   */
  medicamentoVencimento : string = (new Date()).toISOString();

  /**
   * Inicio do tratamento do medicamento.
   */
  medicamentoInicio : string = (new Date()).toISOString();

  /**
   * Fim do tratamento do medicamento.
   */
  medicamentoFinal : string = (new Date()).toISOString();

  /**
   * Resultado retornado para tela de listagem.
   * Utilizado em caso de uma nova vacina ser adicionada ou alterada.
   */
  pageResult : any = { result: false, message: '' };

  /**
   *
   * @param navCtrl
   * @param navParams
   * @param dbMedicamento
   * @param alert
   * @param fileChooser
   * @param path
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private dbMedicamento : MedicamentoProvider,
              private alert : AlertController,
              private fileChooser : FileChooser,
              private path : FilePath) {

    // recupera os parametros de navegacao
    this.medicamentoId = this.navParams.get('medicamentoId');
    this.pageResult = this.navParams.get('result');

    if(this.medicamentoId) {
      this.dbMedicamento.get(this.medicamentoId).then((medicamento) => {
        this.medicamentoNome       = medicamento.nome;
        this.medicamentoTipo       = medicamento.tipo;
        this.medicamentoTarja      = medicamento.tarja;
        this.medicamentoDosagem    = medicamento.dosagem;
        this.medicamentoCausa      = medicamento.causa;
        this.medicamentoObservacao = medicamento.observacoes;
        this.medicamentoAnexos     = medicamento.anexos;
        this.medicamentoAlergico   = medicamento.alergico;
        this.medicamentoVencimento = medicamento.data_vencimento.toISOString();
        this.medicamentoInicio     = medicamento.periodo_inicio.toISOString();
        this.medicamentoFinal      = medicamento.periodo_fim.toISOString();
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
          this.medicamentoAnexos.push(a);
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

    if(this.medicamentoNome.length < 1) {
      hasError = true;
      message = 'Preencha o nome do medicamento';
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
   * Converte value do input tipo para estrutura.
   */
  parseMedicamentoTipo(value : string) : tipoMedicamento {
    if(value == 'fitoterapico') return tipoMedicamento.fitoterapico;
    if(value == 'alopatico')    return tipoMedicamento.alopatico;
    if(value == 'homeopatico')  return tipoMedicamento.homeopatico;
    if(value == 'similar')      return tipoMedicamento.similar;
    if(value == 'manipulado')   return tipoMedicamento.manipulado;
    if(value == 'generico')     return tipoMedicamento.generico;
    if(value == 'referencia')   return tipoMedicamento.referencia;
    if(value == 'outro')        return tipoMedicamento.outro;
    return null;
  }

  parseMedicamentoTarja(value : string) {
    if(value == 'vermelha') return tarjaMedicamento.vermelha;
    if(value == 'amarela')  return tarjaMedicamento.amarela;
    if(value == 'preta')    return tarjaMedicamento.preta;
    return null;
  }

  /**
   * Salva os dados da vacina que foi adicionada ou modificada.
   * Preenche o resultado da adicao/modificacao e retorna para tela anterior.
   */
  submitSave() {
    if(!this.formValidate()) {
      return;
    }

    let novoMedicamento = new Medicamento();

    novoMedicamento.nome = this.medicamentoNome;
    novoMedicamento.tipo = this.parseMedicamentoTipo(this.medicamentoTipo);
    novoMedicamento.tarja = this.parseMedicamentoTarja(this.medicamentoTarja);
    novoMedicamento.dosagem = this.medicamentoDosagem;
    novoMedicamento.causa = this.medicamentoCausa;
    novoMedicamento.observacoes = this.medicamentoObservacao;
    novoMedicamento.anexos = this.medicamentoAnexos;
    novoMedicamento.alergico = this.medicamentoAlergico;
    novoMedicamento.data_vencimento = new Date(this.medicamentoVencimento);
    novoMedicamento.periodo_inicio = new Date(this.medicamentoInicio);
    novoMedicamento.periodo_fim = new Date(this.medicamentoFinal);

    console.log(novoMedicamento);

    if(this.medicamentoId) {
      this.dbMedicamento.save(novoMedicamento, this.medicamentoId).then((result) => {
        console.log(result);
        if(result > 0) {
          this.pageResult.result = true;
          this.pageResult.message = 'Medicamento alterado com sucesso!';
          this.navCtrl.pop();
        }
		else {
			alert('Esse medicamento já foi cadastrado no mesmo período');
		}
      }).catch(e => console.log(e));
    }
    else {
      this.dbMedicamento.insert(novoMedicamento, -1).then((result) => {
        console.log(result);
        if(result > 0) {
          this.pageResult.result = true;
          this.pageResult.message = 'Medicamento inserido com sucesso!';
          this.navCtrl.pop();
        }
		else {
			alert('Esse medicamento já foi cadastrado no mesmo período');
		}
      }).catch(e => console.log(e));
    }
  }

  /**
   * Remove um anexo da lista de anexos.
   * @param uri
   */
  removeAttachment(uri : string) {
    let idx = this.medicamentoAnexos.indexOf(uri);
    console.log('Trying to remove attachament ' + uri + ' at idx ' + idx);
    if(idx != -1) {
      this.medicamentoAnexos.splice(idx, 1);
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
