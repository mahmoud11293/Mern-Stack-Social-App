import React, { useRef, useState } from "react";
import DropdownEdit from "../DropdownEdit/DropdownEdit";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import ImageModal from "../ImageModal/ImageModal";

export default function Comment({ comment }) {
  const { text, owner, createdAt, _id } = comment;
  const [isEditComment, setIsEditComment] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);
  const fileRef = useRef();

  const { register, handleSubmit } = useForm();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: editComment,

    onSuccess: () => {
      toast.success("comment edited successfully", { theme: "dark" });

      queryClient.invalidateQueries("getPostDetails");
      queryClient.invalidateQueries("getAllPosts");
      queryClient.invalidateQueries("getUserPosts");

      setIsEditComment(false);
      setRemoveImage(false);
      fileRef.current.value = "";
    },

    onError: () => {
      toast.error("comment edit failed", { theme: "dark" });
    },
  });

  async function editComment(data) {
    const formData = new FormData();
    formData.append("text", data.text ?? "");

    if (fileRef.current.files[0]) {
      formData.append("image", fileRef.current.files[0]);
    }

    formData.append("removeImage", removeImage ? "true" : "false");

    return await axios.put(
      `${import.meta.env.VITE_BASE_URL}/comment/${_id}`,
      formData,
      {
        headers: {
          token: `testPrefix ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  function onSubmit(data) {
    const file = fileRef.current?.files?.[0];
    const textTrimmed = (data.text ?? "").trim();

    if (!file && !removeImage && !textTrimmed && !comment.image) {
      toast.error("Write something or upload an image", { theme: "dark" });
      return;
    }

    mutate(data);
  }

  return (
    <div className="w-full bg-gray-900 p-5 mt-5 rounded-md border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <img
            src={
              owner.image?.url
                ? owner.image.url
                : "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
            }
            alt=""
            className="size-9 rounded-full"
          />
          <div className="flex flex-col gap-2">
            <span className="font-bold">{owner.name}</span>
            <span className="text-sm">{createdAt.split("T")[0]}</span>
          </div>
        </div>

        <DropdownEdit
          mediaId={comment}
          commentId={_id}
          isPost={false}
          setIsEditComment={setIsEditComment}
        />
      </div>

      {/* ================= Edit Comment ================= */}
      {isEditComment ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center gap-4 my-4">
            <textarea
              className="w-[90%] bg-gray-800 p-2 rounded-md"
              defaultValue={text}
              {...register("text")}
            ></textarea>

            <input
              type="file"
              className="hidden"
              {...register("image")}
              ref={fileRef}
            />
            <i
              onClick={() => fileRef.current.click()}
              className="fa-solid fa-cloud-arrow-up text-2xl cursor-pointer"
            ></i>
          </div>

          {/* === Preview current image === */}
          {comment.image && !removeImage && (
            <div className="mb-2 ms-11">
              <img
                src={comment.image?.url}
                alt="preview"
                className="size-20 mb-5 rounded-md"
              />

              <button
                type="button"
                onClick={() => setRemoveImage(true)}
                className="ml-2 text-sm text-red-400 border border-red-400 rounded-md px-2 py-1 cursor-pointer hover:bg-red-400 hover:text-white"
              >
                Remove image
              </button>
            </div>
          )}

          {/* === Remove image === */}
          {removeImage && (
            <div className="ms-11 mb-2">
              <span>Image will be removed</span>

              <button
                type="button"
                onClick={() => setRemoveImage(false)}
                className="ml-2 text-sm text-green-400 cursor-pointer border border-green-400 rounded-md px-2 py-1 hover:bg-green-400 hover:text-white"
              >
                Undo
              </button>
            </div>
          )}

          <div className="flex gap-6">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 px-5 py-2.5 rounded-lg"
            >
              {isPending && <i className="fas fa-spinner fa-spin mx-3"></i>}
              Update
            </button>

            <button
              className="text-white bg-red-700 hover:bg-red-800 px-5 py-2.5 rounded-lg"
              type="reset"
              onClick={() => setIsEditComment(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          {text && <p className="ms-11 mb-4">{text}</p>}

          {comment.image && (
            <img
              src={comment.image?.url}
              className="size-20 ms-11 cursor-pointer rounded-md hover:scale-105 transition-transform duration-300"
              alt="comment"
              onClick={() => setZoomImage(comment.image.url)}
            />
          )}
        </>
      )}

      {/* ====== Image Modal ====== */}
      <ImageModal
        imageUrl={zoomImage}
        isOpen={zoomImage !== null}
        onClose={() => setZoomImage(null)}
      />
    </div>
  );
}
