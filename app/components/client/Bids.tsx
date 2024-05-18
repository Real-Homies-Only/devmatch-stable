"use client";
import { Body, Headings } from "@/app/fonts/roboto";
import { BidType } from "@/app/utils/BidProps";
import { ProjectType } from "@/app/utils/ProjectProps";
import { UserType } from "@/app/utils/UserProps";
import { mdiCheck } from "@mdi/js";
import Icon from "@mdi/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import Modal from "react-modal";

interface BidsProps {
  project: ProjectType | null;
  client: UserType | null;
}
const Bids: React.FC<BidsProps> = ({ project, client }) => {
  const [bids, setBids] = useState<BidType[]>([]);
  const [bidsLoading, setBidsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [developerId, setDeveloperId] = useState("");
  const router = useRouter();

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
      <Modal
        isOpen={isModalOpen}
        contentLabel="Project Creation Result"
        className="fixed inset-0 z-50 flex items-center justify-center mx-4"
        overlayClassName="fixed inset-0 z-40 bg-gray-500 bg-opacity-75"
        appElement={document.getElementById("root") || undefined}
      >
        <div className="bg-white p-6 rounded-md shadow-md z-50">
          <h2 className="text-xl mb-4">{modalMessage}</h2>
          <div className="flex justify-end">
            <button
              className="btn btn-primary flex items-center"
              onClick={() => handleAcceptBid(developerId)}
            >
              <Icon path={mdiCheck} size={0.8} className="inline-block mr-2" />
              Accept
            </button>
          </div>
        </div>
      </Modal>
      {project && (
        <div className="flex">
          <div
            className={`${Body.className} artboard lg:border-primary lg:border flex flex-col flex-1 py-12 w-full lg:mx-12 mx-4 lg:mt-4 lg:shadow-md`}
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
                    <div
                      className="avatar"
                      onClick={() =>
                        router.push(`/profile/${bid.userUsername}`)
                      }
                    >
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
                        onClick={() => {
                          setIsModalOpen(true);
                          setDeveloperId(bid.userId);
                          setModalMessage(
                            `Accept bid from ${bid.userDisplayName}?`
                          );
                        }}
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
