import React from 'react';
import {FooterCopyright} from './FooterCopyright'

const CenteredFooter = (props) => (
  <div className="text-center text-gray-400">
    {props.logo}

    <nav>
      <ul className="navbar mt-5 flex flex-row justify-center text-xl font-medium text-gray-800">
        {props.children}
      </ul>
    </nav>

    <div className="mt-8 text-sm">
      {/* <FooterIconList>{props.iconList}</FooterIconList> */}
      <FooterCopyright />
    </div>

    <style jsx>
      {`
        .navbar :global(li) {
          @apply mx-4;
        }
      `}
    </style>
  </div>
);

export { CenteredFooter };
