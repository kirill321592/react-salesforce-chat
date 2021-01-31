import { Modal } from 'antd'
import MoreFiltersClose from 'svg-icons/MoreFiltersClose'
import './styles.css'

const CustomModal = ({
  open,
  onCancel,
  className,
  children,
  ...props
}) => (
  <>
    <Modal
      centered
      visible={open}
      width={800}
      className={`custom-modal ${className}`}
      onCancel={onCancel}
      zIndex={1010}
      footer={null}
      closeIcon={(
        <MoreFiltersClose className="close-modal" onClick={onCancel} />
      )}
      {...props}
    >
      {children}
    </Modal>
  </>
)

export default CustomModal
