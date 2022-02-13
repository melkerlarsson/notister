import { User } from "firebase/auth"

export type UserAction  = 
  | { type: "SET_USER"; payload: User | null }
  | { type: "SIGN_OUT_USER" }

export const setUser = (user: User | null): UserAction => {
  return ({
    type: "SET_USER",
    payload: user
  })
}

export const signOutUser = (): UserAction => {
  return ({
    type: "SIGN_OUT_USER"
  })
}

export const removeTodo = () => {

}