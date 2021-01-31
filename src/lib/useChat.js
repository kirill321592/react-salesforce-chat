import {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from 'react'
import { connect } from 'react-redux'
import {
  setChannels,
  setMessages,
  setPreviewMessages,
  updatePreviewMessages,
  addMessage,
  setChatInitialized,
  addChannel,
  setSelectedChannel,
} from 'containers/Chat/actions'

const ChatContext = createContext({})

import Chat from 'twilio-chat/lib'

const ChatWrapper = ({
  children,
  setChannels,
  setMessages,
  setPreviewMessages,
  updatePreviewMessages,
  addMessage,
  setChatInitialized,
  chatInitialized,
  addChannel,
  selectedChannel,
  setSelectedChannel,
}) => {
  const [clientInstance, setClientInstance] = useState()
  const channelRef = useRef()

  useEffect(() => {
    channelRef.current = selectedChannel
  }, [selectedChannel])

  useEffect(() => {
    if (!chatInitialized) {
      const AccessToken = require('twilio').jwt.AccessToken
      const ChatGrant = AccessToken.ChatGrant

      const twilioAccountSid = 'AC000f83d97a607c665d283787f86b0a38'
      const twilioApiKey = 'SKb5c74061d965996685c5d3df5cd7c347'
      const twilioApiSecret = 'ilaUdFrGD35PUqLVuuzNrBQ3ihPdIlcp'

      const serviceSid = 'IS3121ea5db43e4750a911aa120d890067'
      const identity = 'sf-user'

      const chatGrant = new ChatGrant({
        serviceSid: serviceSid,
      })

      const token = new AccessToken(
        twilioAccountSid,
        twilioApiKey,
        twilioApiSecret,
        { identity: identity },
      )

      token.addGrant(chatGrant)

      Chat.create(token.toJwt()).then(client => {
        client.on('tokenAboutToExpire', () => {
          const updatedToken = new AccessToken(
            twilioAccountSid,
            twilioApiKey,
            twilioApiSecret,
            { identity: identity }
          )

          updatedToken.addGrant(chatGrant)
          client.updateToken(updatedToken.toJwt())
        })

        client
          .getSubscribedChannels()
          .then(paginator => {
            channelsFilter(paginator.items).map(channel => {
              channel._events.messageAdded = []

              channel._events.messageAdded[0] = message => {
                onMessageAddedParser(message, updatePreviewMessages)

                if (channelRef.current?.uniqueName === channel.uniqueName) {
                  onMessageAddedParser(message, addMessage)
                }
              }
            })
          })

        setClientInstance(client)
        setChatInitialized(true)
      })
    }
  }, [])

  const channelsFilter = channels => (
    channels.filter(({ uniqueName }) => {
      if (window.context === 'Property') {
        const regex = new RegExp(`${window.externalId}$`, 'g');

        return uniqueName.match(regex)
      } else {
        const regex = new RegExp(`_${window.externalId}_`, 'g');

        return uniqueName.match(regex)
      }
    })
  )

  const getUserName = message => (
    message.getMember().then(member => member.getUser().then(user => user.friendlyName)).catch(() => 'Rentality')
  )

  const parseMessage = async message => {
    const author = await getUserName(message)

    if (message.type === 'media') {
      let mediaUrl

      await message.media.getContentTemporaryUrl().then(url => mediaUrl = url)

      return { ...message.state, channelName: message.channel.channelState.uniqueName, mediaUrl, author }
    }

    return { ...message.state, channelName: message.channel.channelState.uniqueName, author }
  }

  const onMessageAddedParser = async (message, setter) => {
    const author = await getUserName(message)

    if (message.type === 'media') {
      message.media.getContentTemporaryUrl().then(mediaUrl => {
        setter({ ...message.state, channelName: message.channel.channelState.uniqueName, mediaUrl, author })
      })
    } else {
      setter({ ...message.state, channelName: message.channel.channelState.uniqueName, author })
    }
  }

  const getChannelsWithPreview = () => {
    clientInstance.getSubscribedChannels().then(paginator => {
      const filteredChannels = channelsFilter(paginator.items)

      filteredChannels.forEach((channel, index) => {
        channel.getMessages(1).then(channelMsg => {
          Promise.all(channelMsg.items?.map(parseMessage)).then(setPreviewMessages)
        })
      })
      setChannels(filteredChannels)
    })
  }

  const getChannelMessages = (channel, uniqueName = undefined) => {
    if (channel) {
      channel.getMessages().then(channelMsg => {
        Promise.all(channelMsg.items?.map(parseMessage)).then(messages => {
          setMessages(messages)
        })
      })
    } else {
      clientInstance
        .getChannelByUniqueName(uniqueName)
        .then(channel => {
          channel.getMessages().then(channelMsg => {
            Promise.all(channelMsg.items?.map(parseMessage)).then(messages => {
              setMessages(messages)
            })
          })
        })
    }
  }

  const inviteListener = () => {
    clientInstance.on('channelInvited', channel => {
      channel.join().then(() => {
        if (channelsFilter([channel]).length > 0) {
          channel.getMessages(1).then(channelMsg => {
            Promise.all(channelMsg.items?.map(parseMessage)).then(setPreviewMessages)
          })

          channel._events.messageAdded = []

          channel._events.messageAdded[0] = message => {
            onMessageAddedParser(message, updatePreviewMessages)

            if (channelRef.current?.uniqueName === channel.uniqueName) {
              onMessageAddedParser(message, addMessage)
            }
          }

          addChannel(channel)
        }
      })
    })
  }

  return (
    <ChatContext.Provider
      value={{
        getChannelsWithPreview,
        getChannelMessages,
        inviteListener,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

const mapStateToProps = ({ chat: { chatInitialized, selectedChannel } }) => ({
  chatInitialized,
  selectedChannel,
})

const mapDispatchToProps = {
  setChannels,
  setMessages,
  setPreviewMessages,
  updatePreviewMessages,
  addMessage,
  setChatInitialized,
  addChannel,
  setSelectedChannel,
}

export const ChatProvider = connect(mapStateToProps, mapDispatchToProps)(ChatWrapper)

const useChat = () => useContext(ChatContext)

export default useChat
