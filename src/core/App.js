import { useEffect } from 'react'
import { Provider, connect } from 'react-redux'
import { Form, Field } from 'react-final-form'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import useChat, { ChatProvider } from 'lib/useChat'
import TextArea from 'formAdapters/TextArea'
import GradientText from 'components/GradientText'
import ChatAttachmentPreview from 'components/ChatAttachmentPreview'
import Thread from 'components/Thread'
import WidgetParser from 'components/WidgetParser'
import ChatTitle from 'components/ChatTitle'
import { setSelectedChannel } from 'containers/Chat/actions'
import store from './store'
import 'antd/dist/antd.css'
import 'react-datepicker/dist/react-datepicker.css'
import './styles.css'

dayjs.extend(relativeTime)

const Threads = ({
  channels,
  previewMessages,
  messages,
  chatInitialized,
  setSelectedChannel,
  selectedChannel,
}) => {
  const { getChannelsWithPreview, inviteListener } = useChat()

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      window.context = 'Property'
      window.external_id = '2348' // property id
    }

    if (chatInitialized) {
      getChannelsWithPreview()
      inviteListener()
    }
  }, [chatInitialized])

  return (
      <>
        {!selectedChannel && (
          <div className="threads-col">
            {channels?.map(({
              uniqueName,
              friendlyName,
              lastMessage,
              mediaUrl,
              media,
              channelState,
            }, index) => {
              const message = previewMessages?.[uniqueName]

              return (
                <div key={uniqueName} className="threads-item">
                  <div className="threads-item__row">
                    <div className="threads-item__avatar">
                      <img src={channelState?.attributes?.imagePreview} alt="" />
                    </div>
                    <div className="threads-col">
                      <div className="threads-item__row-title">
                        <div
                          className="threads-item__title"
                          onClick={() => {
                            setSelectedChannel(channels[index])
                          }}
                        >
                          <ChatTitle attributes={channelState?.attributes} friendlyName={friendlyName} />
                        </div>
                        <div className="threads-item__col-title">
                          <div className="threads-item__total">
                            {message?.index >= 0 ? message.index + 1 : 0} messages total
                          </div>
                          <div className="threads-item__date">
                            {dayjs(message?.timestamp).fromNow()}
                          </div>
                        </div>
                      </div>
                      <div className="threads-item__author">
                        {message?.author === 'Support' ? 'You' : message?.author}
                        <div className="threads-item__date mobile-only">
                          {dayjs(message?.timestamp).fromNow()}
                        </div>
                      </div>
                      <div className="threads-item__text">
                        {message?.body}
                      </div>
                      <ChatAttachmentPreview {...message} />
                      <WidgetParser
                        body={message?.body}
                        attributes={message?.attributes}
                        channel={channels[index]}
                      />
                      <Form
                        onSubmit={({ message }, form) => {
                          channels[index].sendMessage(message)
                          setTimeout(form.reset)
                        }}
                        render={({
                          handleSubmit,
                          submitting,
                          values,
                        }) => (
                          <form onSubmit={handleSubmit} className="threads-reply-form">
                            <div className="threads-reply-form__container">
                              <Field
                                component={TextArea}
                                name="message"
                                placeholder="Your reply..."
                                autoSize
                              />
                              {values.message && (
                                <button
                                  className="threads-reply-form__submit"
                                  type="submit"
                                  disabled={submitting}
                                >
                                  <GradientText>Send</GradientText>
                                </button>
                              )}
                            </div>
                          </form>
                        )}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {selectedChannel && (
          <Thread
            channel={selectedChannel}
            messages={messages}
            clearChannel={() => setSelectedChannel()}
          />
        )}
      </>

  )
}

const mapStateToProps = ({
  chat: {
    channels,
    previewMessages,
    messages,
    chatInitialized,
    selectedChannel,
  },
}) => ({
  channels,
  previewMessages,
  messages,
  chatInitialized,
  selectedChannel,
})


const Asd = connect(mapStateToProps, { setSelectedChannel })(Threads)

const App = () => (
  <Provider store={store}>
    <ChatProvider>
      <Asd />
    </ChatProvider>
  </Provider>
)

export default App
