import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

export default function PostEdit({ post, setIsEditPost }) {
  const { body, image, _id } = post;

  const [removeImage, setRemoveImage] = useState(false);
  const fileRef = useRef();

  const { register, handleSubmit } = useForm();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: editPost,

    onSuccess: () => {
      toast.success("Post updated!", { theme: "dark" });
      queryClient.invalidateQueries("getPostDetails");
      queryClient.invalidateQueries("getAllPosts");
      queryClient.invalidateQueries("getUserPosts");

      setRemoveImage(false);
      fileRef.current.value = "";
      setIsEditPost(false);
    },

    onError: (error) =>
      toast.error("Post update failed" + console.log(error), { theme: "dark" }),
  });

  async function editPost(data) {
    const formData = new FormData();
    formData.append("body", data.body ?? "");

    if (fileRef.current.files[0]) {
      formData.append("image", fileRef.current.files[0]);
    }

    formData.append("removeImage", removeImage ? "true" : "false");

    return await axios.put(
      `${import.meta.env.VITE_BASE_URL}/post/${_id}`,
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
    const bodyTrimmed = (data.body ?? "").trim();

    if (!file && !removeImage && !bodyTrimmed && !post.image) {
      toast.error("Write something or upload an image", { theme: "dark" });
      return;
    }

    mutate(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center gap-4 mb-4">
        <textarea
          className="w-full bg-gray-800 p-3 rounded-md mb-4"
          defaultValue={body}
          {...register("body")}
        ></textarea>
        <input
          type="file"
          {...register("image")}
          ref={fileRef}
          className="hidden"
        />
        <i
          className="fa-solid fa-cloud-arrow-up text-2xl cursor-pointer"
          onClick={() => fileRef.current.click()}
        ></i>
      </div>

      {image && !removeImage && (
        <div className="mb-4">
          <img src={image.url} alt="" className="w-40 mb-3" />
          <button
            type="button"
            onClick={() => setRemoveImage(true)}
            className="text-sm text-red-400 border border-red-500 px-2 py-1 rounded-md"
          >
            Remove image
          </button>
        </div>
      )}

      {removeImage && (
        <div className="mb-4">
          <span className="text-yellow-300">Image will be removed</span>
          <button
            type="button"
            onClick={() => setRemoveImage(false)}
            className="ms-3 text-sm text-green-400 border border-green-400 px-2 py-1 rounded-md"
          >
            Undo
          </button>
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-blue-700 px-5 py-2 rounded-md text-white"
        >
          {isPending && <i className="fas fa-spinner fa-spin me-2"></i>}
          Update
        </button>
        <button
          type="button"
          onClick={() => setIsEditPost(false)}
          className="bg-red-700 px-5 py-2 rounded-md text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
