const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fmqfn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

async function run() {
	try {
		await client.connect();
		const database = client.db('foodOrder');
		const ordersCollection = database.collection('orders');
		const productsCollection = database.collection('products');

		//GET products api
		app.get('/products', async (req, res) => {
			const cursor = productsCollection.find({});
			const products = await cursor.toArray();
			res.send(products);
		});

		//GET api
		app.get('/orders', async (req, res) => {
			const cursor = ordersCollection.find({});
			const orders = await cursor.toArray();
			res.send(orders);
		});

		//POST api
		app.post('/orders', async (req, res) => {
			const order = req.body;
			console.log('hit the post', order);
			const result = await ordersCollection.insertOne(order);
			console.log(result);
			res.json(result);
		});

		//DELETE api
		app.delete('/orders/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await ordersCollection.deleteOne(query);
			res.json(result);
		});
	} finally {
		// await client.close();
	}
}

run().catch(console.dir);

app.get('/', (req, res) => {
	res.send('Hello');
});

app.listen(port, () => {
	console.log('Running server', port);
});
