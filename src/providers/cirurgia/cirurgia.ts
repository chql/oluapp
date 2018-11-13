import { Injectable } from '@angular/core';
import { SQLiteObject } from "@ionic-native/sqlite";
import { DatabaseProvider } from "../database/database";
import { DateTime } from "ionic-angular";
import {AnexoProvider} from "../anexo/anexo";

const CATEGORIA = 5;

@Injectable()
export class CirurgiaProvider {
  anexos: AnexoProvider;

  constructor(private dbProvider: DatabaseProvider) {
    this.anexos = new AnexoProvider(dbProvider)
  }

  private struct(obj){
    let c = new Cirurgia();
    c.id = obj['id'];
    c.nome = obj['nome'];
    c.especialidade = obj['especialidade'];
    c.data = new Date(obj['data']);
    c.motivo = obj['motivo'];
    c.tipo = obj['tipo'];
    c.anestesia = obj['anestesia'];
    c.medico = obj['medico'];
    c.observacoes = obj['observacoes'];
    c.local = obj['local'];
    c._data_criacao = obj['_data_criacao'];

    c.data.setTime(c.data.getTime() + c.data.getTimezoneOffset()*60000);

    return c;
  }

  public insert(cir: Cirurgia, id: number) {
    return new Promise<number> ( (resolve) => {
      this.dbProvider.getDB()
        .then((db: SQLiteObject) => {
          db.executeSql(`SELECT * FROM cirurgia WHERE nome = ? AND data = ? ;`,
            [cir.nome, this.dbProvider.formatDate(cir.data)]).then( (result : any) => {
            if(result.rows.length > 0 && result.rows.item(0)['id'] != id) {
              resolve(-1);
            }
            else {
              if(id > 0){
                this.delete(id);
              }
              let sql = `INSERT INTO cirurgia (nome, tipo, data, anestesia, motivo, especialidade, medico, local, observacoes) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
              let data = [cir.nome, cir.tipo, this.dbProvider.formatDate(cir.data), cir.anestesia, cir.motivo, cir.especialidade,
                cir.medico, cir.local, cir.observacoes];
              db.executeSql(sql, data)
                .then((data: any) => {
                  for (let i = 0; i < cir.anexos.length; i++) {
                    let a = cir.anexos[i];
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
        db.executeSql(`DELETE FROM cirurgia WHERE id = ?`, [id]).then(() => {
          db.executeSql(`DELETE FROM anexo WHERE categoria_id = ? AND registro_id = ?;`, [CATEGORIA, id])
            .then(() => resolve());
        });
      });
    });
  }

  public get(id: number) {
    return new Promise<Cirurgia>(resolve => {
      this.dbProvider.getDB().then((db: SQLiteObject) => {
        return db.executeSql(`SELECT * FROM cirurgia WHERE id = ?;`, [id]).then((data: any) => {
          if (data.rows.length > 0){
            let cir = this.struct(data.rows.item(0));
            return this.anexos.getAttachment(cir.id, CATEGORIA, (anexos) => {
              cir.anexos = anexos;
              resolve(cir);
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
      return db.executeSql(`SELECT * FROM cirurgia ORDER BY id DESC;`, [])
        .then((data: any) => {
          if(data.rows.length > 0){
            let cirurgias: any[] = [];
            for(let i=0; i<data.rows.length; i++){
              let c = this.struct(data.rows.item(i));
              this.anexos.getAttachment(c.id, CATEGORIA, (anexos) => {
                c.anexos = anexos;
              });
              cirurgias.push(c);
            }
            return cirurgias;
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

  public save(c: Cirurgia, id: number) {
    return this.insert(c, id);
  }

  public search(query: string){
    query = '%' + query + '%';
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      return db.executeSql(`SELECT * FROM cirurgia WHERE nome LIKE ? OR especialidade LIKE ? OR motivo LIKE ? 
      OR anestesia LIKE ? OR observacoes LIKE ? OR tipo LIKE ? OR medico LIKE ? OR local LIKE ? ;`,
        [query, query, query, query, query, query, query, query]).then((data: any) => {
        if(data.rows.length > 0){
          let cirurgias: any[] = [];
          for(let i=0; i<data.rows.length; i++){
            let c = this.struct(data.rows.item(i));
            this.anexos.getAttachment(c.id, CATEGORIA, (anexos) => {
              c.anexos = anexos;
            });
            cirurgias.push(c);
          }
          return cirurgias;
        } else {
          return [];
        }
      }).catch();
    }).catch();
  }

}

export class Cirurgia {
  id: number;
  nome: string;
  tipo: string;
  data: Date;
  anestesia: string;
  motivo: string;
  especialidade: string;
  medico: string;
  local: string;
  observacoes: string;
  _data_criacao: DateTime;
  anexos: any;
}
