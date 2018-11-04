import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class DatabaseProvider {

  constructor(private sqlite: SQLite) { }
  /**
   * Cria um banco caso não exista ou pega um banco existente com o nome no parametro
   */
  public getDB() {
    return this.sqlite.create({
      name: 'oluapp.db',
      location: 'default'
    });
  }

  /**
   * Cria a estrutura inicial do banco de dados
   */
  public createDatabase() {
    return this.getDB()
      .then((db: SQLiteObject) => {
        // Criando as tabelas
        this.createTables(db);
      })
      .catch(e => console.log(e));
  }

  /**
   * Criando as tabelas no banco de dados
   * @param db
   */
  private createTables(db: SQLiteObject) {
    // Criando as tabelas
    db.sqlBatch([
      [`CREATE TABLE IF NOT EXISTS vacina (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        nome VARCHAR(64) NOT NULL,
        tipo VARCHAR(64),
        lote VARCHAR(16),
        observacoes TEXT,
        data DATE NOT NULL,
        data_proxima DATE,
        _data_criacao DATETIME DEFAULT current_timestamp NOT NULL
        );`],
      [`CREATE TABLE IF NOT EXISTS anexo (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        nome VARCHAR(256) NOT NULL,
        caminho VARCHAR(256) NOT NULL,
        categoria_id INTEGER NOT NULL,
        registro_id INTEGER NOT NULL,
        _data_criacao DATETIME DEFAULT current_timestamp NOT NULL
       );`],
      [`CREATE TABLE IF NOT EXISTS medicamento (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        nome VARCHAR(64) NOT NULL,
        data_vencimento DATE NOT NULL,
        tipo VARCHAR(64) NOT NULL,
        alergico BOOLEAN NOT NULL,
        periodo_inicio DATE NOT NULL,
        periodo_fim DATE,
        dosagem VARCHAR(64),
        causa VARCHAR(64),
        tarja VARCHAR(64),
        observacoes TEXT NOT NULL,
        quantidade INTEGER,
        recorrencia VARCHAR(64),
        turno INTEGER,
        _data_criacao DATETIME DEFAULT current_timestamp NOT NULL
      );`],
      [`CREATE TABLE IF NOT EXISTS consulta (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
        nome VARCHAR(64) NOT NULL,
        especialidade VARCHAR(64) NOT NULL,
        data DATE NOT NULL,
        causa TEXT NOT NULL,
        preco REAL NOT NULL,
        exames TEXT NOT NULL,
        retorno DATE NOT NULL,
        observacoes TEXT,
        _data_criacao DATETIME DEFAULT current_timestamp NOT NULL
      );`],
      [`CREATE TABLE IF NOT EXISTS alergia (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
        tipo VARCHAR(64) NOT NULL,
        nivel VARCHAR(64) NOT NULL,
        sintomas VARCHAR(128) NOT NULL,
        observacoes TEXT NOT NULL,
        _data_criacao DATETIME DEFAULT current_timestamp NOT NULL
      );`]
    ])
      .then(() => console.log('Tabelas criadas'))
      .catch(e => console.error('Erro ao criar as tabelas', e));
  }

  public formatDate(d: Date){
    if (d !== undefined) {
      return d.getUTCFullYear() + '-' + (d.getUTCMonth() + 1) + '-' + d.getUTCDate();
    }
    else
      return null;
  }
}
