import { Button } from 'antd'
import './styles.css'

const CustomButton = ({
  withGradient,
  children,
  className,
  secondary,
  type,
  ...props
}) => (
  <>
    <Button
      block
      className={`
        custom-button
        ${withGradient && 'gradient-button'}
        ${className}
        ${secondary && 'secondary'}
      `}
      htmlType={type}
      {...props}
    >
      {children}
    </Button>
  </>
)

export default CustomButton
