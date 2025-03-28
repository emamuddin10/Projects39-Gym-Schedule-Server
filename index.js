const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

// seassion
// bbU3s9G9g61b6xFT

const uri =
  "mongodb+srv://seassion:bbU3s9G9g61b6xFT@cluster0.v28xn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
   
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const scheduleCollection = client.db("scheduleDB").collection('schedule')
    
    app.get('/schedule', async (req, res) => {
      const { searchParams } = req.query;
    
      let option = {};
      if (searchParams) {
        option = { title: { $regex: searchParams, $options: "i" } }; 
      }
    
      const result = await scheduleCollection.find(option).toArray();
      res.send(result);
    });
    

    app.post("/schedule", async (req, res) => {
      const data = req.body;
      console.log(data)
      const result = await scheduleCollection.insertOne(data)
      console.log(result)
      res.send(result)
    });
    
    // PATCH 
    app.patch('/schedule/:id', async(req,res)=>{
      const id = req.params.id
      const data = res.body
      console.log(data)
      const filter = {_id: new ObjectId(id)}
      const update ={
        $set:{
           title: data?.title,
           date: data?.date,
           day: data?.day,
           time: data?.time
        }
      }
      const options = { upsert: true };
      const result = await scheduleCollection.updateOne(filter,update,options)
      res.send(result)

    })
    
    // isComplate
    app.patch('/status/:id', async(req,res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const update ={
        $set:{
          isCompleted:true
        }
      }
      const options = { upsert: true };
      const result = await scheduleCollection.updateOne(filter,update,options)
      res.send(result)

    })
    // get for update schedule
    app.get('/schedule/:id',async(req,res)=>{
      
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await scheduleCollection.findOne(query)
      res.send(result)
    })
    // delete
    app.delete('/schedule/:emamid',async(req,res)=>{
      const id = req.params.emamid
      const query = {_id: new ObjectId(id)}
      const result = await scheduleCollection.deleteOne(query)
      res.send(result)
    })


    
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("the appcation is runnig");
});

app.listen(port, () => {
  console.log(`the local server is runing is port: ${port}`);
});
