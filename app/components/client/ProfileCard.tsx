"use client";
import React, { Fragment, useContext, useState } from "react";
import Icon from "@mdi/react";
import Image from "next/image";

import UploadPhotoModal from "./UploadPhotoModal";
import { AuthContext } from "@/app/context/AuthContext";
import { Body } from "@/app/fonts/roboto";
import { mdiFloppy, mdiPencil } from "@mdi/js";
import EditProfile from "./EditProfile";

const ProfileCard = () => {
  const { user, loading } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleChangePicture = async (photo: File | null) => {
    try {
      if (photo === null) {
        throw new Error();
      }
      const formData = new FormData();
      formData.append("photo", photo);

      if (!user) {
        throw new Error();
      }

      const response = await fetch(`/api/user/${user.id}/edit`, {
        method: "PATCH",
        body: formData
      });

      if (response.ok) {
        window.location.reload();
      } else {
        throw new Error();
      }
    } catch (error) {
      alert("There was a problem uploading your picture");
    }
  };

  const handleToggle = (value: boolean) => {
    setIsEditing(!value);
  };

  if (loading) {
    return (
      <div className="artboard phone-6 shadow-md flex items-center justify-center">
        <span className="loading loading-spinner loading-xs"></span>
      </div>
    );
  }

  return (
    <Fragment>
      {user ? (
        <div className="flex ">
          <div
            className={`${Body.className} artboard rounded-xl gap-2 border-letter border flex flex-col flex-1 py-12 w-full lg:mx-12 mx-4 mt-4 shadow-md`}
          >
            <div className="avatar self-center indicator">
              <div
                className={`${Body.className}  w-48 border-primary border-2 rounded-full mt-1 shadow-md `}
              >
                <Image
                  className=""
                  src={user.profilePicture}
                  alt="Profile Picture"
                  width={480}
                  height={480}
                />
              </div>
              <span>
                <span
                  onClick={() => setIsModalOpen(!isModalOpen)}
                  className="badge cursor-pointer hover:bg-accent bg-primary btn-circle mr-5 mt-40 z-0 btn-sm indicator-item flex items-center justify-center"
                >
                  <div>
                    <Icon path={mdiPencil} size={0.7} />
                  </div>
                </span>
                <UploadPhotoModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onUpload={handleChangePicture}
                />
              </span>
            </div>
            <div className="self-center text-letter text-center">
              <div className="text-2xl">
                {user.firstName} {user.lastName}
              </div>
              {isEditing ? (
                <Fragment>
                  <div
                    onClick={() => setIsEditing(!isEditing)}
                    className="btn btn-ghost text-letter text-md flex flex-row gap-2"
                  >
                    <div>
                      <Icon path={mdiFloppy} size={1} />
                    </div>
                    <div>Save</div>
                  </div>
                  <EditProfile id={user.id} isEditing={handleToggle} />
                </Fragment>
              ) : (
                <Fragment>
                  <div
                    onClick={() => setIsEditing(!isEditing)}
                    className="btn btn-ghost my-2 hover:bg-gray-300 btn-sm text-letter text-md flex flex-row gap-2"
                  >
                    <div>
                      <Icon path={mdiPencil} size={1} />
                    </div>
                    <div>Edit Profile</div>
                  </div>
                  <div className="mb-2">{user.bio}</div>
                  <div className="text-gray-500 gap-2 flex flex-row items-center justify-center">
                    <span>{user.location}</span>
                    <span className=" text-xs text-primary font-bold bg-gray-700 px-3 py-1 rounded-lg cursor-default">
                      Location
                    </span>
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </Fragment>
  );
};

export default ProfileCard;
