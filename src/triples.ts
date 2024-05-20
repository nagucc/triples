import { execute, connectionToMysql } from "./mysql.js";
import notions, { Notion } from './notions.js';

export class Triple {
  constructor(public id: number, public subject, public predicate, public object) {
    this.id = id;
    this.subject = subject;
    this.predicate = predicate;
    this.object = object;
  }
}

const row2Triple = (row) => (new Triple(
  row.id,
  new Notion<string>(row.subject, row.s_id),
  new Notion<string>(row.predicate, row.p_id),
  new Notion<string>(row.object, row.o_id),
));

export const getById = async (id: number, options: any): Promise<Triple> => {
  const [ rows, ] = await execute(`SELECT triples.id, s.id AS s_id, s.name AS subject, p.id AS p_id, p.name AS predicate, o.id AS o_id, o.name AS object 
    FROM triples 
    LEFT JOIN notions as s ON triples.subject = s.id 
    LEFT JOIN notions as p ON triples.predicate = p.id 
    LEFT JOIN notions as o ON triples.object = o.id 
    WHERE triples.id = ${id};`, options);
  if (rows[0]) {
    return row2Triple(rows[0])
  } else null;
  
}

const rawGetBySPO = async (subject, predicate, object, options) => {
  const [ rows, ] = await execute(`SELECT * FROM triples WHERE subject = '${subject}' AND predicate = '${predicate}' AND object = '${object}'`, options);
  return rows[0];
}

const rawInsert = async (subject, predicate, object, options) => {
  console.log('rawInsert::s,p,o:', subject,predicate,object);
  if (!subject || !predicate || !object) throw new Error(`s(${subject}),p(${predicate}),o(${object})不能为空`)
  const [ result, ] = await execute(`INSERT INTO triples (subject, predicate, object) VALUES (${subject}, ${predicate}, ${object});`, options);
  return result.insertId;
}

export const listByS = async (subject: Notion<any> | string, options: any): Promise<Array<Triple>> => {
  if (!(subject instanceof notions.Notion)) subject = new notions.Notion(subject.toString());
  // 判断subject是对象还是字符串，来决定where子句怎么写
  let where_claude = `WHERE triples.subject = '${subject.id}'`;
  if (!subject.id) where_claude = `WHERE triples.subject = (SELECT id FROM notions WHERE name = '${subject}')`;
  const sql = `SELECT triples.id, s.id AS s_id, s.name AS subject, p.id AS p_id, p.name AS predicate, o.id AS o_id, o.name AS object FROM triples
  LEFT JOIN notions as s ON triples.subject = s.id
  LEFT JOIN notions as p ON triples.predicate = p.id
  LEFT JOIN notions as o ON triples.object = o.id
  ${where_claude}`
  const [ rows, ] = await execute(sql, options);
  return rows.map(row => row2Triple(row));
}

export const listByO = async (object: Notion<any>|string, options): Promise<Array<Triple>> => {
  if (!(object instanceof notions.Notion)) object = new notions.Notion(object.toString());
  // 判断object是对象还是字符串，来决定where子句怎么写
  let where_claude = `WHERE triples.object = '${object.id}'`;
  if (!object.id) where_claude = `WHERE triples.object = (SELECT id FROM notions WHERE name = '${object}')`;

  const sql = `SELECT triples.id, s.id AS s_id, s.name AS subject, p.id AS p_id, p.name AS predicate, o.id AS o_id, o.name AS object FROM triples
  LEFT JOIN notions as s ON triples.subject = s.id
  LEFT JOIN notions as p ON triples.predicate = p.id
  LEFT JOIN notions as o ON triples.object = o.id
  ${where_claude}`
  const [ rows, ] = await execute(sql, options);
  return rows.map(row => row2Triple(row));
}

