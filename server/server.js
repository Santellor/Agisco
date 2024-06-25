// imports
    import express from 'express'
    import morgan from 'morgan'
    import session from 'express-session'
    import ViteExpress from 'vite-express'
    import handlerFunctions from './controller.js'

// express instance
    const app = express()
    const port = 4012

// middleware
    app.use(morgan("dev"));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(
        session({
            secret: "JUST...DO IT",
            saveUninitialized: false,
            resave: false,
        })
    );

// endpoints
const {load, add, remove, edit, login, logout, register, sessionCheck, fieldDropdown, tableDropdown, workoutList, workoutSteps } = handlerFunctions

    // obtains database info
    // app.get('/api/load/:modelRef/:filter', load)
    app.get('/api/load/:modelRef/:filterQueryString', load)

    // adds new data to the db
    app.post('/api/add/:modelRef', add)

    // deletes data located with an id
    app.delete('/api/remove/:modelRef/:id', remove)

    // edits existing data located with an id
    app.put('/api/edit/:modelRef/:id', edit)

    app.get('/api/field_dropdown/:modelRef', fieldDropdown)

    app.get('/api/get_workouts/', workoutList)
    
    app.get('/api/get_workout_steps/:workoutId', workoutSteps)

    // handle login / logout
    app.get("/api/session-check", sessionCheck);
    app.post("/api/login", login);
    app.get("/api/logout", logout);
    app.post("/api/register", register);


// open server
    ViteExpress.listen(app, port, ()=> console.log('Agisco is ready to help - http://localhost:4012'))
