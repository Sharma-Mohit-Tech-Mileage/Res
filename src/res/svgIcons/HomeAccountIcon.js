import * as React from "react"
import {Svg, Path} from 'react-native-svg';

const HomeAccountIcon = ({ color = "#767676", filled = false, ...props }) => {
  if (filled) {
    // Filled/Active state
    return (
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={28}
        height={28}
        viewBox="0 0 28 28"
        fill="none"
        {...props}
      >
        <Path
          fill={color}
          d="M13.99 12.58c1.67 0 3.27-.66 4.45-1.84a6.289 6.289 0 0 0 1.84-4.45c0-1.67-.66-3.27-1.84-4.45A6.289 6.289 0 0 0 13.99 0c-1.67 0-3.27.66-4.45 1.84A6.289 6.289 0 0 0 7.7 6.29c0 1.67.66 3.27 1.84 4.45a6.289 6.289 0 0 0 4.45 1.84ZM13.99 14.68c-10.47 0-12.57 6.29-12.57 8.38 0 2.09 2.1 2.1 2.1 2.1h20.96s2.1 0 2.1-2.1-2.1-8.38-12.57-8.38h-.02Z"
        />
      </Svg>
    );
  }

  // Outline/Inactive state
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={26}
      height={26}
      viewBox="0 0 26 26"
      fill="none"
      {...props}
    >
      <Path
        fill={color}
        d="M13 12.573A6.287 6.287 0 1 0 13 0a6.287 6.287 0 0 0 0 12.573Zm4.191-6.286a4.191 4.191 0 1 1-8.382 0 4.191 4.191 0 0 1 8.382 0Zm8.383 16.764c0 2.096-2.096 2.096-2.096 2.096H2.522s-2.095 0-2.095-2.096c0-2.095 2.095-8.382 12.573-8.382s12.574 6.287 12.574 8.382Zm-2.096-.008c-.002-.516-.323-2.066-1.744-3.487-1.366-1.366-3.937-2.791-8.734-2.791-4.799 0-7.368 1.425-8.734 2.79-1.421 1.422-1.74 2.972-1.744 3.488h20.956Z"
      />
    </Svg>
  );
};

export default HomeAccountIcon;