import React from 'react';
import Svg, { G, Path, Defs, ClipPath, Rect } from 'react-native-svg';

const SuccessIcon = (props) => (
    <Svg
        width={63}
        height={45}
        viewBox="0 0 63 45"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props} // Allows for styling and other props to be passed in
    >
        <Defs>
            <ClipPath id="clip0_219_1130">
                <Rect width="63" height="45" fill="white" />
            </ClipPath>
        </Defs>
        <G clipPath="url(#clip0_219_1130)">
            <Path
                d="M51.4449 1.98276L24.7813 28.596L11.6474 15.4859C9.13714 12.8427 4.95538 12.7326 2.30733 15.2383C2.22267 15.3189 2.13998 15.4014 2.05926 15.4859C-0.588791 17.9916 -0.699044 22.1657 1.81119 24.809C1.89191 24.8935 1.9746 24.976 2.05926 25.0566L19.9774 42.9442C22.4876 45.5874 26.6694 45.6975 29.3175 43.1918C29.4021 43.1112 29.4848 43.0287 29.5655 42.9442L61.0134 11.5515C63.6614 8.90826 63.6614 4.62404 61.0134 1.9808C58.3653 -0.662448 54.0733 -0.662448 51.4252 1.9808H51.443L51.4449 1.98276Z"
                fill="#2BA948"
            />
            {/* Add any additional paths or elements as needed */}
        </G>
    </Svg>
);

export default SuccessIcon;
