import { Injectable } from '@angular/core';
import { SQLiteObject } from "@ionic-native/sqlite";
import { DatabaseProvider } from "../database/database";
import {AnexoProvider} from "../anexo/anexo";

const CATEGORIA = 4;

@Injectable()
export class AlergiaProvider {
  anexos: AnexoProvider;

  constructor(private dbProvider: DatabaseProvider) {
    this.anexos = new AnexoProvider(dbProvider)
  }

  private struct(obj){
    let a = new Alergia();
    a.id = obj['id'];
    a.tipo = obj['tipo'];
    a.nivel = parseInt(obj['nivel']);
    a.sintomas = obj['sintomas'];
    a.observacoes = obj['observacoes'];
    a._data_criacao = new Date(obj['_data_criacao']);

    a._data_criacao.setTime(a._data_criacao.getTime() + a._data_criacao.getTimezoneOffset()*60000);

    return a;
  }

  public insert(ale: Alergia, id: number) {
    return new Promise<number> ( (resolve) => {
      this.dbProvider.getDB()
        .then((db: SQLiteObject) => {
          // TODO talvez adicionar validacao
          if(id > 0){
            this.delete(id);
          }
          let sql = `INSERT INTO alergia (tipo, nivel, sintomas, observacoes) VALUES (?, ?, ?, ?)`;
          let data = [ale.tipo, ale.nivel, ale.sintomas, ale.observacoes];
          db.executeSql(sql, data)
            .then((data: any) => {
              for (let i = 0; i < ale.anexos.length; i++) {
                let a = ale.anexos[i];
                if (a['nome'] !== undefined && a['caminho'] !== undefined) {
                  this.anexos.insertAttachment(data.insertId, CATEGORIA, a.caminho, a.nome);
                }
              }
              resolve(1);
            })
            .catch((e) => console.error(e));
          })
        .catch((e) => console.log(e));
    });
  }

  public delete(id: number) {
    return new Promise<null>((resolve) => {
      this.dbProvider.getDB().then((db: SQLiteObject) => {
        db.executeSql(`DELETE FROM alergia WHERE id = ?`, [id]).then(() => {
          db.executeSql(`DELETE FROM anexo WHERE categoria_id = ? AND registro_id = ?;`, [CATEGORIA, id])
            .then(() => resolve());
        });
      });
    });
  }

  public get(id: number) {
    return new Promise<Alergia>(resolve => {
      this.dbProvider.getDB().then((db: SQLiteObject) => {
        return db.executeSql(`SELECT * FROM alergia WHERE id = ?;`, [id]).then((data: any) => {
          if (data.rows.length > 0){
            let ale = this.struct(data.rows.item(0));
            return this.anexos.getAttachment(ale.id, CATEGORIA, (anexos) => {
              ale.anexos = anexos;
              resolve(ale);
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
      return db.executeSql(`SELECT * FROM alergia ORDER BY id DESC;`, [])
        .then((data: any) => {
          if(data.rows.length > 0){
            let alergias: any[] = [];
            for(let i=0; i<data.rows.length; i++){
              let a = this.struct(data.rows.item(i));
              this.anexos.getAttachment(a.id, CATEGORIA, (anexos) => {
                a.anexos = anexos;
              });
              alergias.push(a);
            }
            return alergias;
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

  public save(a: Alergia, id: number) {
    return this.insert(a, id);
  }

  public search(query: string){
    query = '%' + query + '%';
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      return db.executeSql(`SELECT * FROM alergia WHERE tipo LIKE ? OR nivel LIKE ? OR sintomas LIKE ? 
      OR observacoes LIKE ?;`, [query, query, query, query]).then((data: any) => {
        if(data.rows.length > 0){
          let alergias: any[] = [];
          for(let i=0; i<data.rows.length; i++){
            let a = this.struct(data.rows.item(i));
            this.anexos.getAttachment(a.id, CATEGORIA, (anexos) => {
              a.anexos = anexos;
            });
            alergias.push(a);
          }
          return alergias;
        } else {
          return [];
        }
      }).catch();
    }).catch();
  }

}

export enum tipoAlergia {
  anafilaxia = 'anafilaxia',
  complexo_imune = 'complexo imune',
  bacterianas = 'bacteriana',
  virus = 'vírus',
  parasitaria = 'parasitária',
  proteina_purificada = 'proteína purificada',
  substancia_quimica = 'substância química',
  alimentar = 'alergia alimentar'
}

export enum nivelAlergia {
  // TODO: adicionar conteudo conforme especificacao
  leve = 1,
  moderado = 2,
  grave = 3,
  gravissimo = 4
}

export class Alergia {
  id: number;
  tipo: tipoAlergia;
  nivel: nivelAlergia;
  sintomas: string;
  observacoes: string;
  _data_criacao: Date;
  anexos: any;
}
