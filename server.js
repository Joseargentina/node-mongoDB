import express from 'express'
import { connectToMongoDB, disconnectFromMongoDB } from './src/mongodb.js'
const app = express()
const PORT = process.env.PORT ?? 3000
app.disable('x-powered-by')

// Midleware
app.use(express.json())
// app.use((req, res, next) => {
//   res.header('Content-Type', 'application/json; charset=utf8')
//   next()
// })

// Ruta principal
app.get('/', (req, res) => {
  res.status(200).send('Bienvenidos a nuestra API  de frutas')
})

app.get('/frutas', async (req, res) => {
  const client = await connectToMongoDB()
  if (!client) {
    res.status(500).send('Error al conectarse a la DB')
    return
  }
  try {
    const db = client.db('Productos')
    const frutas = await db.collection('frutas').find().toArray()
    !frutas ? res.status(404).send('No se encontraron frutas') : res.json(frutas)
  } catch (error) {
    res.status(500).send('Error al obtener las frutas')
  } finally {
    await disconnectFromMongoDB()
  }
})

app.get('/frutas/id/:id', async (req, res) => {
  const client = await connectToMongoDB()
  if (!client) {
    res.status(500).send('Error al conectarse a la DB')
    return
  }
  try {
    const id = parseInt(req.params.id) || 0
    const db = client.db('Productos')
    const fruta = await db.collection('frutas').findOne({ id: { $eq: id } })
    !fruta ? res.status(404).json(`No se encontro la fruta con el id: ${id}`) : res.json(fruta)
  } catch (error) {
    res.status(500).send('Error al obtener la fruta')
  } finally {
    await disconnectFromMongoDB()
  }
})

app.get('/frutas/importe/:precio', async (req, res) => {
  const client = await connectToMongoDB()
  if (!client) {
    res.status(500).send('Error al conectarse a la DB')
    return
  }
  try {
    const precio = parseFloat(req.params.precio) || 0
    const db = client.db('Productos')
    const frutaEncontrada = await db.collection('frutas').find({ importe: { $eq: precio } }).toArray()
    !frutaEncontrada ? res.status(404).json(`No se encontro fruta con el precio: ${precio}`) : res.json(frutaEncontrada)
  } catch (error) {
    res.status(500).send('Error a obtener fruta por el precio')
  } finally {
    await disconnectFromMongoDB()
  }
})

app.get('/frutas/nombre/:nombre', async (req, res) => {
  const nombre = req.params.nombre
  const client = await connectToMongoDB()
  if (!client) {
    res.status(500).send('Error al conectarse a MongoDB')
    return
  }
  // try {

  // } catch (error) {

  // } finally {
  //   await disconnectFromMongoDB()

  // }
  const db = client.db('Productos')
  const frutaNombre = await db.collection('frutas').find({ nombre: { $regex: new RegExp('^' + nombre + '$', 'i') } }).toArray()

  !frutaNombre ? res.status(404).json(`No se encontro la fruta con el nombre: ${nombre}`) : res.json(frutaNombre)
})

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})
