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
      const words = await db.all('SELECT * FROM rustofin');
      res.status(200).json(words);
      break;
    }
    case 'POST': {
      const { word, translation, example } = req.body;
      if (!word || !translation || !example) {
        res.status(400).json({ error: 'Missing fields in request' });
        return;
      }
      const result = await db.run(
        'INSERT INTO rustofin (word, translation, example) VALUES (?, ?, ?)',
        [word, translation, example]
      );
      res.status(201).json({ id: result.lastID });
      break;
    }
    case 'PUT': {
      const { id, word, translation, example } = req.body;
      if (!id || !word || !translation || !example) {
        res.status(400).json({ error: 'Missing fields in request' });
        return;
      }
      await db.run(
        'UPDATE rustofin SET word = ?, translation = ?, example = ? WHERE id = ?',
        [word, translation, example, id]
      );
      res.status(200).json({ success: true });
      break;
    }
    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}
