import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AppButton from "../../shared/AppButton";
import { UserContext } from "../../Context/UserContext";

export default function UploadImageProfile() {
  const [openModel, setOpenModel] = useState(false);
  const { getProfileData } = useContext(UserContext);

  const { register, handleSubmit } = useForm();

  async function uploadProfileImage(data) {
    const formData = new FormData();
    formData.append("image", data.image[0]);

    return await axios.put(
      `${import.meta.env.VITE_BASE_URL}/user/image-upload`,
      formData,
      {
        headers: {
          token: `testPrefix ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: () => {
      setOpenModel(false);
      toast.success("image uploaded successfully", {
        theme: "dark",
      });

      getProfileData(localStorage.getItem("token"));
    },
    onError: () => {
      toast.error("image upload failed", {
        theme: "dark",
      });
    },
  });

  return (
    <>
      {/* ===== Button to open modal ===== */}
      <div
        onClick={() => setOpenModel(true)}
        className="cursor-pointer dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white size-13 text-xl rounded-full inline-flex justify-center items-center"
      >
        <i className="fa-solid fa-pen "></i>
      </div>

      {/* ===== Modal ===== */}
      {openModel && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center"
          onClick={() => setOpenModel(false)} // close when clicking outside
        >
          <div
            className="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()} // prevent closing on content click
          >
            {/* Close X Button */}
            <button
              type="button"
              onClick={() => setOpenModel(false)}
              className="absolute top-3 end-2.5 text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 inline-flex justify-center items-center"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18 17.94 6M18 18 6.06 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>

            {/* ===== Modal Content File Input ===== */}

            <form
              onSubmit={handleSubmit(mutate)}
              className="flex flex-col gap-4 items-center justify-center w-full mt-10"
            >
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium"
              >
                <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>

                <input
                  id="dropzone-file"
                  {...register("image")}
                  type="file"
                  className="hidden"
                />
              </label>

              <AppButton isLoading={isPending}>Upload</AppButton>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
