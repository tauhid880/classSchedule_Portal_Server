const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ezb7aqf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    // Database Collection

    const usersCollection = client.db("scheduleApp").collection("Users");
    const scheduleDataCollection = client
      .db("scheduleApp")
      .collection("scheduleData");
    const messagesCollection = client.db("scheduleApp").collection("Messages");

    //create users
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    //get users
    app.get("/users", async (req, res) => {
      const email = req.query.email;
      const query = { email };
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    });

    // post schedule Data
    app.post("/schedules", async (req, res) => {
      const data = req.body;
      const result = await scheduleDataCollection.insertMany(data);
      res.send(result);
    });

    // get schedule Data
    app.get("/schedules", async (req, res) => {
      const Faculty_Email = req.query.Faculty_Email;
      const query = { Faculty_Email };
      const schedules = await scheduleDataCollection.find(query).toArray();
      res.send(schedules);
    });

    // Post messages
    app.post("/messages", async (req, res) => {
      const messages = req.body;
      // const createdAt = new Date();
      const result = await messagesCollection.insertOne(messages);
      res.send(result);
    });

    //get user-wise messages
    app.get("/messages", async (req, res) => {
      // const email = req.query.email;
      const query = {};
      const messages = await messagesCollection.find(query).toArray();
      res.send(messages);
    });
  } finally {
  }
}

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
