import Arrow from 'svg-icons/Arrow'
import './styles.css'

const Breadcrumbs = ({ text, callback }) => (
  <span className="property-tab__link" onClick={() => callback(null)}>
    <div className="property-tab__link__img" width="24px" height="24px" />
    <Arrow className="property-tab__link__img" width="24px" height="24px" />
    {text}
  </span>
)

export default Breadcrumbs
