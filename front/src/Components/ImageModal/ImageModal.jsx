import { AnimatePresence, motion } from "framer-motion";

export default function ImageModal({ imageUrl, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 cursor-pointer"
        onClick={onClose}
      >
        <motion.img
          src={imageUrl}
          alt="Zoomed"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="max-w-[90%] max-h-[90%] rounded-lg shadow-xl"
        />
      </div>
    </AnimatePresence>
  );
}
