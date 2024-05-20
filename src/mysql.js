import { env } from 'node:process';
import mysql from 'mysql2/promise';

export const connectionToMysql = async (options) => {
  options.host = options.host || env.OWL_DB_HOST;
  options.port = options.port || env.OWL_DB_PORT || 3306;
  options.database = options.database || env.OWL_DB_NAME;
  options.user = options.database || env.OWL_DB_USER;
  options.password = options.password || env.OWL_DB_PASSWORD;
  return mysql.createConnection(options);
}

export const execute = async (sql, options) => {
  let conn = options.connection;
  let autoEnd = false;
  if (!conn) {
    conn = await connectionToMysql(options);
    autoEnd = true;
  }
  const result = await conn.execute(sql);
  if (autoEnd) {
    conn.end();
  }
  return result;
}

export default {
  connectionToMysql,
}
