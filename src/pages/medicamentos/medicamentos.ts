import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, Platform, Searchbar, ToastController, NavParams, ViewController, ModalController} from 'ionic-angular';
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
import {timer} from 'rxjs/observable/timer';

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
    this.medicamento = params.get('medicamento');
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
export class MedicamentosPage {

  /**
   * Textos para exibicao de meses na interface.
   */
  monthsName: Array<string> = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  /**
   * Armazenas todas so medicamentos visiveis.
   */
  medicamentos: Array<any> = [];

  /**
   * Estrutura auxiliar para comunicacao com a pagina de edicao.
   */
  editPageResult: any = {result: false, message: ''};

  /**
   * Modo de busca ativdao
   */
  searchMode: boolean = false;

  /**
   * Conteudo da busca
   */
  search: string = '';

  /**
   * Referencia para restaurar o comportamento do botao voltar.
   */
  restoreBackButton: Function = null;

  /**
   * Componentes de interface
   */
  @ViewChild('qinput') searchInput: Searchbar;

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
   */
  constructor(public navCtrl: NavController,
              public platform: Platform,
              public translate: TranslateService,
              private dbMedicamento: MedicamentoProvider,
              private toast: ToastController,
              private alert: AlertController,
              private fOpener: FileOpener,
              private file: File,
              private modal : ModalController) {
    this.getMedicamentos();
  }

  /**
   * Busca todos os medicamentos no banco de dados.
   */
  getMedicamentos() {
    return this.dbMedicamento.getAll().then(medicamentos => {
      this.medicamentos = medicamentos;
    });
  }


  /**
   * Expande a visualizacao detalhada do medicamento.
   * @param medicamento
   */
  expandView(medicamento : Medicamento) {
    let modal = this.modal.create(MedicamentoDetalhesModal, { medicamento : medicamento });
    modal.onDidDismiss(data => {
      if(data) {
        if(data.toEdit === true) {
          this.openEdit(medicamento.id);
        }
        else if(data.toDelete === true) {
          this.openDelete(medicamento);
        }
      }
    });
    modal.present();
  }

  /**
   * Retorna estrutura detalhada para uma data.
   * @param str
   */
  getDate(str: string) {
    let d = new Date(str);
    return d;
  }

  /**
   * Abre a pagina para cadastro de novo medicamento.
   */
  openAdd() {
    this.navCtrl.push(MedicamentosEditPage, {result: this.editPageResult});
  }

  /**
   * Exibe pagina para edicao de medicamento existente.
   * @param id
   */
  openEdit(id: number) {
    this.navCtrl.push(MedicamentosEditPage, {
      result: this.editPageResult,
      medicamentoId: id
    });
  }

  /**
   * Confirma um medicamento apos confirmacao do usuario.
   * @param medicamento
   */
  openDelete(medicamento : Medicamento) {
    this.alert.create({
      title: 'Confirmação',
      message: 'Tem certeza que deseja excluir o medicamento?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => this.expandView(medicamento)
        },
        {
          text: 'Excluir',
          handler: () => {
            this.dbMedicamento.delete(medicamento.id).then(() => {
              let idx = -1;
              for(let i = 0; i < this.medicamentos.length; i++) {
                if(this.medicamentos[i].id == medicamento.id) {
                  idx = i;
                  break;
                }
              }
              if(idx != -1) {
                this.medicamentos.splice(idx, 1);
                this.toast.create({
                  message: 'Medicamento excluído!',
                  duration: 3000
                }).present();
              }
            });
          }
        }
      ]
    }).present();
  }

  /**
   * Atualiza os resultados de busca de acordo com o campo de busca.
   */
  loadSearchResults() {
    if(this.searchMode) {
      if(this.search.length > 0) {
        this.dbMedicamento.search(this.search).then(resultados => {
          this.medicamentos = resultados;
        });
      }
    }
  }

  /**
   * Entra em modo de busca.
   * Elementos da barra de navegacao e botao de adicionar sao ocultados.
   */
  enterSearchMode() {
    this.searchMode = true;
    timer(500).subscribe(() => {
      this.searchInput.setFocus();
      this.loadSearchResults();
      this.restoreBackButton =
        this.platform.registerBackButtonAction(() => this.leaveSearchMode(), 666);
    });
  }

  /**
   * Sai do modo de busca.
   */
  leaveSearchMode() {
    this.searchMode = false;
    this.search = '';
    this.getMedicamentos();
    if (this.restoreBackButton) {
      this.restoreBackButton();
      this.restoreBackButton = null;
    }
  }

  /**
   * Retorna para o menu inicial.
   */
  navBack() {
    this.navCtrl.pop();
  }

  /**
   * Metodo executado sempre que a pagina aberta ou fechada.
   * Caso esteja retornando da tela de edicao exibe mensagem do resultado.
   */
  ionViewDidEnter() {
    if(this.editPageResult.result) {
      this.getMedicamentos().then(() => this.toast.create({
        message: this.editPageResult.message,
        duration: 3000
      }).present());
      this.editPageResult.result = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MedicamentosPage');
  }
}
