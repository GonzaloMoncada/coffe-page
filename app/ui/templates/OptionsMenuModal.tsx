import { Post } from "@/app/interface/types";
import ModalMenu from "./Modalmenu";

interface ModalMenuProps {
    modalMenu: boolean;
    modalRef: React.RefObject<HTMLDivElement>;
    handleMenuModal: () => void;
    handleDelete: (data: Post | null) => void;
    data: Post | null;
    handleEdit: () => void;
}
export default function OptionsMenuModal({ modalRef, handleMenuModal, handleDelete, data, modalMenu, handleEdit }: ModalMenuProps) {
    return (
        <div className='absolute flex w-full h-full top-5 justify-end'>
            <button className='h-5' type='button' onClick={handleMenuModal}>
                {modalMenu ? "" : "🔳"}
            </button>
            {modalMenu && (
                <ModalMenu modalRef={modalRef} handleMenuModal={handleMenuModal} handleDelete={handleDelete} data={data} handleEdit={handleEdit} />
            )}
        </div>
    )
}
