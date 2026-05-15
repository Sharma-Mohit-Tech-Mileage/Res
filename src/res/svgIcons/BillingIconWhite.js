import * as React from "react"
import {Svg, Path,  ClipPath, G, Defs} from 'react-native-svg';
const BillingIconWhite = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={26}
    fill="none"
    {...props}
  >
    <Path
      fill="#FFF"
      fillRule="evenodd"
      d="M1.962 1.277a4.326 4.326 0 0 0-1.267 3.06v17.305a4.326 4.326 0 0 0 4.326 4.326H30.98a4.326 4.326 0 0 0 4.327-4.326V4.335A4.326 4.326 0 0 0 30.979.01H5.021a4.326 4.326 0 0 0-3.059 1.267Zm1.53 1.53a2.163 2.163 0 0 1 1.53-.634h25.957a2.163 2.163 0 0 1 2.163 2.163V6.5H2.858V4.336c0-.574.228-1.124.634-1.53Zm-.634 8.019h30.284v10.816a2.163 2.163 0 0 1-2.163 2.163H5.021a2.163 2.163 0 0 1-2.163-2.163V10.825Zm2.797 4.96a2.163 2.163 0 0 0-.634 1.53v2.162a2.163 2.163 0 0 0 2.163 2.163h2.163a2.163 2.163 0 0 0 2.164-2.163v-2.163a2.163 2.163 0 0 0-2.164-2.163H7.184c-.573 0-1.124.228-1.53.634Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default BillingIconWhite
