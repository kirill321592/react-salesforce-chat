import { Input } from 'antd'
import './styles.css'

const { TextArea } = Input

const CustomTextArea = ({ input, label, ...rest }) => {
  const isError = rest.meta.touched && (rest.meta.error || (rest.meta.submitError && !rest.meta.dirtySinceLastSubmit
    && rest.meta.submitFailed))

  return (
    <>
      {isError && <div className="validation-error">{rest.meta.error || rest.meta.submitError}</div>}
      {label}
      <TextArea
        {...input}
        {...rest}
        className={`chat-input ${isError && 'with-error'}`}
      />
    </>
  )
}

export default CustomTextArea
