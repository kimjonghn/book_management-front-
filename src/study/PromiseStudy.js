import React from 'react';

const PromiseStudy = () => {

    const a = new Promise((resolve, reject) => { //resolve (정상실행이 될때) , reject (에러가 뜰때)
        console.log("프로미스 호출")    
        if(1 == 1){
            resolve(); // resolve(정상적인 리턴이 됐을때) == then이라는 함수가 실행이 될때 
        } else{
            throw new Error("오류입니다."); //reject(new Error("오류입니다."));
        }
    });
    
    const clickHandler = () => {
        a
        .then(() => {
            console.log("1번 then 호출");
            return new Promise((resolve, reject) => { //resolve() Promise를 다시생성
                resolve("리턴!!");
            })
        })
        .catch((error) => { 
            console.log(error);
        })
        .then(b);
    }
    const b = (str) => { // resolve("리턴!!");
        console.log(str) 
    }
    return (
        <div>
            <button onClick={clickHandler}>버튼</button>
        </div>
    );
};

export default PromiseStudy;