import React, { Fragment, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Body } from "@/app/fonts/roboto";
import { countryList } from "@/app/utils/countries";
import Icon from "@mdi/react";
import { mdiFloppy } from "@mdi/js";

const ProfileFormSchema = z.object({
  bio: z
    .string()
    .min(5, "Bio must at least be 5 characters long!")
    .max(255, "Bio can only be up to 255 characters long!"),
  location: z.enum(countryList, { message: "Please select a valid location" })
});

type ProfileForm = z.infer<typeof ProfileFormSchema>;

interface EditProfileProps {
  id: string;
  currentBio: string;
  location: string;
  isEditing: (value: boolean) => void;
  edited: (value: boolean) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({
  id,
  currentBio,
  location,
  isEditing,
  edited
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEditingForm, setIsEditingForm] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProfileForm>({ resolver: zodResolver(ProfileFormSchema) });

  const handleEdit = async (profileData: ProfileForm) => {
    try {
      const response = await fetch(`/api/user/${id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        edited(true);
        setIsEditingForm(false);
        isEditing(isEditingForm);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error();
      }
    } catch (err) {
      setErrorMessage("There was a problem updating your profile");
    }
  };
  return (
    <Fragment>
      <form
        onSubmit={handleSubmit(handleEdit)}
        className={`${Body.className} self-center w-full flex flex-col gap-4`}
      >
        <div className="gap-1 flex flex-col">
          <textarea
            className="textarea textarea-bordered textarea-primary w-full"
            placeholder="Bio"
            {...register("bio")}
          >
            {currentBio}
          </textarea>

          {errors.bio && (
            <span className="text-letter mb-2 mt-1">
              {String(errors.bio.message)}
            </span>
          )}
        </div>
        <div className="gap-1 self-center flex flex-col">
          <select
            className="select select-primary w-full max-w-xs"
            {...register("location")}
          >
            {location === "None" ? (
              <option disabled selected>
                Location
              </option>
            ) : (
              <option value={location}>{location}</option>
            )}
            {countryList.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors.location && (
            <div className="text-letter">{String(errors.location.message)}</div>
          )}
        </div>

        {errorMessage && (
          <div className="self-center">
            <span className="text-sm text-red-700">{errorMessage}</span>
          </div>
        )}

        <div className="flex flex-1 flex-row self-center gap-8 items-center">
          <button
            type="submit"
            className="btn btn-outline btn-primary self-end"
          >
            <Icon path={mdiFloppy} size={1} /> Save
          </button>
        </div>
      </form>
    </Fragment>
  );
};

export default EditProfile;
