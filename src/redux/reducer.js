const initialState = {
  userId: null,
  workingOut: false,
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

    default:
      return state;
  }
};

export default reducer;
