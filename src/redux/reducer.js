
const initialState = {
  userId: null,
  workingOut: false,
  dark: false,
  metric: false,
  message: null,
  workoutId: 4,
  workoutName: 'user1 workout1',
  exerciseId: 2,
  groupId: 1,
  typeId: 1,
  instanceId: 1,
  workoutStepId: 1,
  goalId: 1
  
};

// front end components will dispatch an action object :
// { type: "USER_AUTH", payload: userId }
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_AUTH":
      return {
        ...state,
        userId: action.payload,
      };

      // triggered from front end with this dispatch action object: { type: "LOGOUT" }
    case "LOGOUT":
      return {
        ...state,
        userId: null,
      };

    case "UPDATE_RECORD_DEFAULTS":
      return {
        ...state,
        [action.target]: action.payload,
      };

    case "START_WORKOUT":
      return {
        ...state,
        workingOut: true,
      };

    case "END_WORKOUT":
      return {
        ...state,
        workingOut: false,
      };

    case "MESSAGE":
      return {
        ...state,
        message: action.payload,
      };

    case "DARK":
      return {
        ...state,
        dark: action.payload,
      };

    case "METRIC":
      return {
        ...state,
        metric: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
