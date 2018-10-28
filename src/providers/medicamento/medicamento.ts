import { Injectable } from '@angular/core';
import { SQLiteObject } from "@ionic-native/sqlite";
import { DatabaseProvider } from "../database/database";
import { DateTime } from "ionic-angular";
import {AnexoProvider} from "../anexo/anexo";

const CATEGORIA = 2;

@Injectable()
export class MedicamentoProvider {
  anexos: AnexoProvider;

  constructor(private dbProvider: DatabaseProvider) {
    this.anexos = new AnexoProvider(dbProvider)
  }

  private struct(obj){
    let m = new Medicamento();
    m.id = obj['id'];
    m.nome = obj['nome'];
    m.data_vencimento = new Date(obj['data_vencimento']);
    m.tipo = obj['tipo'];
    m.alergico = obj['alergico'] == 'true';
    m.periodo_inicio = new Date(obj['periodo_inicio']);
    m.periodo_fim = new Date(obj['periodo_fim']);
    m.dosagem = obj['dosagem'];
    m.causa = obj['causa'];
    m.tarja = obj['tarja'];
    //m.horario = obj['horario'];
    m.quantidade = obj['quantidade'];
    m.recorrencia = obj['recorrencia'];
    m.turno = obj['turno'];
    m.observacoes = obj['observacoes'];
    m._data_criacao = obj['_data_criacao'];

    m.data_vencimento.setTime(m.data_vencimento.getTime() + m.data_vencimento.getTimezoneOffset()*60000);
    m.periodo_inicio.setTime(m.periodo_inicio.getTime()   + m.periodo_inicio.getTimezoneOffset()*60000);
    m.periodo_fim.setTime(m.periodo_fim.getTime()         + m.periodo_fim.getTimezoneOffset()*60000);

    return m;
  }

  public insert(med: Medicamento, id: number) {
    return new Promise<number> ( (resolve) => {
      this.dbProvider.getDB()
        .then((db: SQLiteObject) => {
          db.executeSql(`SELECT * FROM medicamento WHERE nome = ? AND dosagem = ? AND periodo_inicio = ? ;`,
            [med.nome, med.dosagem, this.dbProvider.formatDate(med.periodo_inicio)]).then( (result : any) => {
            if(result.rows.length > 0 && result.rows.item(0)['id'] != id) {
              resolve(-1);
            }
            if(med.periodo_inicio > med.periodo_fim){
              resolve(-2);
            }
            else {
              if(id > 0){
                this.delete(id);
              }
              let sql = `INSERT INTO medicamento (nome, tipo, data_vencimento, alergico, periodo_inicio, periodo_fim, 
              dosagem, causa, tarja, observacoes, quantidade, recorrencia, turno) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
              let data = [med.nome, med.tipo, this.dbProvider.formatDate(med.data_vencimento), med.alergico, this.dbProvider.formatDate(med.periodo_inicio), this.dbProvider.formatDate(med.periodo_fim),
              med.dosagem, med.causa, med.tarja, med.observacoes, med.quantidade, med.recorrencia, med.turno];
              db.executeSql(sql, data)
                .then((data: any) => {
                  for (let i = 0; i < med.anexos.length; i++) {
                    let a = med.anexos[i];
                    if (a['nome'] !== undefined && a['caminho'] !== undefined) {
                      this.anexos.insertAttachment(data.insertId, CATEGORIA, a.caminho, a.nome);
                    }
                  }
                  resolve(1);
                })
                .catch((e) => console.error(e));
            }
          }).catch((e) => console.log(e));
        })
        .catch((e) => console.error(e));
    });
  }

  public delete(id: number) {
    return new Promise<null>((resolve) => {
      this.dbProvider.getDB().then((db: SQLiteObject) => {
        db.executeSql(`DELETE FROM medicamento WHERE id = ?`, [id]).then(() => {
          db.executeSql(`DELETE FROM anexo WHERE categoria_id = ? AND registro_id = ?;`, [CATEGORIA, id])
            .then(() => resolve());
        });
      });
    });
  }

  public get(id: number) {
    return new Promise<Medicamento>(resolve => {
      this.dbProvider.getDB().then((db: SQLiteObject) => {
        return db.executeSql(`SELECT * FROM medicamento WHERE id = ?;`, [id]).then((data: any) => {
          if (data.rows.length > 0){
            let med = this.struct(data.rows.item(0));
            console.log(med);
            return this.anexos.getAttachment(med.id, CATEGORIA, (anexos) => {
                med.anexos = anexos;
                resolve(med);
            }).catch((e) => console.error(e));
          } else {
            resolve(null);
          }
        }).catch((e) => console.error(e));
      }).catch((e) => console.error(e));
    });
  }

  public getAll() {
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      return db.executeSql(`SELECT * FROM medicamento ORDER BY id DESC;`, [])
        .then((data: any) => {
          if(data.rows.length > 0){
            let medicamentos: any[] = [];
            for(let i=0; i<data.rows.length; i++){
              let m = this.struct(data.rows.item(i));
              this.anexos.getAttachment(m.id, CATEGORIA, (anexos) => {
                m.anexos = anexos;
              });
              medicamentos.push(m);
            }
            return medicamentos;
          } else {
            return [];
          }
        }).catch((e) => {
          console.error(e);
          return [];
      })
    }).catch((e) => {
      console.error(e);
      return [];
    });
  }

  public save(m: Medicamento, id: number) {
    return this.insert(m, id);
  }

  public search(query: string){
    query = '%' + query + '%';
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      return db.executeSql(`SELECT * FROM medicamento WHERE nome LIKE ? OR tipo LIKE ? OR dosagem LIKE ? 
      OR causa LIKE ? OR observacoes LIKE ?;`, [query, query, query, query, query]).then((data: any) => {
        if(data.rows.length > 0){
          let medicamentos: any[] = [];
          for(let i=0; i<data.rows.length; i++){
            let m = this.struct(data.rows.item(i));
            this.anexos.getAttachment(m.id, CATEGORIA, (anexos) => {
              m.anexos = anexos;
            });
            medicamentos.push(m);
          }
          return medicamentos;
        } else {
          return [];
        }
      }).catch();
    }).catch();
  }

}

export enum tipoMedicamento {
  fitoterapico = 'fitoterapico',
  alopatico = 'alopatico',
  homeopatico = 'homeopatico',
  similar = 'similar',
  manipulado = 'manipulado',
  generico = 'generico',
  referencia = 'referencia',
  outro = 'outro'
}

export enum tarjaMedicamento {
  vermelha = 'vermelha',
  amarela = 'amarela',
  preta = 'preta',
}

export enum turnoMedicamento {
  manha = 1,
  tarde = 2,
  noite = 4
}

export enum recorrenciaMedicamento {
  diariamente = 'dia',
  semanalmente = 'semana',
  quinzenalmente = 'quinzena',
  mensalmente = 'mes',
  anualmente = 'ano'
}

export class Medicamento {
  id: number;
  nome: string;
  data_vencimento: Date;
  tipo: tipoMedicamento;
  alergico: boolean;
  periodo_inicio: Date;
  periodo_fim: Date;
  dosagem: string;
  causa: string;
  tarja: tarjaMedicamento;
  //horario: Date;
  quantidade: number;
  recorrencia: recorrenciaMedicamento;
  turno: number;
  observacoes: string;
  _data_criacao: DateTime;
  anexos: any;
}
