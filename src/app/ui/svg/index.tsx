import React from 'react';

export const Svg = (props: any) => {
  const svgProps = {
    style: {
      fill: 'currentColor',
      verticalAlign: 'middle',
    },
    ...props,
    name: `#icon-${props.name}`,
  };
  return (
    <svg {...svgProps} >
      <use xlinkHref={svgProps.name} />
    </svg>
  );
};
