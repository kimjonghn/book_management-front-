/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from 'react';
import Sidebar from "../../components/Sidebar/Sidebar";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import RentalList from "../../components/UI/BookDetail/RentalList/RentalList";

const mainContainer = css`
    padding: 10px;
`;

const BookDetail = () => { // useQuery는 비동기이다. await을 달아주면 동기가 된다
    const { bookId } = useParams(); //Appjs에 Route안에 path안에 bookId를 가져오기위함
    const queryClient = useQueryClient(); //userId를 가지고 오는 용도
    //useQuery = useQuery를 쓰면 isLoading을 쓸수있다 데이터가 갔다 오는동안에 상태값이 null or undifind이면 isLoading실행  data사용가능
    const getBook = useQuery(["getBook"], async() => { // ["캐쉬키"] -> 캐쉬키값 getBook
        const option = { // 필수
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
        }//axios 비동기    //await 요청이 갔다가 돌아올때까지 기다려주는 용도(동기식 처리를 위함)
        const response = await axios.get(`http://localhost:8080/book/${bookId}`, option); //스트링부트로 요청 Token도 같이 보내준다.  //option (params, headers)사용가능 
        return response;
    });

    const getLikeCount = useQuery(["getLikeCount"], async() => {
        const option = { // 필수
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
        }
        const response = await axios.get(`http://localhost:8080/book/${bookId}/like`, option);
        return response;
    });

    const getLikeStatus = useQuery(["getLikeStatus"], async() => {
        const option = { // 필수
            params: {
                userId: queryClient.getQueryData("principal").data.userId
            },
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
        }
        const response = await axios.get(`http://localhost:8080/book/${bookId}/like/status`, option);
        return response;
    });

    const setLike = useMutation(async () => {
        const option = { // 필수
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("accessToken")
            }
        }
        return await axios.post(`http://localhost:8080/book/${bookId}/like`, JSON.stringify({userId: queryClient.getQueryData("principal").data.userId}), option);
    },{ //클릭시 새로고침없이 바로 보여줌
        onSuccess: () => {
            queryClient.invalidateQueries("getLikeCount"); //invalidateQueries 캐시를 삭제해줌 -> 새 data를 받아옴 (버트모양과 갯수가 변함)
            queryClient.invalidateQueries("getLikeStatus");
        }
    });

    const disLike = useMutation(async () => { //delete는 params가 아니라 data가 들어가야 한다 (get요청할때는 params)
        const option = { // 필수
            params: {
                userId: queryClient.getQueryData("principal").data.userId
            },
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
        }
        return await axios.delete(`http://localhost:8080/book/${bookId}/like`, option);
    },{ //클릭시 새로고침없이 바로 보여줌
        onSuccess: () => {
            queryClient.invalidateQueries("getLikeCount");//invalidateQueries 캐시를 삭제해줌 
            queryClient.invalidateQueries("getLikeStatus");
        }
    });
    
    if(getBook.isLoading){
        return <div>불러오는 중...</div>
    }

    if(!getBook.isLoading)
    return (
        <div css={mainContainer}>
            <Sidebar />
            <header>
                <h1>{getBook.data.data.bookName}</h1>
                <p>분류: {getBook.data.data.categoryName} / 저자명: {getBook.data.data.authorName}/ 출판사: {getBook.data.data.publisherName}/ 추천: {getLikeCount.isLoading ? "조회중..." : getLikeCount.data.data}</p>
            </header>
            <main>
                <div>
                    <img src={getBook.data.data.coverImgUrl} alt={getBook.data.data.categoryName} />
                </div>
                <div>
                    <RentalList bookId={bookId}/>
                </div>
                <div>
                    {getLikeStatus.isLoading 
                        ? "" 
                        : getLikeStatus.data.data === 0 
                            ? (<button onClick={() => {setLike.mutate()}}>추천하기</button>) //mutate를 호출하면 usemutation이 호출된다
                            : (<button onClick={() => {disLike.mutate()}}>추천취소</button>)}
                </div>
            </main>
        </div>
    );
};

export default BookDetail;
