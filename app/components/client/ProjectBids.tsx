"use client";
import { Body, Headings } from "@/app/fonts/roboto";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const BidForm: React.FC = () => {
  const [bidComment, setBidComment] = useState("");
  const params = useSearchParams();
  const projectId = params.get("projectId");
  const developerId = params.get("developerId");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!projectId || !developerId) return;
    console.log("Submitting bid:", { bidComment, userId: developerId });

    try {
      const response = await fetch(`/api/ProjectBid/${projectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bidComment, userId: developerId })
      });

      if (response.ok) {
        alert("Bid submitted successfully!");
        setBidComment("");
        router.push("/");
      } else {
        alert("Error submitting bid.");
      }
    } catch (error) {
      console.error("Error submitting bid:", error);
      alert("Error submitting bid.");
    }
  };

  return (
    <div className={`${Body.className} p-4 border border-gray-300 rounded-lg`}>
      <div className={`${Headings.className} text-xl mb-2`}>Submit a Bid</div>
      <form onSubmit={handleSubmit}>
        <textarea
          className={`${Body.className} w-full h-32 border border-gray-300 rounded-lg p-2`}
          placeholder="Enter your bid comment..."
          value={bidComment}
          onChange={(e) => setBidComment(e.target.value)}
          required
        />
        <button
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