export const listByP = async (predicate: Notion<any>|string, options): Promise<Array<Triple>> => {
  if (!(predicate instanceof notions.Notion)) predicate = new notions.Notion(predicate.toString());
  // 判断 predicate 是对象还是字符串，来决定where子句怎么写
  let where_claude = `WHERE triples.predicate = '${predicate.id}'`;
  if (!predicate.id) where_claude = `WHERE triples.predicate = (SELECT id FROM notions WHERE name = '${predicate}')`;
  
  const sql = `SELECT triples.id, s.id AS s_id, s.name AS subject, p.id AS p_id, p.name AS predicate, o.id AS o_id, o.name AS object FROM triples
  LEFT JOIN notions as s ON triples.subject = s.id
  LEFT JOIN notions as p ON triples.predicate = p.id
  LEFT JOIN notions as o ON triples.object = o.id
  ${where_claude}`
  const [ rows, ] = await execute(sql, options);
  return rows.map(row => row2Triple(row));
}

export const listBySP = async (subject: Notion<any>|string, predicate: Notion<any>|string, options): Promise<Array<Triple>> => {
  // 判断 subject, predicate 是对象还是字符串，来决定where子句怎么写
  if (!(subject instanceof notions.Notion)) subject = new notions.Notion(subject.toString());
  let subject_criteria = `triples.subject = '${subject.id}'`;
  if (!subject.id) subject_criteria = `triples.subject = (SELECT id FROM notions WHERE name = '${subject}')`;
 
  if (!(predicate instanceof notions.Notion)) predicate = new notions.Notion(predicate.toString()); 
  let predicate_criteria = `triples.predicate = '${predicate.id}'`;
  if (!predicate.id) predicate_criteria = `triples.predicate = (SELECT id FROM notions WHERE name = '${predicate}')`;

  const where_claude = `WHERE ${subject_criteria} AND ${predicate_criteria}`;
  const sql = `SELECT triples.id, s.id AS s_id, s.name AS subject, p.id AS p_id, p.name AS predicate, o.id AS o_id, o.name AS object FROM triples
  LEFT JOIN notions as s ON triples.subject = s.id
  LEFT JOIN notions as p ON triples.predicate = p.id
  LEFT JOIN notions as o ON triples.object = o.id
  ${where_claude}`
  const [ rows, ] = await execute(sql, options);
  return rows.map(row => row2Triple(row));
}

export const listByPO = async (predicate: Notion<any>|string, object: Notion<any>|string, options): Promise<Array<Triple>> => {
  // 判断 predicate, object 是对象还是字符串，来决定where子句怎么写
  if (!(object instanceof notions.Notion)) object = new notions.Notion(object.toString());
  let object_criteria = `triples.subject = '${object.id}'`;
  if (!object.id) object_criteria = `triples.object = (SELECT id FROM notions WHERE name = '${object}')`;
  
  if (!(predicate instanceof notions.Notion)) predicate = new notions.Notion(predicate.toString()); 
  let predicate_criteria = `triples.predicate = '${predicate.id}'`;
  if (!predicate.id) predicate_criteria = `triples.predicate = (SELECT id FROM notions WHERE name = '${predicate}')`;

  const where_claude = `WHERE ${object_criteria} AND ${predicate_criteria}`;
  const sql = `SELECT triples.id, s.id AS s_id, s.name AS subject, p.id AS p_id, p.name AS predicate, o.id AS o_id, o.name AS object FROM triples
  LEFT JOIN notions as s ON triples.subject = s.id
  LEFT JOIN notions as p ON triples.predicate = p.id
  LEFT JOIN notions as o ON triples.object = o.id
  ${where_claude}`
  const [ rows, ] = await execute(sql, options);
  return rows.map(row => row2Triple(row));
}

