import { MongoClient } from 'mongodb'

process.loadEnvFile() // cargar los archivos .env

const URI = process.env.MONGODB_URLSTRING
const client = new MongoClient(URI)

export async function connectToMongoDB () {
  try {
    await client.connect()
    console.log('Conectado a Mongo DB')
    return client
  } catch (error) {
    console.error('Error al conectar Mongo DB : ', Error)
    return null
  }
}

export async function disconnectFromMongoDB () {
  try {
    await client.close()
    console.log('Desconectado de Mongo DB')
  } catch (error) {
    console.error('Error al desconectar de Mongo DB : ', Error)
  }
}
