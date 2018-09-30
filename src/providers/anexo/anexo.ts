import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';

@Injectable()
export class AnexoProvider {

  constructor(public dbProvider: DatabaseProvider) { }

  public insertAttachment(registro: number, categoria: number, caminho: string, nome:string){
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = `INSERT INTO anexo (nome, caminho, categoria_id, registro_id) VALUES (?, ?, ?, ?);`;
      let data = [nome, caminho, categoria, registro];

      return db.executeSql(sql, data).catch((e) => console.error(e));

    }).catch((e) => console.error(e));
  }

  public getAttachment(registro: number, categoria: number, cb: any){
    return this.dbProvider.getDB().then((db: SQLiteObject) => {
      let sql = `SELECT * FROM anexo WHERE categoria_id = ? AND registro_id = ?;`;
      let data = [categoria, registro];

      return db.executeSql(sql, data).then((data: any) => {
        if (data.rows.length > 0){
          let anexos: any[] = [];
          for(let i=0; i<data.rows.length; i++){
            anexos.push(data.rows.item(i));
          }
          cb(anexos);
        } else {
          cb([]);
        }
      }).catch((e) => console.error(e));
    }).catch((e) => console.error(e));
  }
}
