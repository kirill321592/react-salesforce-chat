import { createStore, applyMiddleware, compose } from 'redux'
import { logger } from 'redux-logger'
import rootReducer from './reducers'

const initialState = {}
const enhancers = []
const middleware = []

if (process.env.NODE_ENV === 'development') {
  middleware.push(logger)
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers,
)

export default store
