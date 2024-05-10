import { Body } from "@/app/fonts/roboto";
import { mdiFacebook, mdiTwitter, mdiYoutube } from "@mdi/js";
import Icon from "@mdi/react";
import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer
      className={`${Body.className} footer p-10 text-gray-100 bg-gray-700 flex flex-col items-center lg:grid`}
    >
      <aside className="flex flex-col gap-2 items-center lg:mb-6">
        <Image
          src="/images/logo-grayscale.png"
          alt="Logo with Text"
          width={150}
          height={40}
        />
        <p>Matching visions with creators</p>
      </aside>
      <nav className="flex flex-col items-center lg:flex-row lg:justify-center">
        <h6 className="footer-title lg:mr-4">Social</h6>
        <div className="grid grid-flow-col gap-4">
          <a>
            <Icon path={mdiTwitter} size={1.2} />
          </a>
          <a>
            <a>
              <Icon path={mdiFacebook} size={1.2} />
            </a>
          </a>
          <a>
            <a>
              <Icon path={mdiYoutube} size={1.2} />
            </a>
          </a>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
