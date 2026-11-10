import { Modal } from '../../../shared/ui/Modal';

type Props = {
  onHide: () => void;
}

export function ShoppingCart({ onHide }: Props) {
  return (
    <Modal
      title={'Your Shopping Cart'}
      onHide={onHide}
      footer={
      <div> Footer</div>
    }>

    </Modal>
  )
}