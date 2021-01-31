import './styles.css'

const ChatAttachmentPreview = ({ mediaUrl, media }) => (
  <>
    {mediaUrl && (media?.state?.contentType.match(/image/g)
      ? <img src={mediaUrl} alt="img" className="thread-item__drops__img" />
      : (
        <a
          href={mediaUrl}
          target="_blank"
          rel="noreferrer"
          className="document-preview"
        >
          {media?.state?.contentType.match(/pdf/g) ? 'PDF' : 'DOC'}
        </a>
      )
    )}
  </>
)

export default ChatAttachmentPreview
