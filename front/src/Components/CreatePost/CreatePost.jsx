import axios from "axios";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import AppButton from "../../shared/AppButton";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreatePost() {
  const fileRef = useRef();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      reset();
      toast.success("post created successfully", {
        theme: "dark",
      });

      queryClient.invalidateQueries("getAllPosts");
      queryClient.invalidateQueries("getUserPosts");
    },
    onError: () => {
      toast.error("post creation failed", {
        theme: "dark",
      });
    },
  });

  const { register, handleSubmit, reset } = useForm();

  async function addPost(data) {
    const formData = new FormData();
    formData.append("body", data.body);

    if (fileRef.current.files[0]) {
      formData.append("image", fileRef.current.files[0]);
    }
    return await axios.post(`${import.meta.env.VITE_BASE_URL}/post`, formData, {
      headers: {
        token: `testPrefix ${localStorage.getItem("token")}`,
      },
    });
  }

  return (
    <>
      <section className="w-full md:w-[80%] lg:w-[60%] mx-auto p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 ">
        <form onSubmit={handleSubmit(mutate)} className="space-y-6" action="#">
          <div>
            <label
              htmlFor="post"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Post Somthing
            </label>
          </div>

          <div className="flex items-center gap-4">
            <textarea
              id="post"
              rows="4"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write Something..."
              {...register("body")}
            ></textarea>
            <input
              className="hidden"
              {...register("image")}
              ref={fileRef}
              type="file"
            />
            <i
              className="fa-solid fa-cloud-arrow-up text-2xl cursor-pointer"
              onClick={() => fileRef.current.click()}
            ></i>
          </div>

          <AppButton isLoading={isPending}>Submit</AppButton>
        </form>
      </section>
    </>
  );
}
