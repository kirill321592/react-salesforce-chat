import actionTypes from './actionTypes'

export const setChannels = channels => ({
  type: actionTypes.SET_CHANNELS,
  channels,
})

export const setMessages = messages => ({
  type: actionTypes.SET_MESSAGES,
  messages,
})

export const setPreviewMessages = previewMessages => ({
  type: actionTypes.SET_PREVIEW_MESSAGES,
  previewMessages,
})

export const updatePreviewMessages = previewMessage => ({
  type: actionTypes.UPDATE_PREVIEW_MESSAGES,
  previewMessage,
})

export const addMessage = message => ({
  type: actionTypes.ADD_MESSAGE,
  message,
})

export const setChatInitialized = status => ({
  type: actionTypes.SET_CHAT_INITIALIZED,
  status,
})

export const addChannel = channel => ({
  type: actionTypes.ADD_CHANNEL,
  channel,
})

export const setSelectedChannel = channel => ({
  type: actionTypes.SET_SELECTED_CHANNEL,
  channel
})
