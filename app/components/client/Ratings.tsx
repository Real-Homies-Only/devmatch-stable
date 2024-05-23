import { UserType } from "@/app/utils/UserProps";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiStar, mdiStarOutline } from "@mdi/js";
import { Body, Headings } from "@/app/fonts/roboto";
import { RatingInterface } from "@/app/utils/RatingProps";

interface ProfileProp {
  profile: UserType;
}

const RenderStars = (amount: number) => {
  const stars = [];

  for (let i = 0; i < amount; i++) {
    stars.push(<Icon key={i} path={mdiStar} size={0.7} />);
  }

  for (let i = 0; i < 5 - amount; i++) {
    stars.push(<Icon key={i} path={mdiStarOutline} size={0.7} />);
  }

  return <div className="flex flex-row text-yellow-500">{stars}</div>;
};

const Ratings: React.FC<ProfileProp> = ({ profile }) => {
  const [ratings, setRatings] = useState<RatingInterface[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRatings = async () => {
      const response = await fetch(`/api/user/${profile.id}/ratings`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const { ratings } = await response.json();
      if (response.ok) {
        setRatings(ratings);
      }
      setLoading(false);
    };
    getRatings();
  }, [profile, setRatings]);

  if (loading) {
    return (
      <div className="flex flex-col items-center">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full px-4 gap-4">
      <div className={`${Headings.className}`}>Ratings</div>
      {ratings.length > 0 ? (
        ratings.map((rating) => (
          <div key={rating.id} className="flex flex-row border-y py-4">
            <div className="avatar pb-12 mr-3">
              <div className="w-12 rounded-full">
                <Image
                  alt={rating.project.client.username}
                  width={360}
                  height={360}
                  src={rating.project.client.profilePicture}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm">
                <span>{rating.project.client.displayName}</span>{" "}
                <span className="text-gray-400">
                  @{rating.project.client.username}
                </span>
              </div>
              <div className="text-xs">{RenderStars(3)}</div>

              <div className="text-xs mb-2">{rating.comment}</div>
              <div className="text-xs">
                From project: {rating.project.projectName}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center">
          <span className={`${Body.className}`}>
            User still has no ratings!
          </span>
        </div>
      )}
    </div>
  );
};

export default Ratings;
