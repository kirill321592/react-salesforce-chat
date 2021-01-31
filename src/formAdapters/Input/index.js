import { Input } from 'antd'
import './styles.css'

const CustomInput = ({
  withError = true,
  input,
  onChange,
  inputRef,
  label,
  ...rest
}) => {
  const isError = withError && rest.meta.touched
   && (rest.meta.error || (rest.meta.submitError && !rest.meta.dirtySinceLastSubmit && rest.meta.submitFailed))

  return (
    <>
      {label && <div className="profile-field-label">{label}</div>}
      <div className="form-input-container">
        {isError && <div className="validation-error">{rest.meta.error || rest.meta.submitError}</div>}
        <Input
          {...input}
          {...rest}
          ref={inputRef}
          className={`form-input ${isError && 'error'}`}
          onChange={e => {
            onChange && onChange(e)
            input.onChange(e)
          }}
        />
      </div>
    </>
  )
}

export default CustomInput
