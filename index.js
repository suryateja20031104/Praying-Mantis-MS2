const express = require("express");
const path = require("path");
const cors = require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(cors());
app.use(express.json());
const dbPath = path.join(__dirname, "userDetails.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3002, () => {
      console.log("Server Running at http://localhost:3002/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

app.get("/userDetailsGet/", async (request, response) => {
  const getUserQuery = `
    SELECT
      *
    FROM
      userdetails
    ;`;
  const userArray = await db.all(getUserQuery);
  response.send(userArray);
});

app.post("/userDetailsAdd/", async (request, response) => {
  const userDetails = request.body;
  const { username, email, age, location } = userDetails;
  const addUser = `
    INSERT INTO
      userdetails (username,email,age,location)
    VALUES
      (
        '${username}',
        '${email}',
         ${age},
        '${location}'
      );`;

  const dbResponse = await db.run(addUser);
  const userId = dbResponse.lastID;
  response.send({ userId: userId });
});
