import { useRef, useState, useEffect } from 'react'
import { Form, Field } from 'react-final-form'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import TextArea from 'formAdapters/TextArea'
import Input from 'formAdapters/Input'
import Breadcrumbs from 'components/Breadcrumbs'
import Dropzone from 'components/DropZone'
import Button from 'components/Button'
import GradientText from 'components/GradientText'
import ChatAttachmentPreview from 'components/ChatAttachmentPreview'
import Modal from 'components/Modal'
import WidgetParser from 'components/WidgetParser'
import ChatTitle from 'components/ChatTitle'
import useChat from 'lib/useChat'
import request from 'utils/request'
import attachIcon from 'assets/images/attach.svg'
import './styles.css'

dayjs.extend(relativeTime)

const Thread = ({
  clearChannel,
  booked,
  channel,
  messages,
}) => {
  const { getChannelMessages } = useChat()
  const [modalVisible, setModalVisible] = useState()
  const [selectedWidget, setSelectedWidget] = useState()
  const [services, setServices] = useState()

  useEffect(() => {
    getChannelMessages(channel)
    request.post('', {
      query: '{ services { name displayUrl description } }'
    }).then(res => setServices(res.data.data.services))
  }, [])

  useEffect(() => {
    document?.querySelector?.('#root')?.scrollTo({ top: 100000, behavior: 'smooth' })
  }, [messages.length])

  const renderModalContent = () => {
    switch (selectedWidget) {
      case 'service': {
        return (
          <div className="serivce-container">
            <div className="modal-title">Offer a service</div>
            <Breadcrumbs text="Back" callback={() => setSelectedWidget()} />
            {services?.map(({ name, description, displayUrl }) => (
              <Button
                className="modal-choose-btn"
                onClick={() => {
                  setModalVisible(false)
                  setSelectedWidget()
                  channel.sendMessage('', {
                    widgetType: 'service',
                    serviceDescription: description,
                    servicePhoto: displayUrl,
                  })
                }}
                key={name}
              >
                <GradientText>{name}</GradientText>
              </Button>
            ))}
          </div>
        )
      }

      case 'payment': {
        return (
          <Form
            onSubmit={async ({ paymentId }, form) => {
              try {
                const { data: { amount } } = await request.get(`${process.env.REACT_APP_BILLING_API}payment/${channel.createdBy}/${paymentId}`)

                channel.sendMessage('', { widgetType: 'payment', paymentId, amount })
                setModalVisible(false)
                setSelectedWidget()
                setTimeout(form.reset)
              } catch (e) {
                if (e?.response?.status === 404) {
                  return { paymentId: 'Doesn`t exist' }
                }
              }
            }}
            render={({ handleSubmit, submitting }) => (
              <form onSubmit={handleSubmit} className="payment-form">
                <div className="modal-title">Payment</div>
                <Breadcrumbs text="Back" callback={() => setSelectedWidget()} />
                <Field
                  name="paymentId"
                  component={Input}
                  placeholder="Payment id"
                  validate={value => value ? undefined : 'Required'}
                />
                <Button type="submit" withGradient>Send</Button>
              </form>
            )}
          />
        )
      }

      default: {
        return (
          <div>
            <div className="modal-title">Send a widget</div>
            <Button className="modal-choose-btn" onClick={() => setSelectedWidget('service')}>
              <GradientText>Offer a service...</GradientText>
            </Button>
            <Button
              className="modal-choose-btn"
              onClick={() => {
                setModalVisible(false)
                channel.sendMessage('', { widgetType: 'calendar' })
              }}
            >
              <GradientText>Date and time picker</GradientText>
            </Button>
            <Button className="modal-choose-btn" onClick={() => setSelectedWidget('payment')}>
              <GradientText>Payment</GradientText>
            </Button>
          </div>
        )
      }
    }
  }

  return (
    <>
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
      >
        {renderModalContent()}
      </Modal>
      <div className="profile-container">
        <div className="thread-row">
          <div className="thread-col">
            <div className="thread-breadcrumbs">
              <Breadcrumbs text="Back to messages" callback={clearChannel} />
              <div className="thread-count">
                {`${[...messages].pop()?.index >= 0 ? [...messages].pop()?.index + 1 : 0} messages total`}
              </div>
              <div className="thread-count mobile-only">
                {`${[...messages].pop()?.index >= 0 ? [...messages].pop()?.index + 1 : 0} msg total`}
              </div>
            </div>
            <div className="thread-title">
              <ChatTitle attributes={channel.attributes} friendlyName={channel.friendlyName} />
            </div>
            {messages?.map(({
              author,
              text,
              timestamp,
              body,
              mediaUrl,
              media,
              sid,
              attributes,
            }) => (
              <div className={`thread-item ${author === 'Support' && 'thread-item_my'}`} key={sid}>
                <div className="thread-item__row">
                  <div className="thread-item__author">{author === 'Support' ? 'You' : author}</div>
                  <div className="thread-item__date">{dayjs(timestamp).fromNow()}</div>
                </div>
                {body && <div className="thread-item__text">{body}</div>}
                <div className="thread-item__drops">
                  <ChatAttachmentPreview mediaUrl={mediaUrl} media={media} />
                </div>
                <WidgetParser
                  body={body}
                  attributes={attributes}
                  channel={channel}
                />
              </div>
            ))}
            <Form
              onSubmit={({ message, image }, form) => {
                if (message) {
                  channel.sendMessage(message)
                }
                image?.map(({ file, fileType, clearFile }) => {
                  const formData = new FormData

                  formData.append('file', clearFile)
                  channel.sendMessage(formData)
                })

                setTimeout(form.reset)
              }}
              render={({ handleSubmit, submitting, pristine }) => (
                <form onSubmit={handleSubmit} className="thread-form">
                  <div className="thread-form__container">
                    <div className="thread-form__container__inner">
                      <Field
                        name="image"
                        component={Dropzone}
                        dropzoneProps={{ multiple: true, noClick: true, maxSize: 157286400 }}
                        openBtn={(
                          <button
                            type="button"
                            className="drop-zone__btn"
                          >
                            <img src={attachIcon} alt="" />
                          </button>
                        )}
                        dropzoneChildren={(value, handleDelete) => (
                          <>
                            <Field
                              component={TextArea}
                              name="message"
                              placeholder="Type your message..."
                            />
                            <ul className="drop-zone__list">
                              {value && value.map((file, index) => (
                                <li key={index} className="drop-zone__list__item">
                                  {file.fileType.match(/image/g)
                                    ? <img src={file.preview} alt="" />
                                    : (
                                      <div className="document-preview">
                                        {file.fileType.match(/pdf/g) ? 'PDF' : 'DOC'}
                                      </div>
                                    )
                                  }
                                  <div className="drop-zone__list__item__hover">
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(index)}
                                    />
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      />
                      <div className="add-widget-btn" onClick={() => setModalVisible(true)}>
                        + Widgets
                      </div>
                      <Button
                        className="thread-form__submit"
                        type="submit"
                        withGradient
                        disabled={submitting || pristine}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            />
          </div>
        </div>
      </div>
    </>
  )
}


export default Thread
