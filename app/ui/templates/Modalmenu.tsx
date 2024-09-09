import { Post } from "@/app/interface/types";

interface ModalMenuProps {
  modalRef: React.RefObject<HTMLDivElement>;
  handleMenuModal: () => void;
  handleDelete: (data: Post | null) => void;
  data: Post | null;
  handleEdit: () => void;
  labelfirst?: string;
  labelsecond?: string;
  bgButtonfirts?: string;
  bgButtonsecond?: string;
}
const ModalMenu: React.FC<ModalMenuProps> = ({ modalRef, handleMenuModal, handleDelete, data, handleEdit, labelfirst = "Modificar", labelsecond = "Eliminar", bgButtonfirts = "bg-yellow-300", bgButtonsecond = "bg-red-400" }) => {
  return (
    <div className='absolute flex w-full h-full items-end flex-col z-10'>
      <button type='button' className='w-5 z-20' onClick={handleMenuModal}>❌</button>
      <div ref={modalRef} className='w-auto min-w-[40%] flex flex-col justify-evenly bg-[#b4b0b0]/80 px-6 mr-7 mt-2  rounded-2xl py-4 gap-4  '>
        <div className={`w-full px-2 rounded-xl ${bgButtonfirts} h-8`}>
          <button type="button" onClick={handleEdit} className="rounded-xl w-full h-full">
            {labelfirst}
          </button>
        </div>
        <div className={`w-full px-2 rounded-xl ${bgButtonsecond} h-8`}>
          <button
            type="button"
            onClick={() => handleDelete(data)}
            className="rounded-xl w-full h-full"
          >
            {labelsecond}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalMenu;
