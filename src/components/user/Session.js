import React, { useRef } from 'react';
// import { getUser } from "../redux/utils/LocalStorage";

//const [refresh, setRefresh] = useState();

let loop;
let loopContinue;

let timer = 0;

const renewToken = () => {
    loop = setTimeout(() => {
        console.log('setTimeout: ', timer);
        timer = timer + 1000;
        if (loopContinue) {
            renewToken();
        }
    }, 1000);
}

export const SetRenewTokenTimer = () => {
    loopContinue = true;
    //alert('Hello!');
    //let timer = 0;
    renewToken();
    // setTimeout(() => {
    //     console.log('setTimeout: ', timer);
    //     timer = timer + 100
    // }, 100);

    //setTimeout(renewToken, 5000);
    //setRefresh(setTimeout(renewToken, 5000))
}

export const SetClearTimer = () => {
    loopContinue = false;
    clearTimeout(loop.current);
}

    
