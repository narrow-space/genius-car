const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
//midleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6uzmb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");





        //GET APi

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
             
        app.get('/hellow',(req,res)=>{
            res.send('hellow hy i am imran')
        })




        //Get a single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query)
            res.json(service)
        })

        // post api

        app.post('/services', async (req, res) => {
            const service = req.body
            console.log('hit the post', service);

            const result = await servicesCollection.insertOne(service)
            console.log(result);
            res.json(result)

        });

        //Delete Api

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.deleteOne(query)
            res.json(result)


        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World! this is genius car mechanics')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})