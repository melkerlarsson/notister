import { Reducer } from 'redux';
import { UserAction } from './userActions';
import { User } from 'firebase/auth';

export type UserState = {
  user: User | null
}

const INITIAL_STATE: UserState = {
  user: null
}


const userReducer: Reducer<UserState, UserAction> = (state: UserState = INITIAL_STATE, action: UserAction): UserState => {

  switch (action.type) {
    case "SET_USER":
      return { 
        ...state,
        user: action.payload
      }

    case "SIGN_OUT_USER":
      return {
        ...state,
        user: null
      }
    default: 
      return state;
  }
}

export default userReducer;