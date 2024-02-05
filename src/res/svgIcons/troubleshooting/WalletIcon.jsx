import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const WalletIcon = (props) => (
    <Svg
        width={121}
        height={121}
        viewBox="0 0 121 121"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Defs>
            <LinearGradient
                id="paint0_linear_223_1459"
                x1="29"
                y1="24.5"
                x2="117"
                y2="125.5"
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#8D3B90" />
                <Stop offset="1" stopColor="#353091" />
            </LinearGradient>
        </Defs>
        <Path
            d="M88.75 73.0556H88.8128M4 16.5556V104.444C4 111.379 9.62131 117 16.5556 117H104.444C111.379 117 117 111.379 117 104.444V41.6667C117 34.7324 111.379 29.1111 104.444 29.1111L16.5556 29.1111C9.62131 29.1111 4 23.4898 4 16.5556ZM4 16.5556C4 9.62131 9.62132 4 16.5556 4H91.8889M91.8889 73.0556C91.8889 74.7891 90.4836 76.1944 88.75 76.1944C87.0164 76.1944 85.6111 74.7891 85.6111 73.0556C85.6111 71.322 87.0164 69.9167 88.75 69.9167C90.4836 69.9167 91.8889 71.322 91.8889 73.0556Z" // Make sure this path data is correct
            stroke="url(#paint0_linear_223_1459)"
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default WalletIcon;
