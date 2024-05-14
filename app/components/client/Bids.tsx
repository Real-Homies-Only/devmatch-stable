"use client";
import { Body, Headings } from "@/app/fonts/roboto";
import { ProjectType } from "@/app/utils/ProjectProps";
import { UserType } from "@/app/utils/UserProps";
import Image from "next/image";
import React, { Fragment, useEffect, useState } from "react";

interface Bid {
  id: string;
  bidComment: string;
  projectId: string;
  userId: string;
  userProfilePic: string;
  userUsername: string;
  userDisplayName: string;
}

interface BidsProps {
  project: ProjectType | null;
  client: UserType | null;
}
const Bids: React.FC<BidsProps> = ({ project, client }) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [bidsLoading, setBidsLoading] = useState(true);

  useEffect(() => {
    const getBids = async () => {
      const response = await fetch(`/api/project/${project?.id}/bids`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const { bidList } = await response.json();
      if (response.ok) {
        setBids(bidList);
        setBidsLoading(false);
      } else {
        setBidsLoading(false);
      }
    };
    getBids();
  }, [project, client]);

  const handleAcceptBid = async (userId: string) => {
    const response = await fetch(`/api/project/${project?.id}/bids`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });
    if (response.ok) {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      alert("Error accepting bid.");
    }
  };

  return (
    <Fragment>
      {project && (
        <div className="flex">
          <div
            className={`${Body.className} artboard border-gray-400 border flex flex-col flex-1 py-12 w-full lg:mx-12 mx-4 mt-4 shadow-md`}
          >
            <div className="self-center text-letter text-center mx-4">
              <div className={`${Headings.className}`}>
                <div className="text-2xl ">{project.projectName}</div>
                {client && (
                  <div className="text-gray-400 text-sm">
                    @{client.displayName}
                  </div>
                )}
              </div>

              {bidsLoading ? (
                <span className="loading loading-spinner loading-lg self-center justify-center"></span>
              ) : bids ? (
                bids.map((bid) => (
                  <div
                    key={bid.id}
                    className="flex flex-row border border-gray-300 rounded-xl mt-4 gap-4 p-4"
                  >
                    <div className="avatar">
                      <div
                        className={`${Body.className} w-12 h-12 border-primary border z-10 rounded-full mt-1 shadow-md`}
                      >
                        <Image
                          className=""
                          src={bid.userProfilePic}
                          alt="Profile Picture"
                          width={480}
                          height={480}
                        />
                      </div>
                    </div>
                    <div
                      className={`flex flex-col w-full items-start ${Body.className}`}
                    >
                      <div className="flex flex-row gap-2 items-center justify-center">
                        <div>{bid.userDisplayName}</div>
                        <div className="text-sm text-gray-400">
                          @{bid.userUsername}
                        </div>
                      </div>
                      <div className="max-w-full text-start">
                        {bid.bidComment}
                      </div>
                      <div
                        onClick={() => handleAcceptBid(bid.userId)}
                        className="self-end mt-2"
                      >
                        <button className={`btn btn-accent ${Body.className}`}>
                          Accept Bid
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="mt-4">No bids yet.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Bids;
