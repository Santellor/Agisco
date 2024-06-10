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

import users from './json/users.json' assert { type: 'json' };
import preferences from './json/preferences.json' assert { type: 'json' };
import workouts from './json/workouts.json' assert { type: 'json' };
import workoutInstances from './json/workout_instances.json' assert { type: 'json' };
import workoutStepData from './json/workout_step_data.json' assert { type: 'json' };
import workoutSteps from './json/workout_steps.json' assert { type: 'json' };
import goals from './json/goals.json' assert { type: 'json' };
import exercises from './json/exercises.json' assert { type: 'json' };
import muscleGroups from './json/muscle_groups.json' assert { type: 'json' };
import exerciseTypes from './json/exercise_types.json' assert { type: 'json' };

console.log(`establishing connection to db`);
await db.sync({ force: true});

console.log(`Seeding db`);

await Promise.all(users.map( async (user) => {
        // destructure keys from user and preferences
        const {email, password } = user;

        //create a record using the values provided 
        const record = User.create({
            email,
            password,
        });

        return record;

    })
)

await Promise.all(preferences.map( async (preference) => {
        // destructure keys 
        const { userId, darkMode, metric } = preference;

        //create a record using the values provided 
        const record = Preference.create({
            userId,
            darkMode,
            metric,
        });

        return record;

    })
)

await Promise.all(muscleGroups.map( async (muscleGroup) => {
    // destructure keys 
    const { groupName, groupDesc, } = muscleGroup;

    //create a record using the values provided 
    const record = MuscleGroup.create({
        groupName,
        groupDesc, 
    });

    return record;

})
)

await Promise.all(exerciseTypes.map( async (exerciseType) => {
    // destructure keys 
    const { typeName, typeDesc, } = exerciseType;

    //create a record using the values provided 
    const record = ExerciseType.create({
        typeName,
        typeDesc, 
    });

    return record;

})
)

    
await Promise.all(exercises.map( async (exercise) => {
    // destructure keys 
    const { userId, exerciseName, chart, videoLink, groupId, typeId } = exercise;

    //create a record using the values provided 
    const record = Exercise.create({
        userId,
        exerciseName,
        chart, 
        videoLink,
        groupId, 
        typeId
    });

    return record;

})
)

await Promise.all(workouts.map( async (workout) => {
        // destructure keys 
        const { workoutName, userId } = workout;

        //create a record using the values provided 
        const record = Workout.create({
            workoutName,
            userId,
        });

        return record;

    })
)

await Promise.all(workoutInstances.map( async (workoutInstance) => {
        // destructure keys 
        const { workoutId, userId, time } = workoutInstance;
 
        //create a record using the values provided 
        const record = WorkoutInstance.create({
            workoutId,
            userId,
            time,
        });

        return record;

    })
)

await Promise.all(workoutSteps.map( async (workoutStep) => {
        // destructure keys 
        const { workoutId, exerciseId, sets } = workoutStep;

        //create a record using the values provided 
        const record = WorkoutStep.create({
            workoutId,
            exerciseId,
            sets,
        });

        return record;

    })
)
    
await Promise.all(workoutStepData.map( async (workoutStepDatum) => {
        // destructure keys 
        const { instanceId, workoutStepId, sets, weight, reps, time  } = workoutStepDatum;

        //create a record using the values provided 
        const record = WorkoutStepDatum.create({
            instanceId,
            workoutStepId,
            sets,
            weight,
            reps, 
            time
        });

        return record;

    })
)
    
await Promise.all(goals.map( async (goal) => {
        // destructure keys 
        const { userId, exerciseId, sets, weight, reps, time } = goal;

        //create a record using the values provided 
        const record = Goal.create({
            userId,
            exerciseId,
            sets,
            weight,
            reps, 
            time
        });

        return record;

    })
)
    
await db.close()