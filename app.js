// Import dependencies
import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import expressHandlebars from 'express-handlebars'
import path from 'path'
import dbconnection from './configuration/mongo.db.js'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

// Config dotenv
dotenv.config()

// Dirname for module type
const __dirname = path.dirname(new URL(import.meta.url).pathname);
console.log(__dirname);

// Constants
const port = process.env.PORT || 3000

// Express middleware, settings, cookie , json
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
app.use(cookieParser());

// Engine settings
app.engine('hbs', expressHandlebars({
    defaultLayout: 'main',
    extname: 'hbs',
    layoutsDir: path.join('views', 'layouts')
})) 
app.set('view engine', 'hbs')
app.set('views', 'views')


// Add routes
import adminRoutes from './routes/admin.routes.js'
import authRoutes from './routes/auth.routes.js'
import blogRoutes from './routes/blog.routes.js'
import mainRoutes from './routes/main.routes.js'

// Use routes
app.use('/admin', adminRoutes)
app.use('/auth', authRoutes)
app.use('/blog', blogRoutes)
app.use('/', mainRoutes)


// Start server async function
const start = async() =>{
    try {
        console.log('Server is pending....');
        // Waiting for DB connection
        await dbconnection
        console.log('Connected to database');
        setTimeout(() => {
            app.listen(port, ()=>{console.log(`Server started on port ${port} `);}) 
        }, 1000);
    } catch (error) {
        console.log(error);
        setTimeout(() => {
            start() 
        }, 3000);
    }
}
start()