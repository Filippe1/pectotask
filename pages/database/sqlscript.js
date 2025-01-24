const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

function loadJsonToRustofin(jsonFile, dbFile) {
    // Open SQLite database or create it if it doesn't exist
    let db = new sqlite3.Database(dbFile, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        }
    });

    // Read JSON data
    let data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

    // Create table if it doesn't exist
    let createTableQuery = `
        CREATE TABLE IF NOT EXISTS rustofin (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            word TEXT,
            translation TEXT,
            example TEXT
        )
    `;
    db.run(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
            return;
        }

        // Prepare insert statement
        let insertQuery = `INSERT INTO rustofin (word, translation, example) VALUES (?, ?, ?)`;
        let stmt = db.prepare(insertQuery);

        // Insert data into table
        data.forEach(row => {
            let word = row.wordFirstLang || '';
            let translation = row.wordSecondLang || '';
            let example = '';

            if (row.sentenceFirstLang && row.sentenceSecondLang) {
                example = `${row.sentenceFirstLang} - ${row.sentenceSecondLang}`;
            }

            stmt.run(word, translation, example, (err) => {
                if (err) {
                    console.error('Error inserting row:', err.message);
                }
            });
        });

        // Finalize statement and close database after all insertions are done
        stmt.finalize((err) => {
            if (err) {
                console.error('Error finalizing statement:', err.message);
            }
            db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err.message);
                } else {
                    console.log('Database operation completed successfully.');
                }
            });
        });
    });
}

// Usage
const jsonFile = './pages/database/data.json';  // Path to your JSON file
const dbFile = './pages/database/rustofin.db';  // SQLite database file


loadJsonToRustofin(jsonFile, dbFile);
