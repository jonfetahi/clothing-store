import { Modal } from '../../../shared/ui/Modal';

type Props ={
  onHide(): void;
}

export function Favourites({ onHide }:Props){

  return (
    <Modal title={'Favourite Items'} onHide={onHide}>
      <div> Your Favourite Items </div>
    </Modal>
  )
}