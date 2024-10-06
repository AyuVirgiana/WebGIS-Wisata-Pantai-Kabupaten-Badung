import React from 'react';

const HeroOneButton = (props) => (
  <header className="text-center p-4">
    <h1 className="whitespace-pre-line text-3xl sm:text-4xl md:text-5xl font-bold leading-tight sm:leading-hero text-white">
      {props.title}
    </h1>
    <div className="mb-8 sm:mb-12 mt-2 sm:mt-4 text-lg sm:text-xl md:text-2xl text-white">
      {props.description}
    </div>

    {props.button}
  </header>
);

export { HeroOneButton };
