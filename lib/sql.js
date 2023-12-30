import sqlite3 from "sqlite3";
import { open } from "sqlite";

const dbfile = "moviemaker.db";

const conn = async () => {
  const db = await open({
    filename: dbfile,
    driver: sqlite3.Database,
  });
  const result = await db.get(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='users';"
  );
  if (result == undefined) {
    db.run(
      "CREATE TABLE users (guid TEXT NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL)"
    );
  }
  return db;
};

export default {
  async login(username, password) {
    let db = await conn();
    const result = await db.get(
      "SELECT guid, username, password FROM users WHERE username=:username and password=:password",
      { ":username": username, ":password": password }
    );
    db.close();
    return result;
  },

  async checkUser(username) {
    const db = await conn();
    const result = await db.get(
      "SELECT 1 FROM users where username=(?)",
      username
    );
    db.close();
    return result != undefined;
  },

  async registerUser(guid, username, password) {
    const db = await conn();
    const result = await db.run(
      "INSERT INTO users (guid, username, password) values (:guid, :username, :password)",
      { ":guid": guid, ":username": username, ":password": password }
    );
    db.close();
    return result != undefined;
  },
};
