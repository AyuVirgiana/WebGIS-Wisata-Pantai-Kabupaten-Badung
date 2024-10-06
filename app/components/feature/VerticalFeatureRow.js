import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMap, faLocationArrow, faCompass, faSearch, faRoute, faCloudSun, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const iconMap = {
  "icon-signin": faSignInAlt,
  "icon-map": faMap,
  "icon-location": faLocationArrow,
  "icon-compass": faCompass,
  "icon-search": faSearch,
  "icon-route": faRoute,
  "icon-weather": faCloudSun,
};

const iconColor = 'rgb(55, 65, 81)'; // Dark gray color

const VerticalFeatureRow = (props) => {
  const verticalFeatureClass = classNames(
    'mt-20',
    'flex',
    'flex-wrap',
    'items-center',
    {
      'flex-row-reverse': props.reverse,
    },
  );

  if (props.type === 'default') {
    return (
      <div className={verticalFeatureClass}>
        <div className="w-full p-6 sm:w-1/2">
          <img src={props.image} alt={props.imageAlt} />
        </div>
  
        <div className="w-full text-center sm:w-1/2 sm:px-6">
          <h3 className="text-2xl font-semibold text-gray-900">{props.title}</h3>
          <div className="mt-6 text-l text-gray-400">{props.description}</div>
          {props.showButton && (
            <div className="mt-12 text-center">
              <button
                onClick={props.onButtonClick}
                className='xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 px-10 py-2 rounded-md cursor-pointer'
              >
                Mulai
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
  

  if (props.type === 'multi-row') {
    return (
      <div className="mt-20">
        <div className="flex flex-wrap">
          {props.row1 && props.row1.map((item, index) => (
            <div key={index} className="w-full sm:w-1/3 p-4 text-center">
              <FontAwesomeIcon icon={iconMap[item.image]} size="2x" color={iconColor} />
              <h3 className="text-xl font-semibold text-gray-900 mt-4">{item.title}</h3>
              <p className="mt-2 text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap mt-8">
          {props.row2 && props.row2.map((item, index) => (
            <div key={index} className="w-full sm:w-1/2 p-4 text-center">
              <FontAwesomeIcon icon={iconMap[item.image]} size="2x" color={iconColor} />
              <h3 className="text-xl font-semibold text-gray-900 mt-4">{item.title}</h3>
              <p className="mt-2 text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap mt-8">
          {props.row3 && props.row3.map((item, index) => (
            <div key={index} className="w-full sm:w-1/2 p-4 text-center">
              <FontAwesomeIcon icon={iconMap[item.image]} size="2x" color={iconColor} />
              <h3 className="text-xl font-semibold text-gray-900 mt-4">{item.title}</h3>
              <p className="mt-2 text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export { VerticalFeatureRow };
