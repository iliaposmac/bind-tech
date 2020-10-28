import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const URL = `mongodb+srv://${process.env.ROOT}:${process.env.ROOT_PASS}@cluster0.hiwhy.mongodb.net/BINDTECH?retryWrites=true&w=majority`
const dbconnection = mongoose.connect(URL, {useNewUrlParser:  true, useUnifiedTopology: true})

export default dbconnection