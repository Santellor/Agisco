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

import { loadRecords, addRecord, removeRecord, editRecord} from "../database/queries.js"

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

        console.log(filter)
        
        
        //test request structure before returning
        let success = true
        if (!models[modelRef]) {
            res.status(404).send(`Error404: endpoint does not exist, model ${modelRef} not mapped`)
            success = false
            }

        // reference db through a query and return all records
        if (success) res.status(200).send(await loadRecords(models[modelRef], filter));
    },

// Post to add a new item
    add: async (req, res) => { 
        const { modelRef } = req.params;
        //req.body.entry : obj , req.body.filter : obj
        const { entry }  = req.body
        
        //test request structure before returning
        let success = true

        if (!entry) {
            res.status(400).send(`Error400: bad request, entry not specified `)
            success = false
        }
        
        if (success) {
             //adds to DB, then return all records
            addRecord(models[modelRef], entry)
            res.status(200).send({success: true});
        }
    },

// Delete to remove an item
    remove: async (req, res) => {
        const { modelRef, id } = req.params;

        //test request structure before returning
        let success = true

        if (!id) {
            res.status(400).send(`Error400: bad request, id not specified `)
            success = false
        }
        
        if (success) {
             //removes from DB with the specified id
             await removeRecord(models[modelRef], id);
            // reference db through a query and return all records
            res.status(200).send({
                success: true,
                id: id
            });
        }
    },

// Put to remove the old value of a record and add an updated one
    edit: async (req, res) => {
        const { modelRef, id } = req.params;
        const { entry }  = req.body

        //test request structure before returning
        let success = true
        if (!models[modelRef]) {
            res.status(404).send(`Error404: endpoint does not exist, model ${modelRef} not mapped`)
            success = false
        }

        if (!id) {
            res.status(400).send(`Error400: bad request, id not specified `)
            success = false
        }

        if (!entry) {
            res.status(400).send(`Error400: bad request, entry not specified `)
            success = false
        }
        
        if (success) {
            //removes from DB with the specified id
            await editRecord(models[modelRef], id, entry);
            // reference db through a query and return all records
            res.status(200).send({
                success: true,
                id: id,
            })
        }
    }
}

export default handlerFunctions