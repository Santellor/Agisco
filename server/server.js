// imports
    import express from 'express'
    import ViteExpress from 'vite-express'
    import handlerFunctions from './controller.js'

// express instance
    const app = express()
    const port = 4012

// middleware
    app.use(express.json())

// endpoints
const {load, add, remove, edit, } = handlerFunctions

    // obtains database info
    // app.get('/api/load/:modelRef/:filter', load)
    app.get('/api/load/:modelRef/:filterQueryString', load)

    // adds new data to the db
    app.post('/api/add/:modelRef', add)

    // deletes data located with an id
    app.delete('/api/remove/:modelRef/:id', remove)

    // edits existing data located with an id
    app.put('/api/edit/:modelRef/:id', edit)

// open server
    ViteExpress.listen(app, port, ()=> console.log('Agisco is ready to help - http://localhost:4012'))
