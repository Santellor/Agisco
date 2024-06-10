import { Model, DataTypes } from 'sequelize';
import util from 'util';
import connectToDB from './db.js'

export const db = await connectToDB('postgresql:///agisco');

export class User extends Model {
    [util.inspect.custom]() {
        return this.toJSON();
    }
}

User.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    modelName: 'user',
    sequelize: db,
    timestamps: true,
    updatedAt: true,
  },
);

export class Preference extends Model {
    [util.inspect.custom]() {
        return this.toJSON();
    }
}

Preference.init(
  {
    preferenceId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    // userId 1 - 1 
        // User.hasOne(Preference, { foreignKey: 'userId' });
        // Preference.belongsTo(User, { foreignKey: 'userId' });
    darkMode: {
        type: DataTypes.BOOLEAN,
        default: false,
    },
    metric: {
        type: DataTypes.BOOLEAN,
        default: false,
    },
  },
  {
    modelName: 'preference',
    sequelize: db,
    timestamps: true,
    updatedAt: true,
  },   
);

export class Workout extends Model {
    [util.inspect.custom]() {
        return this.toJSON();
    }
}

Workout.init( 
  {
    workoutId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    workoutName: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    // userId 1 - many 
        // User.hasMany(Workout, { foreignKey: 'userId' });
        // Workout.belongsTo(User, { foreignKey: 'userId' });
    // workoutStep 1 - many 
        //Workout.hasMany(WorkoutStep, { foreignKey: 'workoutId' });
        //WorkoutStep.belongsTo(Workout, { foreignKey: 'workoutId' });
  },
  {
    modelName: 'workout',
    sequelize: db,
    timestamps: true,
    updatedAt: true,
  }, 
);

export class WorkoutStep extends Model {
    [util.inspect.custom]() {
        return this.toJSON();
    }
}

WorkoutStep.init(
  {
    workoutStepId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    // workoutId 1 - many 
        // relationship declared under Workout
    // exerciseId 1 - many 
        //Exercise.hasMany(WorkoutStep, { foreignKey: 'exerciseId' });
        //WorkoutStep.belongsTo(Exercise, { foreignKey: 'exerciseId' });
    sets: {
          type: DataTypes.INTEGER,
          allowNull: false,
    }, 
  },
  {
    modelName: 'workoutStep',
    sequelize: db,
    timestamps: true,
    updatedAt: true,
  },   
);

export class WorkoutInstance extends Model {
    [util.inspect.custom]() {
        return this.toJSON();
    }
}

WorkoutInstance.init(
  {
    instanceId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    // userId 1 - many 
        // User.hasMany(WorkoutInstance, { foreignKey: 'userId' });
        // WorkoutInstance.belongsTo(User, { foreignKey: 'userId' });
    // workoutId 1 - many 
        //Workout.hasMany(WorkoutInstance, { foreignKey: 'workoutId' });
        //WorkoutInstance.belongsTo(Workout, { foreignKey: 'workoutId' });
    // workoutStepDatum 1 - many 
        //Workout.hasMany(WorkoutStepDatum, { foreignKey: 'workoutId' });
        //WorkoutStepDatum.belongsTo(Workout, { foreignKey: 'workoutId' });
  },
  {
    modelName: 'workoutInstance',
    sequelize: db,
    timestamps: true,
    updatedAt: true,
  },  
);

export class WorkoutStepDatum extends Model {
    [util.inspect.custom]() {
        return this.toJSON();
    }
}

WorkoutStepDatum.init(
  {
    datumId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    // instanceId 1 - many
        //relationship declared under Workout Instance 
    // workoutStepId 1 - 1 
        // WorkoutStep.hasOne(WorkoutStepDatum, { foreignKey: 'workoutStepId' });
        // WorkoutStepDatum.belongsTo(WorkoutStep, { foreignKey: 'workoutStepId' });
    sets: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }, 
    weight: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }, 
    reps: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }, 
    time: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }, 
  },
  {
    modelName: 'workoutStepDatum',
    sequelize: db,
    timestamps: true,
    updatedAt: true,
  },
);

export class Goal extends Model {
    [util.inspect.custom]() {
        return this.toJSON();
    }
}

Goal.init(
  {
    goalId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
      // userId 1 - many 
        // User.hasMany(Goal, { foreignKey: 'userId' });
        // Goal.belongsTo(User, { foreignKey: 'userId' });
      // exerciseId 1 - many
        // Exercise.hasOne(Goal, { foreignKey: 'exerciseId' });
        // Goal.belongsTo(Exercise, { foreignKey: 'exerciseId' });
    sets: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }, 
    weight: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }, 
    reps: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }, 
    time: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
  }, 
  {
    modelName: 'goal',
    sequelize: db,
    timestamps: true,
    updatedAt: true,
  },
);

