import './styles.css'

const GradientText = ({ className, children }) => (
  <span className={`gradient-text ${className}`}>{children}</span>
)

export default GradientText
