"use client";
import { Body, Headings } from "@/app/fonts/roboto";
import { mdiArrowLeft } from "@mdi/js";
import Icon from "@mdi/react";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import Modal from "react-modal";

const BidForm: React.FC = () => {
  const [bidComment, setBidComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const params = useSearchParams();
  const projectId = params.get("projectId");
  const developerId = params.get("developerId");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!projectId || !developerId) return;
    console.log("Submitting bid:", { bidComment, userId: developerId });

    try {
      const response = await fetch(`/api/bids/${projectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bidComment, userId: developerId })
      });

      if (response.ok) {
        setModalMessage("Bid submitted successfully!");
        setIsModalOpen(true);
        setBidComment("");
      } else {
        const { message } = await response.json();
        if (message) {
          setModalMessage(message);
        }

        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error submitting bid:", error);
      setModalMessage("Error submitting bid.");
      setIsModalOpen(true);
    }
  };

  return (
    <div
      id="bid-page-container"
      className={`${Body.className} p-4 border border-gray-300 rounded-lg`}
    >
      <Modal
        id="success-bid-modal"
        isOpen={isModalOpen}
        contentLabel="Bid REsult"
        className="fixed inset-0 z-50 flex items-center justify-center"
        overlayClassName="fixed inset-0 z-40 bg-gray-500 bg-opacity-75"
        appElement={document.getElementById("root") || undefined}
      >
        <div className="bg-white p-6 rounded-md shadow-md z-50">
          <h2 className="text-xl font-bold mb-4">{modalMessage}</h2>
          <div className="flex justify-end">
            <button
              className="btn btn-primary flex items-center"
              onClick={() => router.push("/")}
            >
              <Icon
                path={mdiArrowLeft}
                size={0.8}
                className="inline-block mr-2"
              />
              Back to Home
            </button>
          </div>
        </div>
      </Modal>
      <div className={`${Headings.className} text-xl mb-2`}>Submit a Bid</div>
      <form id="bid-form" onSubmit={handleSubmit}>
        <textarea
          id="bid-comment-textarea"
          className={`${Body.className} w-full h-32 border border-gray-300 rounded-lg p-2`}
          placeholder="Enter your bid comment..."
          value={bidComment}
          onChange={(e) => setBidComment(e.target.value)}
          required
        />
        <button
          id="submit-bid-button"
          type="submit"
          className={`btn btn-primary ${Body.className} mt-2`}
        >
          Submit Bid
        </button>
      </form>
    </div>
  );
};

export default BidForm;
