import { useContext, useState } from "react";
import { UserContext } from "../../Context/UserContext";
import Loader from "../../Loader/Loader";
import UserPosts from "../UserPosts/UserPosts";
import UploadImageProfile from "./UploadImageProfile";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import ImageModal from "../ImageModal/ImageModal";

export default function Profile() {
  const { userData } = useContext(UserContext);

  const [isOpen, setIsOpen] = useState(false);

  if (!userData) return <Loader />;

  const profileImage =
    userData?.image?.url ||
    "https://flowbite.com/docs/images/people/profile-picture-5.jpg";

  return (
    <>
      <Helmet>
        <title>SocialApp | Profile</title>
      </Helmet>

      <div className="w-[70%] mx-auto flex flex-col items-center my-14">
        <div className="relative">
          <img
            className="size-52 rounded-full my-5 cursor-pointer hover:opacity-90 transition"
            src={profileImage}
            alt="Profile"
            onClick={() => setIsOpen(true)}
          />

          {/* Upload Image Button */}
          <div className="absolute right-0 bottom-5">
            <UploadImageProfile />
          </div>
        </div>

        {/* Zoom Modal */}
        <ImageModal
          imageUrl={profileImage}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />

        <p className="text-xl font-bold mt-5">{userData?.name}</p>
        <p className="text-xl font-bold">{userData?.gender}</p>
        <p className="text-xl font-bold">{userData?.email}</p>

        <Link
          className="text-md font-bold my-7 bg-blue-800 hover:bg-blue-700 py-3 px-7 rounded-md"
          to="/changepassword"
        >
          Change password
        </Link>
      </div>

      <UserPosts isHome={false} />
    </>
  );
}
