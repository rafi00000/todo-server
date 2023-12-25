const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;
require('dotenv').config()


// middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://console.firebase.google.com"],
  })
);
app.use(express.json());

const uri =`${process.env.MONGO_URI}`;

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

    app.get("/task/:email", async (req, res) => {
       const email = req.params.email;
       const query = {email: email};
       console.log(email)
       const result = await taskCollection.find(query).toArray();
       console.log(result)
       res.send(result);
    });

    app.get("/task/single/:id", async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await taskCollection.findOne(query);
      res.send(result);
    })

    app.post("/task", async (req, res) => {
      const data = req.body;
      // console.log(data);
      const result = await taskCollection.insertOne(data);
      res.send(result);
    });

    app.delete("/task/:id", async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    })

    app.put("/task/:id",async(req, res) =>{
      const id = req.params.id;
      const doc = req.body;
      console.log(doc)
      const query = {_id: new ObjectId(id)};
      const updateDoc = {
        $set: {
          title: doc.title,
          description: doc.description,
          deadline: doc.deadline,
          priority: doc.priority,
        }
      };
      const result = await taskCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    app.patch("/task/:id", async(req, res) =>{
      const id = req.params.id;
      const doc = req.body;
      console.log(doc, id)
      const query = {_id: new ObjectId(id)};
      const updateDoc = {
        $set: {
          status: doc.status
        }
      }
      const result = await taskCollection.updateOne(query, updateDoc);
      res.send(result);
    })

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
