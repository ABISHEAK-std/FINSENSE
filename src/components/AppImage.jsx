import React from 'react';

function Image({
  src,
  alt = "Image Name",
  className = "",
  ...props
}) {

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.target.src = "D:\finsense_ai\finsense_ai\FINSENCE-LOGO.jpg"
      }}
      {...props}
    />
  );
}

export default Image;
