import axios from "axios";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function SharePostButton({ post }) {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const shareMutation = useMutation({
    mutationFn: async () =>
      axios.post(
        `${import.meta.env.VITE_BASE_URL}/post/share/${post._id}`,
        {},
        {
          headers: { token: `testPrefix ${localStorage.getItem("token")}` },
        }
      ),

    onSuccess: () => {
      toast.success("Post shared successfully!", { theme: "dark" });
      setConfirmOpen(false);

      queryClient.invalidateQueries(["getAllPosts"]);
      queryClient.invalidateQueries(["getUserPosts"]);
    },

    onError: () => {
      toast.error("Failed to share post", { theme: "dark" });
    },
  });

  return (
    <>
      {/* Share button */}
      <button
        onClick={() => setConfirmOpen(true)}
        className="text-gray-400 hover:text-gray-200 ms-4"
      >
        <i className="fa-solid fa-share"></i>
      </button>

      {/* Share confirmation modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-[320px] text-center">
            <p className="text-lg font-semibold mb-4 text-white">
              Are you sure you want to share this post?
            </p>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setConfirmOpen(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => shareMutation.mutate()}
                className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
