const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://admin:Admin@cluster0.ezb7aqf.mongodb.net/?retryWrites=true&w=majority";
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

    // post Data
    app.post("/data", async (req, res) => {
      const data = req.body;
      const result = await scheduleDataCollection.insertMany(data);
      res.send(result);
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
