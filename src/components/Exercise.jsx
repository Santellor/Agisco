import React from 'react'

const Exercise = (step, exercise, goal, quit, next, back, currentDataRecord) => {

    console.log(step, exercise, goal, quit, next, back, currentDataRecord)


  return (
    <>
    <p> Exercise #{step.relativePosition} - {exercise.exerciseName} Sets: {step.sets} </p>

    <p> img = {exercise.chart} </p>

    <p> vid = {exercise.videoLink}</p>
    <p> muscle group: {exercise.muscleGroup.groupName} exercise type: {exercise.exerciseType.typeName}</p>

    <p> weight = {goal.weight}  reps = {goal.reps}  total sets = {goal.sets}  time = {goal.time} mins </p>

    <button onClick={(quit)}>quit</button>
    <button onClick={(next)}>next</button>
    <button onClick={(back)}>back</button>

    {currentDataRecord}
    </>
  )
}

export default Exercise