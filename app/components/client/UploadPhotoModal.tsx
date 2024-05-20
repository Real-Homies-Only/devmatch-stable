import React, { useState } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { z } from "zod";

const UploadPhotoSchema = z.object({
  photo: z.instanceof(File).nullable()
});

type UploadPhotoData = z.infer<typeof UploadPhotoSchema>;

const UploadPhotoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onUpload: (photo: File | null) => void;
}> = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { handleSubmit, reset } = useForm<UploadPhotoData>();

  const onSubmit = async () => {
    if (selectedFile) {
      onUpload(selectedFile);
    } else {
      onUpload(null);
    }
    reset();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Upload Photo"
      className="fixed inset-0 z-50 text-gray-700 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-gray-700 bg-opacity-75"
    >
      <div className="bg-background border-2 border-primary rounded-lg p-6 max-w-md w-full">
        <h2 className="text-lg text-gray-700 font-semibold mb-4">
          Upload Photo
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered bg-background text-gray-700 file-input-primary w-full"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost mr-2 border-1 border-gray-700 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary bg-primary border-none hover:bg-secondary"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UploadPhotoModal;
