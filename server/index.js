const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId, Timestamp } = require('mongodb')
const jwt = require('jsonwebtoken')

const port = process.env.PORT || 5000

// middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())

// Verify Token Middleware
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token
  console.log(token)
  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' })
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).send({ message: 'unauthorized access' })
    }
    req.user = decoded
    next()
  })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.28i6f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

const dbConnect = async () => {
  try {
    client.connect();
    console.log("Database Connected Successfully✅");

  } catch (error) {
    console.log(error.name, error.message);
  }
}
dbConnect()

app.get('/', (req, res) => {
  res.send('Hello from StayVista Server..')
})

// auth related api
app.post('/jwt', async (req, res) => {
  const user = req.body
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '365d',
  })
  res
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    })
    .send({ success: true })
})
// Logout
app.get('/logout', async (req, res) => {
  try {
    res
      .clearCookie('token', {
        maxAge: 0,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      })
      .send({ success: true })
    console.log('Logout successful')
  } catch (err) {
    res.status(500).send(err)
  }
})

//collections
const rooms = client.db("stay-vista").collection('rooms')
const usersCollection = client.db("stay-vista").collection('users')

// save a user to DB 
app.put('/user', async (req, res) => {
  const user = req.body
  const query = { email: user?.email }

  const isExist = await usersCollection.findOne(query)
  if (isExist) {
    if (user.status === 'requested') {
      const result = await usersCollection.updateOne(query, { $set: { status: user?.status } })
      res.send(result)
    }
    else {
      return res.send(isExist)
    }
  }

  const option = { upsert: true }
  const updateDoc = {
    $set: {
      ...user,
      timestamp: Date.now()
    }
  }
  const result = await usersCollection.updateOne(query, updateDoc, option)
  res.send(result)
})

// get all users data
app.get('/users', async (req, res) => {
  const result = await usersCollection.find().toArray()
  res.send(result)

})

// get a user by email
app.get('/user/:email', async (req, res) => {
  const email = req.params.email
  const query = { email }
  const result = await usersCollection.findOne(query)
  res.send(result)
})

app.get('/rooms', async (req, res) => {
  const category = req.query.category
  let query = {}
  if (category && category !== 'null') {
    query = { category };
  }
  const reslut = await rooms.find(query).toArray()
  res.send(reslut);
})

app.post('/rooms', async (req, res) => {
  const roomData = req.body;
  const result = await rooms.insertOne(roomData)
  res.send(result)
})

app.get('/room/:id', async (req, res) => {
  const id = req.params.id
  const query = { _id: new ObjectId(id) }

  const reslut = await rooms.findOne(query)
  res.send(reslut)
})


// show room in my listing
app.get('/my-listings/:email', async (req, res) => {
  const email = req.params.email;
  const query = { 'host.email': email }

  const result = await rooms.find(query).toArray()
  res.send(result)
})

//delete a room
app.delete('/room/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await rooms.deleteOne(query)
  res.send(result)
})

app.listen(port, () => {
  console.log(`StayVista is running on port ${port}`)
})
