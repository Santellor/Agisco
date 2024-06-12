import bcryptjs from 'bcryptjs'
import { loadRecords, addRecord, removeRecord, editRecord} from "../database/queries.js"
import { 
    db, 
    User, 
    Preference, 
    Workout, 
    WorkoutInstance, 
    WorkoutStepDatum, 
    WorkoutStep, 
    Goal,
    Exercise,
    MuscleGroup,
    ExerciseType
    } from '../database/model.js'

// this object stores all Models, so that they can be referenced by the string delivered by the request parameters
const models = { 
    users: User , 
    preferences: Preference,
    workouts: Workout,
    workout_instances: WorkoutInstance,
    workout_step_data: WorkoutStepDatum,
    workout_steps: WorkoutStep,
    goals: Goal,
    exercises: Exercise,
    muscle_groups: MuscleGroup,
    exercise_types: ExerciseType
    }

const handlerFunctions = {
// Get to gather data and send it to the browser
    load: async (req, res) => {
        // determine which model to access with a reference, and get our filter data
        const { modelRef , filterQueryString } = req.params; 
        const filterParams = new URLSearchParams(filterQueryString)

        //process filter data
        let filter;
        if (filterQueryString) {
            filter = {
                column : filterParams.get(`column`),
                value : filterParams.get(`value`),
                offset : filterParams.get(`offset`),
                order : filterParams.get(`order`),
            }
        } else {
            filter = {}
        }     
        
        //test request structure before returning
        if (!models[modelRef]) {
            res.status(404).send({ 
                message: `Error404: endpoint does not exist, model ${modelRef} not mapped`,
                success: false 
            })
            return
        }

        // reference db through a query and return all records
        res.status(200).send(await loadRecords(models[modelRef], filter));
    },

// Post to add a new item
    add: async (req, res) => { 
        const { modelRef } = req.params;
        const { entry }  = req.body;
        
        //test request structure before returning
        if (!entry) {
            res.status(400).send({
                message: `Error400: bad request, entry not specified`,
                success: false
                });
            return
        }
        
        //adds to DB
        addRecord(models[modelRef], entry)
        res.status(200).send({
            message:`entry:${entry} added`,
            success: true});
    },

// Delete to remove an item
    remove: async (req, res) => {
        const { modelRef, id } = req.params;

        //test request structure before returning
        if (!id) {
            res.status(400).send({
                message:`Error400: bad request, id not specified`,
                success: false});
            return
        }
        
        //removes from DB with the specified id
        await removeRecord(models[modelRef], id);
        res.status(200).send({
            message:`id:${id} removed`,
            success: true,
        });
        
    },

// Put to remove the old value of a record and add an updated one
    edit: async (req, res) => {
        const { modelRef, id } = req.params;
        const { entry }  = req.body

        //test request structure before returning
        if (!id) {
            res.status(400).send({
                message:`Error400: bad request, id not specified`,
                success: false
            });
            return
        }

        if (!entry) {
            res.status(400).send({
                message: `Error400: bad request, entry not specified`,
                success: false
            });
            return
        }
        
        //removes from DB with the specified id
        await editRecord(models[modelRef], id, entry);
        // reference db through a query and return all records
        res.status(200).send({
            success: true,
            id: id,
        })
        
    },

    register: async (req, res ) => {
        // destructure data from front end request
        const { email, password1, password2 } = req.body

        // if username exists, fail request
        if (await User.findOne({ where: { email : email } })) {
            res.send({
                message: `account with email: ${email} exists`,
                success: false
            })
            return 
        }

        // if passwords do not match, fail request
        if (password1 !== password2 ) {
            res.send({
                message: `passwords must match`,
                success: false
            })
            return 
        }

        // hash password, store that in place of vanilla password, then save the user to the DB
        const hashedPassword = bcryptjs.hashSync(password1, bcryptjs.genSaltSync())

        await User.create ({
            email: email,
            password: hashedPassword
        })
        res.send({
            message: `user created successfully - please login with your credentials`,
            success: true
        })
    },

    login: async (req, res) => {
        // pull data from front end request
        const { email, password } = req.body;

        // create a User model instance where the email is correct
        const userAttempt = await User.findOne({
            where: {
                email: email
            }
        });

        // check for a correct password and existing user. if either are wrong, reject request
        if (!userAttempt || !bcryptjs.compareSync(password, userAttempt.password)) {
            res.send({
              message: 'invalid credentials',
              success: false,
            })
        } else {
        // assign this attempt as correct and save the userId, then pass that to the front end to be saved there
            req.session.userId = userAttempt.userId
            res.send({
                message: `${userAttempt.email} was logged in!`,
                success: true, 
                userId: req.session.userid
            });
        }   

    },

    logout: async(req, res) => {
        req.session.destroy()
    
        res.send({
          message: "user logged out",
          success: true
        })
        return
      },

      sessionCheck: async (req, res) => {
        
        if (req.session.userId) {         
            res.send({
                message: "user is still logged in",
                success: true,
                userId: req.session.userId
            })
            return
        } else { 
            res.send({
                message: "no user logged in",
                success: false,
            })
            return
        }
      },
}

export default handlerFunctions