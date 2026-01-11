import { File, Directory, Paths } from "expo-file-system";
import { Asset } from "expo-asset";
import * as SQLite from "expo-sqlite";

const DB_NAME = "dictionary.db";
const DB_ASSET = require("../../assets/database/dictionary.db");

let dbConnection = null;

/**
 * Returns an open database connection
 */
export async function getDb() {
  if (!dbConnection) {
    throw new Error("Database not initialized. Call initializeDatabaseConnection first.");
  }
  return dbConnection;
}

/**
 * Initializes the SQLite database:
 * - Ensures SQLite directory exists
 * - Copies preloaded DB from assets if missing
 * - Opens DB
 * - Runs a sanity check query
 */
export async function initializeDatabaseConnection() {
  try {
    console.log("Initializing database...");

    // Ensure SQLite directory exists
    const sqliteDir = new Directory(Paths.document.uri + "SQLite/");
    if (!sqliteDir.exists) {
      console.log("Creating SQLite directory...");
      sqliteDir.create();
    }

    const dbFile = new File(Paths.document.uri + `SQLite/${DB_NAME}`);

    // Copy DB from assets if it does not exist
    if (!dbFile.exists) {
      console.log("Database not found locally. Copying from assets...");

      const asset = Asset.fromModule(DB_ASSET);
      if (!asset.downloaded) {
        await asset.downloadAsync();
      }

      const assetFile = new File(asset.localUri);
      assetFile.copy(dbFile);

      console.log("Database copied successfully.");
    } else {
      console.log("Database already exists locally.");
    }

    // Close existing connection if any (prevents leaks/conflicts on reload)
    if (dbConnection) {
      try {
        await dbConnection.closeAsync();
      } catch (e) {
        console.warn("Error closing existing database:", e);
      }
      dbConnection = null;
    }

    // Open DB using modern async API with new connection option
    dbConnection = await SQLite.openDatabaseAsync(DB_NAME, { useNewConnection: true });
    console.log("Database opened.");

    // Create favorites table if it doesn't exist
    await dbConnection.execAsync(`
      CREATE TABLE IF NOT EXISTS favorites (
        wordId TEXT PRIMARY KEY,
        term TEXT NOT NULL,
        partOfSpeech TEXT,
        definition TEXT
      );
    `);
    console.log("Favorites table checked/created.");

    // Create history table if it doesn't exist
    await dbConnection.execAsync(`
      CREATE TABLE IF NOT EXISTS history (
        wordId TEXT PRIMARY KEY,
        term TEXT NOT NULL,
        partOfSpeech TEXT,
        definition TEXT,
        timestamp INTEGER NOT NULL
      );
    `);
    console.log("History table checked/created.");

    // Sanity check: confirm DB is readable and has tables
    const result = await dbConnection.getAllAsync(
      `SELECT name FROM sqlite_master WHERE type='table' LIMIT 1;`
    );

    if (!result || result.length === 0) {
      throw new Error("Database opened but contains no tables.");
    }

    console.log("Database sanity check passed:", result[0].name);
    return true;

  } catch (error) {
    console.error("DATABASE INIT FAILED:", error);
    throw error;
  }
}
