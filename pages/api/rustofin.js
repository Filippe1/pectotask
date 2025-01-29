// pages/api/rustofin.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function openDb() {
  return open({
    filename: './pages/database/rustofin.db',
    driver: sqlite3.Database,
  });
}

export default async function handler(req, res) {
  const db = await openDb();

  switch (req.method) {
    case 'GET': {
      try {
        const words = await db.all('SELECT * FROM rustofin');
        res.status(200).json(words);
      } catch (error) {
        res.status(500).json({ error: 'Database query failed' });
      }
      break;
    }

    case 'POST': {
      const { id, wordFirstLang, sentenceFirstLang, wordSecondLang, sentenceSecondLang } = req.body;

      if (!id || !wordFirstLang || !sentenceFirstLang || !wordSecondLang || !sentenceSecondLang) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }

      try {
        await db.run(
          `INSERT INTO rustofin (id, wordFirstLang, sentenceFirstLang, wordSecondLang, sentenceSecondLang) 
           VALUES (?, ?, ?, ?, ?)`,
          [id, wordFirstLang.trim(), sentenceFirstLang.trim(), wordSecondLang.trim(), sentenceSecondLang.trim()]
        );

        res.status(201).json({ success: true, id });
      } catch (error) {
        res.status(500).json({ error: 'Failed to insert data' });
      }
      break;
    }

    case 'PUT': {
      const { id, wordFirstLang, sentenceFirstLang, wordSecondLang, sentenceSecondLang } = req.body;

      if (!id) {
        res.status(400).json({ error: 'ID is required' });
        return;
      }

      try {
        await db.run(
          `UPDATE rustofin 
           SET wordFirstLang = ?, sentenceFirstLang = ?, wordSecondLang = ?, sentenceSecondLang = ? 
           WHERE id = ?`,
          [wordFirstLang.trim(), sentenceFirstLang.trim(), wordSecondLang.trim(), sentenceSecondLang.trim(), id]
        );

        res.status(200).json({ success: true });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update data' });
      }
      break;
    }

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}
