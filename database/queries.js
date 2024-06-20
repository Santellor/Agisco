import { Op } from 'sequelize'
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
} from './model.js'

const includeRefs = {
    users: [],
    preferences: [{
            model: User,
            attributes:['email']
}],
    workouts: [{
            model: User,
            attributes:['email']
}],
    workout_steps: [{
            model: Workout,
            attributes:['workoutName']
        }, {
            model: Exercise,
            attributes:['exerciseName']
}],
    workout_instances: [{
            model: User,
            attributes:['email']
        }, {
            model: Workout,
            attributes:['workoutName']
}],
    workout_step_data: [
        {
            model: WorkoutStep,
            attributes:['relativePosition'],
}],
    goals: [{
            model: User,
            attributes:['email']
    }, {
            model: Exercise,
            attributes:['exerciseName']
}],
    exercises: [{
            model: User,
            attributes:['email']
    }, {
            model: MuscleGroup,
            attributes:['groupName']
    }, {
            model: ExerciseType,
            attributes:['typeName']
}],
    muscle_groups: [],
    exercise_types: [],
}

//load a table using a model and an optional filter object
    // the filter object dictates: column, value, order, and offset
const loadRecords = async (model, modelRef, filter) => {

    //declare variables to be used in our findAll
    let search, offset, order
   
    //check for filter columns and values. if they do not exist, return an empty search
    console.log(`typeof`, typeof filter.value)
    console.log(`filter column`,  filter.column)
    if( filter.column && typeof filter.value === 'string') {
        search = {[filter.column] : {
        [Op.substring] : [filter.value]}
        } 
    } else if (filter.column && filter.value) {
        search = {[filter.column] : [filter.value]}
    } else {
        search = {}
    }
   
    //apply a default for offset and order if they are not specified
    console.log(`filter offset`, filter.offset)
    offset = +filter.offset ?? 0
    order = filter.order ?? 'updatedAt'
    console.log(`modelRef`, modelRef)
    console.log(`includeRefs`, includeRefs[modelRef])
    console.log(`includeRefs.User`, includeRefs.users)
    
    //return the desired table, limiting, offsetting, and ordering as dictated by the filter
    let loadData = await model.findAll({
        where: search,
        include: includeRefs[modelRef],
        limit: 20,
        offset: offset,
        order: db.col(order)
    })

    return loadData
}

//examples
    // console.log(await loadRecords(User))
    // console.log(await loadRecords(Exercise, {column:'userId', value:'1'}))
    // console.log(await loadRecords(Goal, {column:'reps', value:'8', offset: 4}))

//add a record using a table model reference and an entry object
    //the entry object carries the correct key value pairs to input data
    //let exEntry = {username: example, password: test}
const addRecord = async (model, entry) => {

    console.log(`entry`, entry)
    
    const addedRecord = await model.create(entry) 
    return addedRecord
}

// addRecord(User, {email: `claudia@claudia.com`, password: `whatever`})
//remove a record using a table model reference, and the id of the record to be deleted
const removeRecord = async (model, id) => {
    
    const targetRecord = await model.findByPk(id)

    return targetRecord ? await targetRecord.destroy() : console.log(`record at id:${id} does not exist`);
}

//edit a record using a table model reference, a reference id, and an entry object
    //the entry object carries the correct key value pairs to replace existing data
    //let exEntry = {password: I made a new password}
const editRecord = async (model, id, entry) => {
    
    console.log('id', id)

    const targetRecord = await model.findByPk(id)

    return await targetRecord.update(entry)
}

const loadFieldDropdown = async (model) => {

    let attributeSource = await model.findOne({})
    attributeSource = Object.values(attributeSource)[0]
    console.log(`raw attribute`, attributeSource)
    let attribute = Object.keys(attributeSource).slice(0,2)
    console.log(`full attribute`, attribute)
    
    let optionsObj = await model.findAll({
        attributes: attribute
    }) 
    
    let optionsArray = Object.values(optionsObj)

    let finalOptions = []
    for (let result of optionsArray) {
    console.log(`result`, result)
    result = Object.values(Object.values(result)[0])
    finalOptions.push(result)
    }
    
    console.log(`options`, optionsArray)

     return finalOptions
}

const loadTableDropdown = async (model) => {

    console.log(model)

    let attributeSource = await model.findOne({})
    attributeSource = Object.values(attributeSource)[0]
    console.log(`raw attribute`, attributeSource)
    let attribute = Object.keys(attributeSource).slice(0,2)
    console.log(`full attribute`, attribute)
    
    let optionsObj = await model.findAll({
        attributes: attribute
    }) 
    
    let optionsArray = Object.values(optionsObj)

    let finalOptions = []
    for (let result of optionsArray) {
    console.log(`result`, result)
    result = Object.values(Object.values(result)[0])
    finalOptions.push(result)
    }
    
    console.log(`options`, optionsArray)

     return finalOptions
}

export { loadRecords, addRecord, removeRecord, editRecord, loadFieldDropdown, loadTableDropdown}

// await db.close()

