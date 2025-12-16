import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import AppButton from "../../shared/AppButton";
import { toast } from "react-toastify";
import { useRef } from "react";

export default function AddComment({ postId }) {
  const { register, handleSubmit, reset } = useForm();
  const fileRef = useRef();

  const queryClient = useQueryClient();

  const { mutate, isError, isPending } = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      reset();
      toast.success("comment added successfully", {
        theme: "dark",
      });

      queryClient.invalidateQueries("getPostDetails", postId);
      queryClient.invalidateQueries("getAllPosts");
      queryClient.invalidateQueries("getUserPosts");
    },
    onError: () => {
      toast.error("comment creation failed", {
        theme: "dark",
      });
    },
  });

  async function addComment(data) {
    const formData = new FormData();
    formData.append("text", data.text);

    if (fileRef.current.files[0]) {
      formData.append("image", fileRef.current.files[0]);
    }

    return axios.post(
      `${import.meta.env.VITE_BASE_URL}/comment/${postId}`,
      formData,
      {
        headers: {
          token: `testPrefix ${localStorage.getItem("token")}`,
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit(mutate)} className="flex flex-col gap-4 my-5">
      <div className="flex items-center gap-4">
        <textarea
          id="comment"
          rows="2"
          className="block p-2.5 w-[90%] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write Something..."
          {...register("text")}
        ></textarea>
        <input
          {...register("image")}
          ref={fileRef}
          className="hidden"
          type="file"
        />
        <i
          onClick={() => fileRef.current.click()}
          className="fa-solid fa-cloud-arrow-up text-2xl cursor-pointer"
        ></i>
      </div>
      {isError && (
        <p className="text-red-500 text-center text-xl">write something</p>
      )}
      <AppButton isLoading={isPending}>Submit</AppButton>
    </form>
  );
}
