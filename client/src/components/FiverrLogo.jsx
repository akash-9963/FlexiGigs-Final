import React from "react";

function FiverrLogo({ fillColor }) {
  
  const imageSrc = "../../flexiggistitle.png"; // Example image URL

  return (
    <svg
      width="89"
      height="27"
      viewBox="0 0 89 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Instead of the original logo, use the image */}
      <image 
        href={imageSrc} 
        x="0" 
        y="0" 
        width="89" 
        height="27" 
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}

export default FiverrLogo;
