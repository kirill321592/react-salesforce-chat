import { useRef, useState } from 'react'
import Dropzone from 'react-dropzone'
import Modal from 'components/Modal'
import Button from 'components/Button'
import './styles.css'

const CustomDropzone = ({
  input: { onChange, value },
  meta: {
    touched,
    error,
    submitError,
    dirtySinceLastSubmit,
    submitFailed,
  },
  openBtn,
  dropzoneProps: {
    maxAcceptedFiles,
    ...dropzoneProps
  },
  dropzoneChildren,
}) => {
  const dropzoneRef = useRef(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [rejectedError, setRejectedError] = useState()
  const [fileType, setFileType] = useState()
  const isError = touched && (error || (submitError && !dirtySinceLastSubmit && submitFailed))

  const showModal = errorMessage => {
    setRejectedError({ title: errorMessage.title, description: errorMessage.description })
    setModalVisible(true)
  }

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })

  return (
    <>
      <Modal open={modalVisible} onCancel={() => setModalVisible(false)} width={600}>
        <div className="dropzone-modal-error">
          <div className="dropzone-title-error">{rejectedError?.title}</div>
          <div className="dropzone-description-error">{rejectedError?.description}</div>
          <Button className="dropzone-modal-btn" onClick={() => setModalVisible(false)}>
            Ok, got it
          </Button>
        </div>
      </Modal>
      <Dropzone
        ref={dropzoneRef}
        noKeyboard
        onDropAccepted={async acceptedFiles => {
          Promise.all(
            (dropzoneProps.multiple
              ? [...(value && value), ...acceptedFiles]
              : acceptedFiles
            ).map(async item => (item.file
              ? item
              : { file: await toBase64(item), preview: URL.createObjectURL(item), fileType: item.type, clearFile: item }
            )),
          ).then(res => {
              onChange(res)
          })
        }}
        onDropRejected={rejectedFiles => {
          const rejectedType = rejectedFiles[0].errors[0].code

          switch (rejectedType) {
            case 'file-too-large': {
              const maxSize = dropzoneProps.maxSize / 1048576
              const errorMessage = rejectedFiles.length > 1
                ? `The files ${rejectedFiles.map(i => i.file.name).join(', ')} could not be uploaded. The files are exceeding the maximum file size of ${maxSize} MB`
                : `The file ${rejectedFiles[0].file.name} could not be uploaded. The file is exceeding the maximum file size of ${maxSize} MB`

              showModal({ title: 'Too big', description: errorMessage })
              break
            }

            case 'file-invalid-type': {
              const validFormats = dropzoneProps.accept
                .join('')
                .toUpperCase()
                .replace(/.([^.]*)$/, ' and $1')
                .replace(/\./g, ', ')
                .replace(/^, /g, '')

              showModal({ title: 'Invalid type', description: `Sorry, only ${validFormats} files can be uploaded` })
              break
            }

            default:
              break
          }
        }}
        {...dropzoneProps}
      >
        {({ getRootProps, getInputProps }) => (
          <>
            <div {...getRootProps({ className: 'drop-zone' })}>
              <input {...getInputProps()} />
              {openBtn && <div onClick={() => dropzoneRef?.current?.open()}>{openBtn}</div>}
              {dropzoneChildren(value, itemIndex => {
                const acceptedF = value.filter((it, index) => index !== itemIndex)

                onChange(acceptedF.length > 0 ? acceptedF : undefined)
              })}
            </div>
            {isError && <span className="drop-zone__error">{error || submitError}</span>}
          </>
        )}
      </Dropzone>
    </>
  )
}

export default CustomDropzone

CustomDropzone.defaultProps = {
  dropzoneProps: {
    maxAcceptedFiles: undefined,
  },
}
