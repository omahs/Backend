var fs = require('fs')

var express = require('express')
var cors = require('cors')
require('dotenv').config()
let logger = require('morgan')
let cookieParser = require('cookie-parser')
let path = require('path')

const package = require('./package.json')
var bodyParser = require('body-parser')

let corsOptions = {
    origin: 'https://localhost', // Compliant
}

let app = express()
app.disable('x-powered-by')
app.use(cors(corsOptions))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/assets', express.static('public'))
app.set('view engine', 'ejs')

app.use(bodyParser.json({ limit: '4mb' }))
app.use(bodyParser.urlencoded({ limit: '4mb', extended: true }))
app.use(cors())

let host
if (process.env.NODE_ENV == 'testnet') {
    host = process.env.BASEURL
} else if (process.env.NODE_ENV == 'local') {
    host = process.env.BASEURLLOCAL
} else {
    host = process.env.BASEURL_MAINNET
}

const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API for node-satt',
        version: package.version,
        description:
            'Welcome to SaTT Webservice endpoint, this backend provides webservice to SaTT WebWallet and advertising campaign manager',
        customCss: '.swagger-ui .topbar { display: none }',
    },
    host: host,
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
}
var cssOptions = {
    customCss: `
    .topbar-wrapper img {content:url(/assets/SaTT.png); width:50px; height:auto;}`,
    customSiteTitle: 'SaTT',
    customfavIcon: '/assets/SaTT-noire.png',
}
const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
}
const swaggerSpec = swaggerJSDoc(options)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, cssOptions))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app
