import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../../Loader/Loader";
import Error from "../../Error/Error";
import Comment from "../Comment/Comment";
import AddComment from "../AddComment/AddComment";
import DropdownEdit from "../DropdownEdit/DropdownEdit";
import { useState } from "react";
import LikeButton from "../LikeButton/LikeButton";
import SharePostButton from "../SharePostButton/SharePostButton";
import ImageModal from "../ImageModal/ImageModal";

export default function PostDetails() {
  const { id } = useParams();

  const [zoomImage, setZoomImage] = useState(null);

  async function getSiglePost() {
    return await axios.get(`${import.meta.env.VITE_BASE_URL}/post/${id}`, {
      headers: {
        token: `testPrefix ${localStorage.getItem("token")}`,
      },
    });
  }

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["getPostDetails", id],
    queryFn: getSiglePost,
    select: (data) => data?.data?.post,
  });

  if (isError) return <Error error={error} />;
  if (isLoading) return <Loader />;

  return (
    <>
      <div
        key={data._id}
        className="w-full md:w-[80%] lg:w-[60%] my-10 p-5 mx-auto rounded-md bg-gray-800"
      >
        {/* ======== Header ======== */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4">
              <img
                src={
                  data.owner.image?.url
                    ? data.owner.image.url
                    : "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                }
                className="size-[35px] rounded-full"
                alt={data.owner.name}
              />
              <span className="font-bold">{data.owner.name}</span>
            </div>
            <p className="mt-1 ms-12 text-sm">{data.createdAt.split("T")[0]}</p>
          </div>

          <DropdownEdit mediaId={data} isPost={true} />
        </div>

        {/* ================ Shared Post Section ================ */}
        {data.isShared && data.sharedFrom && data.sharedFrom.owner && (
          <div className="bg-gray-800 p-3 rounded-lg mb-3 border border-gray-700">
            <p className="text-sm text-gray-300 mb-2">
              Shared from {data.sharedFrom.owner.name}
            </p>

            <div className="flex items-center gap-3">
              <img
                className="w-10 h-10 rounded-full"
                src={
                  data.sharedFrom.owner.image?.url ||
                  "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                }
                alt="original owner"
              />

              <div>
                <p className="font-semibold text-white">
                  {data.sharedFrom.owner.name}
                </p>

                <p className="text-xs text-gray-400">
                  {new Date(data.sharedFrom.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======== Body ======== */}
        {data.body && <h2 className="mb-5">{data.body}</h2>}

        {/* ================ Post Image ================ */}
        {data.image && (
          <img
            src={data.image.url}
            className="w-full rounded-md cursor-pointer"
            alt={data.body}
            onClick={() => setZoomImage(data.image.url)}
          />
        )}

        <div className="flex items-center justify-between mt-5">
          <LikeButton post={data} size="medium" />
          <i className="fa-solid fa-comment">
            <span className="ms-2">{data.comments.length}</span>
          </i>
          <SharePostButton post={data} />
        </div>

        <AddComment postId={data._id} />

        {data.comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </div>

      {/* ==== Image Modal ==== */}
      <ImageModal
        imageUrl={zoomImage}
        isOpen={zoomImage !== null}
        onClose={() => setZoomImage(null)}
      />
    </>
  );
}
