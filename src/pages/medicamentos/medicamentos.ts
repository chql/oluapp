import { ControladorBase } from '../../commom/controlador';
import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, Platform, ToastController, NavParams, ViewController, ModalController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {FileOpener} from '@ionic-native/file-opener';
import {File, FileEntry} from '@ionic-native/file';
import {
  MedicamentoProvider,
  tarjaMedicamento,
  tipoMedicamento,
  Medicamento,
  turnoMedicamento
} from "../../providers/medicamento/medicamento";
import {MedicamentosEditPage} from '../medicamentos-edit/medicamentos-edit';

@Component({
  templateUrl: 'detalhe.html'
})
export class MedicamentoDetalhesModal
{
  medicamento : Medicamento = null;
  constructor(public params : NavParams,
              public viewCtrl : ViewController,
              private fOpener: FileOpener,
              private file : File,
  ) {
    this.medicamento = params.get('item');
  }

  dismiss() {
    this.viewCtrl.dismiss().then(() => {});
  }

  /**
   * Formata data para exibicao.
   * @param rawDate
   */
  dateFormat(date : Date) {
    return date.getDate() + '/' + (date.getMonth()+1) + '/' + (date.getFullYear());
  }

  /**
   * Retorna texto representando os turnos de uso de um medicamento.
   * @param t
   */
  turnoFormat(t : number) {
    let label = '';
    if(t & turnoMedicamento.manha) {
      label = label.concat('Manhã');
    }
    if(t & turnoMedicamento.tarde) {
      if(label.length > 0) label = label.concat(', ');
      label = label.concat('Tarde');
    }
    if(t & turnoMedicamento.noite) {
      if(label.length > 0) label = label.concat(', ');
      label = label.concat('Noite');
    }
    return label;
  }

  backToDelete() {
    this.viewCtrl.dismiss({ toDelete: true });
  }

  backToEdit() {
    this.viewCtrl.dismiss({ toEdit: true });
  }

  /**
   * Exibe um anexo ao clicar nele nos detalhes.
   * @param anexo
   */
  openAttachment(anexo: any) {
    return this.file.resolveLocalFilesystemUrl(anexo.caminho)
      .then((entry: FileEntry) => {
        if (entry) {
          entry.file(meta => {
            this.fOpener.open(anexo.caminho, meta.type).then(() => console.log('Abriu'))
          }, error => {
            console.log(error);
          })
        }
      });
  }

  /**
   * Formata tarja do medicamento para exibicao.
   * @param t
   */
  formatTarja(t: tarjaMedicamento) {
    if (t == tarjaMedicamento.amarela) return 'Amarela';
    if (t == tarjaMedicamento.preta) return 'Preta';
    if (t == tarjaMedicamento.vermelha) return 'Vermelha';
    return '(null)';
  }

  /**
   * Formata tipo do medicamento para exibicao.
   * @param t
   */
  formatTipo(t : tipoMedicamento) {
    if(t == tipoMedicamento.fitoterapico) return 'Fitoterápico';
    if(t == tipoMedicamento.alopatico) return 'Alopático';
    if(t == tipoMedicamento.homeopatico) return 'Homeopático';
    if(t == tipoMedicamento.similar) return 'Similar';
    if(t == tipoMedicamento.manipulado) return 'Manipulado';
    if(t == tipoMedicamento.generico) return 'Genérico';
    if(t == tipoMedicamento.referencia) return 'Referência';
    if(t == tipoMedicamento.outro) return 'Outro';
    return '(null)';
  }
}

@IonicPage()
@Component({
  selector: 'page-medicamentos',
  templateUrl: 'medicamentos.html',
})
/**
 * Componente responsavel por listar e exibir medicamentos cadastrados.
 */
export class MedicamentosPage extends ControladorBase {
  /**
   *
   * @param navCtrl Para navegar para pagina de edicao.
   * @param platform Controle do botao voltar.
   * @param translate Obtencao de mensagens da interface.
   * @param dbMedicamento Acesso ao banco de medicamentos.
   * @param toast Exibicao de mensagens.
   * @param alert Confirmacao de exclusao.
   * @param fOpener Exibicao de anexos.
   * @param file Metadados de anexos.
   * @param modal Exibe detalhes de uma entrada.
   */
  constructor(public navCtrl: NavController,
              public platform: Platform,
              public translate: TranslateService,
              protected dbMedicamento: MedicamentoProvider,
              protected toast: ToastController,
              protected alert: AlertController,
              private fOpener: FileOpener,
              private file: File,
              protected modal : ModalController) {
    super(navCtrl, alert, toast, modal, platform, dbMedicamento);
  }

  /**
   * Retorna estrutura detalhada para uma data.
   * @param str
   */
  getDate(str: string) {
    let d = new Date(str);
    return d;
  }

  getEditPage() {
    return MedicamentosEditPage;
  }

  getDetailModal() {
    return MedicamentoDetalhesModal;
  }

  getDeleteConfirmMessage() {
    return 'Tem certeza que deseja excluir o medicamento?';
  }

  getPostDeleteMessage() {
    return 'Medicamento excluído!';
  }
}
