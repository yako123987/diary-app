const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(express.urlencoded({ extended: true }));

// データベースを開く
const db = new sqlite3.Database("diary.db");

// 日記を保存するテーブルを作る
db.run(`
  CREATE TABLE IF NOT EXISTS diaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    diary TEXT
  )
`);

// トップページ
app.get("/", (req, res) => {
  db.all("SELECT * FROM diaries", (err, rows) => {
    let diaryList = "";

    rows.forEach((row) => {
      diaryList += `<li>${row.diary}</li>`;
    });

    res.send(`
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <title>ひとこと日記アプリ</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            text-align: center;
            padding: 40px;
          }

          .container {
            background: white;
            max-width: 500px;
            margin: auto;
            padding: 30px;
            border-radius: 10px;
          }

          input {
            padding: 10px;
            width: 65%;
            border: 1px solid #ccc;
            border-radius: 5px;
          }

          button {
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }

          ul {
            list-style: none;
            padding: 0;
          }

          li {
            background: #f0f0f0;
            margin: 10px 0;
            padding: 10px;
            border-radius: 5px;
          }
        </style>
      </head>

      <body>
        <div class="container">
          <h1>📔 ひとこと日記</h1>

          <form action="/diary" method="POST">
            <input
              type="text"
              name="diary"
              placeholder="今日のひとこと"
              required
            >

            <button type="submit">投稿</button>
          </form>

          <h2>日記一覧</h2>

          <ul>
            ${diaryList}
          </ul>
        </div>
      </body>
      </html>
    `);
  });
});

// 日記を投稿
app.post("/diary", (req, res) => {
  const diary = req.body.diary;

  db.run(
    "INSERT INTO diaries (diary) VALUES (?)",
    [diary],
    () => {
      res.redirect("/");
    }
  );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`サーバーを起動しました: ${PORT}`);
});