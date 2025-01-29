const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const dbFile = './pages/database/rustofin.db';
const jsonFile = './pages/database/data.json';

function loadJsonToSqlite(jsonFile, dbFile, tableName) {
    // Open SQLite database or create it if it doesn't exist
    let db = new sqlite3.Database(dbFile);

    // Read JSON data
    let data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

    // Define table structure
    let createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
            id INTEGER PRIMARY KEY,
            wordFirstLang TEXT,
            sentenceFirstLang TEXT,
            wordSecondLang TEXT,
            sentenceSecondLang TEXT
        )
    `;
    db.run(createTableQuery, (err) => {
        if (err) {
            console.error("Error creating table:", err.message);
            return;
        }

        console.log("Table created or already exists.");

        // Prepare insert statement
        let insertQuery = `
            INSERT INTO ${tableName} (id, wordFirstLang, sentenceFirstLang, wordSecondLang, sentenceSecondLang)
            VALUES (?, ?, ?, ?, ?)
        `;
        let stmt = db.prepare(insertQuery);

        // Insert data into table
        data.forEach(row => {
            stmt.run(row.id, row.wordFirstLang, row.sentenceFirstLang, row.wordSecondLang, row.sentenceSecondLang, (err) => {
                if (err) {
                    console.error("Error inserting row:", err.message);
                }
            });
        });

        // Finalize statement and close database
        stmt.finalize(() => {
            db.close(() => {
                console.log("Database connection closed.");
            });
        });
    });
}

// Usage
//const jsonFile = 'data.json';  
// Path to your JSON file
//const dbFile = 'rustofin.db';  
// SQLite database file
const tableName = 'rustofin';  // Desired table name in the database

loadJsonToSqlite(jsonFile, dbFile, tableName);