export const listBySO = async (subject: Notion<any>|string, object: Notion<any>|string, options): Promise<Array<Triple>> => {
  // 判断 subject, object 是对象还是字符串，来决定where子句怎么写
  if (!(subject instanceof notions.Notion)) subject = new notions.Notion(subject.toString());
  let subject_criteria = `triples.subject = '${subject.id}'`;
  if (!subject.id) subject_criteria = `triples.subject = (SELECT id FROM notions WHERE name = '${subject}')`;
 
  if (!(object instanceof notions.Notion)) object = new notions.Notion(object.toString());
  let object_criteria = `triples.subject = '${object.id}'`;
  if (!object.id) object_criteria = `triples.object = (SELECT id FROM notions WHERE name = '${object}')`;

  const where_claude = `WHERE ${subject_criteria} AND ${object_criteria}`;
  const sql = `SELECT triples.id, s.id AS s_id, s.name AS subject, p.id AS p_id, p.name AS predicate, o.id AS o_id, o.name AS object FROM triples
  LEFT JOIN notions as s ON triples.subject = s.id
  LEFT JOIN notions as p ON triples.predicate = p.id
  LEFT JOIN notions as o ON triples.object = o.id
  ${where_claude}`
  const [ rows, ] = await execute(sql, options);
  return rows.map(row => row2Triple(row));
}

export const getBySPO = async (subject: Notion<any>|string, predicate: Notion<any>|string, object: Notion<any>|string, options): Promise<Triple> => {
// 判断 subject, predicate, object 是对象还是字符串，来决定where子句怎么写
if (!(subject instanceof notions.Notion)) subject = new notions.Notion(subject.toString());
let subject_criteria = `triples.subject = '${subject.id}'`;
if (!subject.id) subject_criteria = `triples.subject = (SELECT id FROM notions WHERE name = '${subject}')`;

if (!(predicate instanceof notions.Notion)) predicate = new notions.Notion(predicate.toString()); 
let predicate_criteria = `triples.predicate = '${predicate.id}'`;
if (!predicate.id) predicate_criteria = `triples.predicate = (SELECT id FROM notions WHERE name = '${predicate}')`;

if (!(object instanceof notions.Notion)) object = new notions.Notion(object.toString());
let object_criteria = `triples.subject = '${object.id}'`;
if (!object.id) object_criteria = `triples.object = (SELECT id FROM notions WHERE name = '${object}')`;


  const where_claude = `WHERE ${subject_criteria} AND ${predicate_criteria} AND ${object_criteria}`;
  const sql = `SELECT triples.id, s.id AS s_id, s.name AS subject, p.id AS p_id, p.name AS predicate, o.id AS o_id, o.name AS object FROM triples
  LEFT JOIN notions as s ON triples.subject = s.id
  LEFT JOIN notions as p ON triples.predicate = p.id
  LEFT JOIN notions as o ON triples.object = o.id
  ${where_claude}`
  const [ rows, ] = await execute(sql, options);
  if (rows[0]) return row2Triple(rows[0]);
  else return null;
}

export const getOrCreate = async (subject: Notion<any>|string, predicate: Notion<any>|string, object: Notion<any>|string, options: { connection: any; }): Promise<Triple> => {
  console.log(`Triples.getOrCrate::s(${subject}, p(${predicate}), o(${object}))`);
  let conn = options.connection;
  let autoEnd = false;
  if (!conn) {
    conn = await connectionToMysql(options);
    autoEnd = true;
  }
  if (!(subject instanceof notions.Notion) || !subject.id) subject = await notions.getOrCreate(subject, { connection: conn });
  if (!(predicate instanceof notions.Notion) || !predicate.id) predicate = await notions.getOrCreate(predicate, { connection: conn });
  if (!(object instanceof notions.Notion) || !object.id) object = await notions.getOrCreate(object, { connection: conn });
  
  let tripleId = (await rawGetBySPO(subject.id, predicate.id, object.id, { connection: conn }))?.id;
  if (!tripleId) {
    tripleId = await rawInsert(subject.id, predicate.id, object.id, { connection: conn });
  }
  if (autoEnd) await conn.end();
  return new Triple(tripleId, subject, predicate, object);
}

export const deleteById = async (id: number, options: any): Promise<number> => {
  const [ result, ] = await execute(`DELETE FROM triples WHERE id = ${id}`, options);
  return result?.affectedRows || 0;
}

export default {
  getById,
  getBySPO,
  listByS,
  listByP,
  listByO,
  listBySP,
  listBySO,
  listByPO,
  getOrCreate,
  deleteById,
  Triple,
}