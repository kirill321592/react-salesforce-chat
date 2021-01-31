import { useState, useEffect } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import dayjs from 'dayjs'
import enGb from 'date-fns/locale/en-GB'
import Button from 'components/Button'
import './styles.css'

registerLocale('en-gb', enGb)

const WidgetParser = ({ body, attributes }) => {
  const [modalVisible, setModalVisible] = useState()
  const [services, setServices] = useState()

  const renderWidget = ({
    widgetType,
    serviceDescription,
    servicePhoto,
    paymentId,
    amount,
  }) => {
    switch (widgetType) {
      case 'payment': {
        return (
          <>
            <Button withGradient className="payment-widget-btn">
              <span className="submit-widget-text">Pay {amount} €</span>
            </Button>
          </>
        )
      }

      case 'calendar': {
        return (
          <div className="calendar-widget">
            <div className="service-description">
              Great! Please select a convenient date. It can be changed later.
            </div>
            <DatePicker
              locale="en-gb"
              formatWeekDay={day => day.substr(0, 3)}
              inline
              minDate={new Date()}
              filterDate={date => {
                const day = date.getDay()

                return day !== 0 && day !== 6
              }}
            />
            <div className="calendar-widget-btns-container">
              <Button
                withGradient
                className="calendar-btn-select"
              >
                <span className="submit-widget-text">Select</span>
              </Button>
              <div className="cancel-widget">
                I’ve changed my mind<br />and don’t want this service
              </div>
            </div>
          </div>
        )
      }

      case 'service': {
        return (
          <div className="service-widget">
            <div className="service-description">
              {serviceDescription}
            </div>
            <img src={servicePhoto} className="service-widget-img" alt="service" />
            <div className="service-widget-question">Tell me please, are you interested?</div>
            <div className="service-widget-btns-container">
              <Button withGradient>
                <span className="submit-widget-text">Yes, sure</span>
              </Button>
              <Button secondary>
                No, thanks
              </Button>
            </div>
          </div>
        )
      }

      default: {
        break
      }
    }
  }

  return (
    <>
      {!body && (
        <div className="widget-container">
          {renderWidget({ ...attributes })}
        </div>
      )}
    </>
  )
}

export default WidgetParser
