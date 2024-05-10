"use client";
import { Body } from "@/app/fonts/roboto";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { Fragment, useState, useEffect } from "react";
import { UserType } from "@/app/utils/UserProps";

const UserProfileCard: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      if (!params.username) {
        setUser(null);
      } else {
        const userString = params.username;
        const response = await fetch(`/api/profile/${userString}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        const { user } = await response.json();

        const userInfo = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          profilePicture: user.profilePicture,
          bio: user.bio,
          location: user.location,
          userType: user.userType,
          isAdmin: user.isAdmin
        };

        if (response.ok) {
          setUser(userInfo);
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [params.username, loading]);

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
        <div className="flex ">
          <div
            className={`${Body.className} artboard gap-2 border-letter border flex flex-col flex-1 py-12 w-full lg:mx-12 mx-4 mt-4 shadow-md`}
          >
            <div className="avatar self-center">
              <div
                className={`${Body.className} w-48 border-letter border rounded-full mt-1 shadow-md `}
              >
                <Image
                  className=""
                  src={user.profilePicture}
                  alt="Profile Picture"
                  width={480}
                  height={480}
                />
              </div>
            </div>
            <div className="self-center text-letter text-center">
              <div className="flex flex-col mb-2">
                <div className="text-2xl ">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-letter text-md">{user.userType}</div>
                <div className="text-gray-400 text-sm">@{user.username}</div>
              </div>
              <div className="mb-2">{user.bio}</div>
              <div className="text-gray-500 gap-2 flex flex-row items-center justify-center">
                <span>{user.location}</span>
                <span className=" text-xs text-accent font-bold bg-gray-700 px-3 py-1 rounded-lg cursor-default">
                  Location
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </Fragment>
  );
};

export default UserProfileCard;
