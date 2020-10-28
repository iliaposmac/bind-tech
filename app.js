// Import dependencies
import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import exprHbs from 'express-handlebars'
import path from 'path'
import dbconnection from './configuration/mongo.db.js'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'
import helmet from 'helmet'
// Dirname for module type
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Constants
const port = process.env.PORT || 3000

// Create hbs settings
const hbs = exprHbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

// Express middleware, settings
const app = express()
app.use(morgan('common'))
app.use(cors({
    origin: [process.env.HOSTNAME],
    methods: ["GET", "POST", "DELETE", "PATCH"]
}))
app.use(compression())
app.use(helmet())
app.use(express.static(__dirname+'/public'))
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json())

// Engine settings
app.use('hbs',hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


// Add routes
import adminRoutes from './routes/admin.routes.js'
import authRoutes from './routes/auth.routes.js'
import blogRoutes from './routes/blog.routes.js'
import mainRoutes from './routes/main.routes.js'

// Use routes
app.use('/', adminRoutes)
app.use('/', authRoutes)
app.use('/', blogRoutes)
app.use('/', mainRoutes)

const start = async() =>{
    try {
        console.log('Server is pending....');
        await dbconnection
        console.log('Connected to database');
        setTimeout(() => {
            app.listen(port, ()=>{console.log(`Server started on port ${port} `);}) 
        }, 500);
    } catch (error) {
        console.log(error);
        setTimeout(() => {
            start() 
        }, 3000);
    }
}
start()