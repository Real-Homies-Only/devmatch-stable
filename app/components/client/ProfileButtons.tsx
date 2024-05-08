"use client";
import React, { Fragment, useContext } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AuthContext } from "@/app/context/AuthContext";
import Icon from "@mdi/react";
import { mdiAccount, mdiDoorOpen } from "@mdi/js";
import { Body } from "@/app/fonts/roboto";

interface ProfileButtonsProps {
  profilePhotoURL: string;
}

const ProfileButtons: React.FC<ProfileButtonsProps> = ({ profilePhotoURL }) => {
  const { logout } = useContext(AuthContext);
  const router = useRouter();
  return (
    <Fragment>
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost avatar dropdown dropdown-end"
      >
        <div
          className={`${Body.className} w-10 border-primary border rounded-full mt-1 shadow-md hover:border-secondary hover:border-2`}
        >
          <Image
            className=""
            src={profilePhotoURL}
            alt="Profile Picture"
            width={480}
            height={480}
          />
        </div>

        <ul
          tabIndex={0}
          className={`${Body.className} dropdown-content justify-center z-[1] menu p-2 shadow-lg mt-1 border border-primary bg-base-100 rounded-box w-52 py-6 gap-4 `}
        >
          <li>
            <div
              onClick={() => router.push("/profile")}
              className="hover:bg-gray-100"
            >
              <a className="flex flex-row">
                <Icon path={mdiAccount} size={1} className="mr-2" />
                <span>Profile</span>
              </a>
            </div>
          </li>
          <li>
            <div onClick={logout} className="hover:bg-gray-100">
              <a className="flex flex-row">
                <Icon path={mdiDoorOpen} size={1} className="mr-2" />
                <span>Sign Out</span>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </Fragment>
  );
};

export default ProfileButtons;