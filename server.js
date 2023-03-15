import express from 'express'
import mongoose, {Schema} from 'mongoose'

const port = 3030
const server = express()

server.use(express.json({limit: '100MB'}))

const user = "lightdust7797"
const password = '6D3rk4vxvoaAn3Fc'
const uri = `mongodb+srv://${user}:${password}@cluster0.6cepqv5.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(uri, {dbName: 'fullstack22'}).then((result, error) => {
    if (result) console.info('connected to mongodb atlas cluster')
    else if (error) console.error(error)
})

const dishSchema = new Schema({
    name: String,
    price: String,
})

const menuSchema = new Schema({
    starters: [dishSchema],
    mains: [dishSchema],
    desserts: [dishSchema],
})

const restaurantsSchema = new Schema({
    name: String,
    hours: {},
    menu: menuSchema,
})


if (!mongoose.models.restaurants) {
    mongoose.model('restaurants', restaurantsSchema)
}

server.get('/rest/restaurants', async (request, response) => {
    const restaurants = await mongoose.models.restaurants.find()
    if (restaurants && restaurants.length !== 0) {
        response.json(restaurants)
    }
    else {
        response.sendStatus(404)
    }
})

server.post('/rest/restaurants', async (request, response) => {
    const restaurant = new mongoose.models.restaurants()
    restaurant.name = request.body.name
    restaurant.menu = request.body.menu
    await restaurant.save()
    response.sendStatus(201)
})

server.delete('/rest/restaurants/:_id', async (request, response) => {
    const result = await mongoose.models.restaurants.findByIdAndDelete(request.params._id)
    response.json(result)
})

server.patch('/rest/restaurants/:restaurant/:dish', async (request, response) => {
    const restaurant = await mongoose.models.restaurants.findById(request.params.restaurant)
    const dish = restaurant.menu.starters.id(request.params.dish)
    dish.name = request.body.name ?? dish.name
    dish.price = request.body.price ?? dish.price
    await dish.save()
    response.json(dish)
})
server.patch('/rest/restaurants/:_id', async (request, response) => {
    const restaurant = await mongoose.models.restaurants.findById(request.params._id)
    restaurant.name = request.body.name ?? restaurant.name
    restaurant.menu = request.body.menu ?? restaurant.menu
    await restaurant.save()
    response.json(restaurant)
})

server.listen(port, () => {
    console.info(`Server started on: http://localhost:${port}`)
})