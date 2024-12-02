const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

app.get('/', (req, res) => {
    res.json({ message: 'The Joy of Painting API is running!' });
});

// Filter episodes based on query parameters
app.get('/episodes', async (req, res) => {
  const { month, subjects, colors, match } = req.query;

  let baseQuery = `
      SELECT e.EpisodeID, e.EpisodeName, e.BroadcastDate
      FROM Episodes e
      LEFT JOIN Subjects s ON e.EpisodeID = s.EpisodeID
      LEFT JOIN Colors c ON e.EpisodeID = c.EpisodeID
      WHERE 1=1
  `;

  const queryParams = [];
  const conditions = [];

  // Filter by broadcast month
  if (month) {
      conditions.push("EXTRACT(MONTH FROM e.BroadcastDate) = $1");
      queryParams.push(month);
  }

  // Filter by subjects
  if (subjects) {
      const subjectList = subjects.split(',');
      if (match === 'AND') {
          conditions.push(
              `e.EpisodeID IN (
                  SELECT EpisodeID FROM Subjects WHERE Subject IN (${subjectList.map(
                      (_, i) => `$${queryParams.length + i + 1}`
                  ).join(',')})
                  GROUP BY EpisodeID HAVING COUNT(DISTINCT Subject) = ${subjectList.length}
              )`
          );
      } else {
          conditions.push(
              `s.Subject IN (${subjectList.map((_, i) => `$${queryParams.length + i + 1}`).join(',')})`
          );
      }
      queryParams.push(...subjectList);
  }

  // Filter by colors
  if (colors) {
      const colorList = colors.split(',');
      if (match === 'AND') {
          conditions.push(
              `e.EpisodeID IN (
                  SELECT EpisodeID FROM Colors WHERE ColorName IN (${colorList.map(
                      (_, i) => `$${queryParams.length + i + 1}`
                  ).join(',')})
                  GROUP BY EpisodeID HAVING COUNT(DISTINCT ColorName) = ${colorList.length}
              )`
          );
      } else {
          conditions.push(
              `c.ColorName IN (${colorList.map((_, i) => `$${queryParams.length + i + 1}`).join(',')})`
          );
      }
      queryParams.push(...colorList);
  }

  // Add conditions to the base query
  if (conditions.length > 0) {
      baseQuery += ` AND (${conditions.join(' AND ')})`;
  }

  try {
      const result = await pool.query(baseQuery, queryParams);
      res.json(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch episodes.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