export class Exercise extends Model {
    [util.inspect.custom]() {
        return this.toJSON();
    }
}

Exercise.init(
  {
    exerciseId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }, 
    // userId 1 - many 
        // User.hasMany(Exercise, { foreignKey: 'userId' });
        // Exercise.belongsTo(User, { foreignKey: 'userId' });
    exerciseName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    chart: {
        type: DataTypes.STRING
    },
    videoLink: {
        type: DataTypes.STRING
    }, 
    // muscleGroup: 1 - many 
      // MuscleGroup.hasMany(Exercise, {foreignKey: 'groupId'})
      // Exercise.belongsTo(MuscleGroup, {foreignKey: 'groupId'})
    //Exercise Type
      // ExerciseType: 1 - many 
      // ExerciseType.hasMany(Exercise, {foreignKey: 'typeId'})
      // Exercise.belongsTo(ExerciseType, {foreignKey: 'typeId'})
  },
  {
    modelName: 'exercise',
    sequelize: db,
    timestamps: true,
    updatedAt: true,
  },
);

export class MuscleGroup extends Model {
    [util.inspect.custom]() {
        return this.toJSON();
    }
}

MuscleGroup.init(
  {
    groupId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }, 
    groupName: {
        type: DataTypes.STRING
    },
    groupDesc: {
        type: DataTypes.STRING
    }
  },
  {
    modelName: 'muscleGroup',
    sequelize: db,
    timestamps: true,
    updatedAt: true,
  },
);

export class ExerciseType extends Model {
    [util.inspect.custom]() {
        return this.toJSON();
    }
}

ExerciseType.init(
  {
    typeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }, 
    typeName: {
        type: DataTypes.STRING
    },
    typeDesc: {
        type: DataTypes.STRING
    }
  },
  {
    modelName: 'exerciseType',
    sequelize: db,
    timestamps: true,
    updatedAt: true,
  },
);

//Relationships

  //Preference
      // userId 1 - many 
        User.hasOne(Preference, { foreignKey: 'userId' });
        Preference.belongsTo(User, { foreignKey: 'userId' });

  //Workout
      // userId 1 - many 
        User.hasMany(Workout, { foreignKey: 'userId' });
        Workout.belongsTo(User, { foreignKey: 'userId' });

      // workoutStep 1 - many 
        Workout.hasMany(WorkoutStep, { foreignKey: 'workoutId' });
        WorkoutStep.belongsTo(Workout, { foreignKey: 'workoutId' });

  //WorkoutStep
      //exerciseId 1 - many 
        Exercise.hasMany(WorkoutStep, { foreignKey: 'exerciseId' });
        WorkoutStep.belongsTo(Exercise, { foreignKey: 'exerciseId' });

  //Workout Instance
      // userId 1 - many 
        User.hasMany(WorkoutInstance, { foreignKey: 'userId' });
        WorkoutInstance.belongsTo(User, { foreignKey: 'userId' });

      //workoutId 1 - many 
        Workout.hasMany(WorkoutInstance, { foreignKey: 'workoutId' });
        WorkoutInstance.belongsTo(Workout, { foreignKey: 'workoutId' });

      //workoutStepDatum 1 - many 
        WorkoutInstance.hasMany(WorkoutStepDatum, { foreignKey: 'instanceId' });
        WorkoutStepDatum.belongsTo(WorkoutInstance, { foreignKey: 'instanceId' });

  //WorkoutStepDatum
      //workoutStepId 1 - many 
        WorkoutStep.hasMany(WorkoutStepDatum, { foreignKey: 'workoutStepId' });
        WorkoutStepDatum.belongsTo(WorkoutStep, { foreignKey: 'workoutStepId' });

  //Goal
      //userId 1 - many 
        User.hasMany(Goal, { foreignKey: 'userId' });
        Goal.belongsTo(User, { foreignKey: 'userId' });
      //exerciseId 1 - many 
        Exercise.hasMany(Goal, { foreignKey: 'exerciseId' });
        Goal.belongsTo(Exercise, { foreignKey: 'exerciseId' });

  //Exercise
      //userId 1 - many 
        User.hasMany(Exercise, { foreignKey: 'userId' });
        Exercise.belongsTo(User, { foreignKey: 'userId' });

  //MuscleGroup
      // muscleGroup: 1 - many 
        MuscleGroup.hasMany(Exercise, {foreignKey: 'groupId'})
        Exercise.belongsTo(MuscleGroup, {foreignKey: 'groupId'})

  //Exercise Type
      // ExerciseType: 1 - many 
        ExerciseType.hasMany(Exercise, {foreignKey: 'typeId'})
        Exercise.belongsTo(ExerciseType, {foreignKey: 'typeId'})
      
      