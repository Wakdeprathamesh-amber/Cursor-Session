const fs = require("fs/promises");
const path = require("path");
const initSqlJs = require("sql.js");

const dbFilePath = path.join(__dirname, "app.sqlite");
let dbInstancePromise = null;

async function loadSqlJs() {
  const distDir = path.join(__dirname, "..", "node_modules", "sql.js", "dist");
  return initSqlJs({
    locateFile: (file) => path.join(distDir, file),
  });
}

async function loadDatabase(SQL) {
  try {
    const file = await fs.readFile(dbFilePath);
    return { db: new SQL.Database(file), isNew: false };
  } catch {
    return { db: new SQL.Database(), isNew: true };
  }
}

async function saveDatabase(db) {
  const data = db.export();
  const buffer = Buffer.from(data);
  await fs.writeFile(dbFilePath, buffer);
}

async function initDb() {
  if (dbInstancePromise) {
    return dbInstancePromise;
  }

  dbInstancePromise = (async () => {
    const SQL = await loadSqlJs();
    const { db, isNew } = await loadDatabase(SQL);
    db.run("PRAGMA foreign_keys = ON;");

    if (isNew) {
      const schema = await fs.readFile(path.join(__dirname, "schema.sql"), "utf8");
      const seed = await fs.readFile(path.join(__dirname, "seed.sql"), "utf8");
      db.run(schema);
      db.run(seed);
      await saveDatabase(db);
    }

    return { SQL, db };
  })();

  return dbInstancePromise;
}

async function run(sql, params = []) {
  const { db } = await initDb();
  db.run(sql, params);
  await saveDatabase(db);
}

async function get(sql, params = []) {
  const { db } = await initDb();
  const stmt = db.prepare(sql, params);
  const row = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return row;
}

async function all(sql, params = []) {
  const { db } = await initDb();
  const stmt = db.prepare(sql, params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

async function transaction(callback) {
  const { db } = await initDb();
  db.run("BEGIN");
  try {
    const helpers = {
      run: (sql, params = []) => db.run(sql, params),
      get: (sql, params = []) => {
        const stmt = db.prepare(sql, params);
        const row = stmt.step() ? stmt.getAsObject() : null;
        stmt.free();
        return row;
      },
      all: (sql, params = []) => {
        const stmt = db.prepare(sql, params);
        const rows = [];
        while (stmt.step()) {
          rows.push(stmt.getAsObject());
        }
        stmt.free();
        return rows;
      },
    };

    const result = await callback(helpers);
    db.run("COMMIT");
    await saveDatabase(db);
    return result;
  } catch (error) {
    db.run("ROLLBACK");
    throw error;
  }
}

module.exports = {
  initDb,
  run,
  get,
  all,
  transaction,
  saveDatabase,
  dbFilePath,
};
