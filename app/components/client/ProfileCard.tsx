"use client";
import React, { Fragment, useContext, useState } from "react";
import Icon from "@mdi/react";
import Image from "next/image";
import Modal from "react-modal";

import UploadPhotoModal from "./UploadPhotoModal";
import { AuthContext } from "@/app/context/AuthContext";
import { Body, Headings } from "@/app/fonts/roboto";
import { mdiPencil } from "@mdi/js";
import EditProfile from "./EditProfile";
import Ratings from "./Ratings";

const ProfileCard = () => {
  const { user, loading } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState(false);

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
        setUploaded(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
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

  const handleEdited = (value: boolean) => {
    setEdited(value);
  };

  if (loading) {
    return (
      <div className="flex flex-col w-full items-center">
        <div className="artboard phone-1 artboard-horizontal w-full mx-4 lg:mx-12 mt-4 self-center flex flex-1 items-center justify-center">
          <span className="loading loading-spinner loading-lg self-center justify-center"></span>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      {user ? (
        <div className="flex flex-col items-center mx-12">
          <div
            className={`${Body.className} artboard rounded-xl gap-2 border-letter lg:border flex flex-col flex-1 py-12 w-full lg:mx-12 mx-4 mt-4 lg:shadow-md`}
          >
            <div className="avatar self-center indicator">
              <div
                className={`${Body.className}  w-48 border-primary border-2 rounded-full mt-1 shadow-md `}
              >
                <Image
                  className=""
                  data-testid="profile-picture"
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
                <Modal
                  isOpen={uploaded}
                  contentLabel="Loading..."
                  className="fixed inset-0 z-50 flex items-center justify-center"
                  overlayClassName="fixed inset-0 z-40 bg-gray-500 bg-opacity-75"
                >
                  <div
                    className={`flex flex-col gap-4 items-center ${Headings.className}`}
                  >
                    <span className="text-xl text-white">
                      Photo uploaded! Refreshing...
                    </span>
                    <span className="loading loading-spinner text-primary loading-lg" />
                  </div>
                </Modal>
                <Modal
                  isOpen={edited}
                  contentLabel="Loading..."
                  className="fixed inset-0 z-50 flex items-center justify-center"
                  overlayClassName="fixed inset-0 z-40 bg-gray-500 bg-opacity-75"
                >
                  <div
                    className={`flex flex-col gap-4 items-center ${Headings.className}`}
                  >
                    <span className="text-xl text-white">
                      Bio updated! Refreshing...
                    </span>
                    <span className="loading loading-spinner text-primary loading-lg" />
                  </div>
                </Modal>
              </span>
            </div>

            <div
              data-testid="profile"
              className="self-center text-letter text-center"
            >
              {isEditing ? (
                <Fragment>
                  <div className="mt-4 mx-4">
                    <EditProfile
                      id={user.id}
                      isEditing={handleToggle}
                      edited={handleEdited}
                      displayName={user.displayName}
                      username={user.username}
                      currentBio={user.bio}
                      location={user.location}
                    />
                  </div>
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
                  <div className="flex flex-col">
                    <div className="text-2xl ">{user.displayName}</div>
                    <div className="text-letter text-md">{user.userType}</div>
                    <div className="text-gray-400 text-sm">
                      @{user.username}
                    </div>
                  </div>
                  <div className="mb-2">{user.bio}</div>
                  <div className="text-gray-500 gap-2 flex flex-row items-center justify-center">
                    <span>{user.location}</span>
                    <span className=" text-xs text-accent font-bold bg-gray-700 px-3 py-1 rounded-lg cursor-default">
                      Location
                    </span>
                  </div>
                </Fragment>
              )}
            </div>
          </div>
          {user.userType === "Developer" && (
            <div
              className={`${Body.className} artboard rounded-xl gap-2 border-letter lg:border flex flex-col w-full py-12 lg:mx-12 mx-4 mt-4 lg:shadow-md`}
            >
              <Ratings profile={user} />
            </div>
          )}
        </div>
      ) : (
        <div></div>
      )}
    </Fragment>
  );
};

export default ProfileCard;
