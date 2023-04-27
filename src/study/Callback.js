import React, { useState } from 'react';

const Callback = () => {

    const [ cnt, setCnt ] = useState(0); //useState(기본값) 값에 변화가 생기면 재렌더링을 해라!
    let count1 = 0;
    
    const a = (fx, fx2) => { // a함수호출시 fx, fx2라는 매개 변수를 씀
        console.log("A함수 실행"); 
        setCnt(() => fx(fx2)); //fx함수의 결과값이 cnt에 대입 (fx == b) b함수 실행

       
    }
    const b = (fx2) => { //b함수가 호출되면 fx2 대입 fx2(c)
        console.log("B함수 실행");
        count1 = cnt + 100; // count1 = 100
        fx2();  //c 호출
        return count1; //setcnt에 100이 들어감
    }
    const c = () => {
        console.log("C함수 호출");
        console.log(count1) // 100
    }
    //a(b, c)
    //b(c)
    //c()
    const clickHandler = () => {
        a(b, c);
    }

    return (
        <div>
            <button onClick={clickHandler}>버튼</button>
        </div>
    );
};

export default Callback;