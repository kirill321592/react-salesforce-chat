import actionTypes from './actionTypes'

const initialState = {
  channels: [],
  messages: [],
  previewMessages: {},
}

const ChatReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_CHANNELS: {
      return { ...state, channels: action.channels }
    }

    case actionTypes.SET_MESSAGES: {
      return { ...state, messages: action.messages }
    }

    case actionTypes.ADD_MESSAGE: {
      return {
        ...state,
        messages: [...state.messages, action.message]
      }
    }

    case actionTypes.SET_PREVIEW_MESSAGES: {
      return {
        ...state,
        previewMessages: {
          ...state.previewMessages,
          ...(action.previewMessages[0] && { [action.previewMessages[0].channelName]: action.previewMessages[0] }),
        },
      }
    }

    case actionTypes.UPDATE_PREVIEW_MESSAGES: {
      return {
        ...state,
        previewMessages: {
          ...state.previewMessages,
          [action.previewMessage.channelName]: action.previewMessage,
        },
      }
    }

    case actionTypes.SET_CHAT_INITIALIZED: {
      return { ...state, chatInitialized: action.status }
    }

    case actionTypes.ADD_CHANNEL: {
      return { ...state, channels: [...state.channels, action.channel] }
    }

    case actionTypes.SET_SELECTED_CHANNEL: {
      return { ...state, selectedChannel: action.channel }
    }

    default: {
      return state
    }
  }
}

export default ChatReducer
