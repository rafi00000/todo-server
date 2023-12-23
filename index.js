const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json());

const uri =
  "mongodb+srv://rafi2021bd:koajaibona1@cluster0.irfnbkn.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const taskCollection = client.db("TODODb").collection("todo");

    app.get("/task", async (req, res) => {
      const email = req.query.email;
      const status = req.query.st;
      console.log(status);
      let result;
      if (email) {
        result = await taskCollection.find({ email: email }).toArray();
      } else {
        result = await taskCollection.find().toArray();
      }
      res.send(result);
    });

    app.post("/task", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await taskCollection.insertOne(data);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/erro
  }
}
run().catch(console.dir);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
