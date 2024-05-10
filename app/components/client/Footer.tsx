import {
  mdiFacebook,
  mdiTwitter,
  mdiVideoInputHdmi,
  mdiYoutube
} from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";

const Footer = () => {
  return (
    <footer className="footer p-10 text-gray-100 bg-gray-700">
      <aside className="flex flex-col gap-2 items-start justify-start">
        <a>
          <Icon path={mdiVideoInputHdmi} size={3} />
        </a>
        <p>
          DM
          <br />
          Matching visions with creators
        </p>
      </aside>
      <nav>
        <h6 className="footer-title">Social</h6>
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
