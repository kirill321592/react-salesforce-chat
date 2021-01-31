import { combineReducers } from 'redux'
import chatReducer from 'containers/Chat/reducer'

export default combineReducers({
  chat: chatReducer,
})
