import * as React from 'react';
import Svg, {Path, Defs, Pattern, Use, Image} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg width={27} height={26} viewBox="0 0 27 26" fill="none" {...props}>
      <Path fill="url(#prefix__pattern0)" d="M0 0h27v26H0z" />
      <Defs>
        <Pattern
          id="prefix__pattern0"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}>
          <Use
            xlinkHref="#prefix__image0"
            transform="matrix(.02 0 0 .02077 0 -.02)"
          />
        </Pattern>
        <Image
          id="prefix__image0"
          width={50}
          height={50}
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB+0lEQVR4nO2YzU7CQBRGZ6AlKQmu3VmjccGKEoI8gMal4hvpq7gXXRp8AE2AYmJYqIm48AUkIRqw41xjEzTSQuebMIs5m5bmcm8/Tn9xhBAMSbVa9Qs5p51UM2XRXqfTeUHOdZDNCM65yzjbTqoRkSig58KDrAp4kDAMn3zf95JqhsPhB3ouPEgURXTSvaP7pgEPkpNUKpW1pJp+v/8mA0fIufAgQRBsubn8Q0rNjlw8Iufak900bBDTgAeRjzxjef29TqtBz4UH6fV6r3Kxj+6bhj205lEul0ulYvEwqWY0Hl8OBoMRci48iOd565znzlJq6IZodpBVYYOYhg1iGjaIadggpmGDmIYNYhqZgzSCYJM57hUTjM9ud3neTfuurGk3avXJr41cdppODm7C8DnL/mQOQgN3a/V7zllz6S9ztvF3kxDs/DZjCELp0JqKzxP56x5975oaQvY6VWmgFKTb7d5JKxeZrMwgbbSol0oP5ZMdYEXZBqEcRNUKwgYBufwqWIHYICBBslpB2SBgN8QMVmA2CFiQZa0gbRDQR5QlrEBtENAgi1pB2yDgD40LWIHbIOBB0qzosEFoeYxPsKLFBqElyDwrumwQ2l6s/rGizQahLciPlZa0ckyfddogtL7qkgFppRmv65ylNUhsJV7XOUv7nw+6TcR8AbtX/iBQTcLOAAAAAElFTkSuQmCC"
        />
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
