import { Headings } from "@/app/fonts/roboto";
import {
  mdiCellphone,
  mdiChartBar,
  mdiCubeOutline,
  mdiGamepad,
  mdiStore,
  mdiWeb
} from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";

const CategoriesCarousel = () => {
  return (
    <div className="flex flex-col gap-4 p-4 my-8">
      <div className={`${Headings.className} text-xl`}>
        {" "}
        Find a developer specializing in or clients finding developers for...{" "}
      </div>
      <div className="carousel gap-8 lg:items-center pb-4">
        <div className="carousel-item artboard shadow-lg h-96 w-64 border border-gray-300  rounded-lg px-4 items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <Icon path={mdiWeb} size={7} className="text-gray-400 opacity-30" />
          </div>
          <span className={`${Headings.className} text-2xl z-10`}>
            {" "}
            Web Application{" "}
          </span>
        </div>
        <div className="carousel-item artboard shadow-lg h-96 w-64 border border-gray-300  rounded-lg px-4 items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <Icon
              path={mdiCellphone}
              size={7}
              className="text-gray-400 opacity-30"
            />
          </div>
          <span className={`${Headings.className} text-2xl z-10`}>
            {" "}
            Mobile Application{" "}
          </span>
        </div>
        <div className="carousel-item artboard shadow-lg h-96 w-64 border border-gray-300  rounded-lg px-4 items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <Icon
              path={mdiChartBar}
              size={7}
              className="text-gray-400 opacity-30 "
            />
          </div>
          <span className={`${Headings.className} text-2xl z-10`}>
            Data Science
          </span>
        </div>
        <div className="carousel-item artboard shadow-lg h-96 w-64 border border-gray-300  rounded-lg px-4 items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <Icon
              path={mdiGamepad}
              size={7}
              className="text-gray-400 opacity-30"
            />
          </div>
          <span className={`${Headings.className} text-2xl z-10`}>
            {" "}
            Game Development{" "}
          </span>
        </div>
        <div className="carousel-item artboard shadow-lg h-96 w-64 border border-gray-300  rounded-lg px-4 items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <Icon
              path={mdiCubeOutline}
              size={7}
              className="text-gray-400 opacity-30"
            />
          </div>
          <span className={`${Headings.className} text-2xl z-10`}>
            {" "}
            Computer Aided Design{" "}
          </span>
        </div>
        <div className="carousel-item artboard shadow-lg h-96 w-64 border border-gray-300  rounded-lg px-4 items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <Icon
              path={mdiStore}
              size={7}
              className="text-gray-400 opacity-30"
            />
          </div>
          <span className={`${Headings.className} text-2xl z-10`}>
            {" "}
            E-Commerce{" "}
          </span>
        </div>
        <div className="carousel-item artboard shadow-lg h-96 w-64 border border-gray-300  rounded-lg px-4 items-center justify-center relative">
          <span className={`${Headings.className} text-2xl z-10`}>
            {" "}
            ...and more!{" "}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoriesCarousel;
