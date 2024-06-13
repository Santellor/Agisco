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
    User: [],
    Preference : [User],
    Workout: [User],
    WorkoutStep: [Workout, Exercise],
    WorkoutInstance: [User, Workout],
    WorkoutStepDatum: [WorkoutInstance, WorkoutStep],
    Goal: [User, Exercise],
    Exercise: [User, MuscleGroup, ExerciseType],
    MuscleGroup: [],
    ExerciseType: [],
}

//load a table using a modelRef and an optional filter object
    // the filter object dictates: column, value, order, and offset
const loadRecords = async (modelRef, filter) => {

    //declare variables to be used in our findAll
    let search, offset, order
   
    //check for filter columns and values. if they do not exist, return an empty search
    if (filter.column && filter.value) {
        search = {[filter.column] : [filter.value]}
    } else {
    search = {}
    }
   
    //apply a default for offset and order if they are not specified
    offset = +filter.offset ?? 0
    order = filter.order ?? 'updatedAt'
    
    //return the desired table, limiting, offsetting, and ordering as dictated by the filter
    let loadData = await modelRef.findAll({
        // where: search,
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
const addRecord = async (modelRef, entry) => {
    
    const addedRecord = await modelRef.create(entry) 
    return addedRecord
}

// addRecord(User, {email: `claudia@claudia.com`, password: `whatever`})
//remove a record using a table model reference, and the id of the record to be deleted
const removeRecord = async (modelRef, id) => {
    
    const targetRecord = await modelRef.findByPk(id)

    return targetRecord ? await targetRecord.destroy() : console.log(`record at id:${id} does not exist`);
}

//edit a record using a table model reference, a reference id, and an entry object
    //the entry object carries the correct key value pairs to replace existing data
    //let exEntry = {password: I made a new password}
const editRecord = async (modelRef, id, entry) => {
    
    const targetRecord = await modelRef.findByPk(id)

    return await targetRecord.update(entry)
}

export { loadRecords, addRecord, removeRecord, editRecord}

// await db.close()

