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
      if (!params.id) {
        setUser(null);
      } else {
        const idString = params.id;
        const response = await fetch(`/api/user/${idString}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        const { user } = await response.json();

        const userInfo = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
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
  });

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
              <div className="text-2xl mb-4">
                {user.firstName} {user.lastName}
              </div>
              <div className="mb-2">{user.bio}</div>
              <div className="text-gray-500">Location: {user.location}</div>
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
