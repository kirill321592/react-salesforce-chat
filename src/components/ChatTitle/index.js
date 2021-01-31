import './styles.css'

const ChatTitle = ({ attributes, friendlyName }) => (
  <>
    {attributes?.serviceName === friendlyName && (
      <span className="service-name">{friendlyName}</span>
    )}
    {attributes?.serviceName && attributes?.serviceName !== friendlyName && (
      <>
        <span className="service-name">{attributes?.serviceName}: </span>
        {friendlyName}
      </>
    )}
    {!attributes?.serviceName && friendlyName}
  </>
)

export default ChatTitle
