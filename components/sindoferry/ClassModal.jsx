import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import React from "react";

const ModalSelectClass = ({ isOpen, setIsOpen, handleSelectedClass }) => {
  const classes = ["ekonomi", "bisnis", "eksekutif"];
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50 w-fulll"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed left-0 bottom-0 inset-0 flex items-end justify-center text-black">
        <Dialog.Panel className="w-full   rounded-t-2xl bg-white p-6 space-y-4 relative overflow-y-auto max-h-[95vh]">
          <h1 className="font-semibold border-b text-lg py-2">Pilih Kelas</h1>
          <div className="capitalize space-y-3 text-md">
          {classes.map((c) => (
            <p onClick={()=>handleSelectedClass(c)} key={c}>{c}</p>
          ))}
        </div>
        </Dialog.Panel>
        
      </div>
    </Dialog>
  );
};

export default ModalSelectClass;
