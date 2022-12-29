/*!

=========================================================
* Paper Dashboard React - v1.3.1
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
// reactstrap components
import { Col } from "reactstrap";
import axios from 'axios';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button'
import { Link } from "react-router-dom";
import '../views/css/UserList.css';
import Pagination from "components/Pagination";
import { useHistory } from "react-router-dom";
import { data } from "jquery";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;

  &:focus, &:hover, &:visited, &:link, &:active {
      text-decoration: none;
  }
  &:active {
    color: blue;
  }
`;

const StyledButton = styled(Button)`
  float: right;
  background-color: #42454c;
`;

const PageSelect = styled.select`
  border: 1px solid #dddddd;
  border-radius: 5px;
  width: 150px;
  height: 40px; 
  text-align: center;
`;

const StyledTable = styled(Table)`
  font-size: .9em;
  box-shadow: 0 2px 5px rgba(0,0,0,.25);
  width: 100%;
  border-collapse: collapse;
  border-radius: 5px;
  overflow: hidden;
`;

const SearchInput = styled.input`
  border: 1px solid #dddddd;
  border-radius: 5px;
  width: 40%;
  height: 40px; 
  margin: 0px;
`;

function UserList() {

  const history = useHistory();

  const [users, setUsers] = useState([{
    userId: '',
    userDept: '',
    userName: '',
    userRank: '',
    userPosition: '',
    userEmail: '',
    userPhone: ''
  }]);

  //사용자 목록 호출 axios
  useEffect(() => {
    axios.get("http://localhost:8080/react/userList.do")
      .then((response) => {
          setUsers(response.data);
      })
  }, []);
  
  const [cntPerPage, setCntPerPage] = useState(5); //보여줄 리스트 row
  const [nowPage, setNowPage] = useState(1); //현재 페이지 num
  const offset = (nowPage - 1) * cntPerPage; //시작점과 끝점을 구하는 offset

  // 리스트 출력 개수
  const onChangePageCnt =(e)=> {
    console.log(e.target.value, 'cntChange');
    let limit = Number(e.target.value);
    setCntPerPage(limit);
    setNowPage(1);
  }

  // searchKey, Value
  const [searchKey, setSearchKey] = useState("userDept");
  const [searchValue, setSearchValue] = useState("");

  // searchKey 변경
  const onChangeSearchKey =(e)=> {
    let key = e.target.value;
    console.log(key);
    setSearchKey(key);
  }

  // searchValue 변경
  const onChangeSearchValue =(e)=> {
    let value = e.target.value;
    console.log(value);
    setSearchValue(value);
    setNowPage(1);
  }

  // 검색
  useEffect(() => {
    axios.get("http://localhost:8080/react/userSearch.do?searchKey="+searchKey+"&searchValue="+searchValue)
    .then((response) => {
        setUsers(response.data)
    })
  }, [searchKey, searchValue]);

  // 체크박스 이벤트
  const [checkedList, setCheckedList] = useState([]);

  // 개별체크
  const checkedInputs =(checked, item)=>{
    if(checked){
      setCheckedList([...checkedList, item]);
    } else if (!checked) {
      setCheckedList(checkedList.filter(el => el !== item));
    };
  }

  // 전체체크
  const allCheck =(checked)=>{
    if(checked){
      const idArray =[];
      users.slice(offset, offset + cntPerPage).forEach((el) => idArray.push(el.userId));
      console.log(idArray);
      setCheckedList(idArray);
    }else{
      setCheckedList([]);
    }
  }

  useEffect(() => {
    console.log(checkedList)
  }, [checkedList])

  // 삭제 이벤트 Start
  const userDelete =()=>{
    console.log(checkedList);
    if(checkedList.length < 1){
      alert('삭제할 대상을 선택해주세요!')
      return false;
    }

    if(window.confirm("정말 삭제하시겠습니까?")){
      //yes
      checkedList.map(check => (
        axios.post("http://localhost:8080/react/userDelete.do?userId="+check)
        .then((response) => {
          history.push('/userList');
        })
        .catch((error) => {
          alert('웨실패')
        })
      ));
      alert('정상적으로 삭제되었습니다.');
    } else {
      //no
      alert('삭제를 취소합니다.');
    };
  }
  // 삭제 이벤트 End

  // 수정 버튼 클릭 이벤트
  const modifyBtn =()=>{
    console.log(1)
    if(checkedList.length === 0){
      alert('수정 대상을 선택해주세요!');
    }else if(checkedList.length > 1){
      alert('수정 대상은 한명만 선택해주세요!');
    }else{
      console.log(checkedList.values);
      history.push('userModify?userId='+checkedList)
    }
  }

  return (
    <>
      <div className="content">  
          <Col md="12">    
              <select onChange={onChangeSearchKey}>
                <option value={"userDept"}>부서</option>
                <option value={"userName"}>이름</option>
                <option value={"userRank"}>직급</option>
                <option value={"userPosition"}>직책</option>
              </select>
              <SearchInput type={"text"} value={searchValue} onChange={onChangeSearchValue} placeholder={"Search..."}></SearchInput>
              <StyledButton type={'button'} style={{backgroundColor: "#FF4646"}} onClick={userDelete}>삭제</StyledButton>
              <StyledButton type={'button'} onClick={modifyBtn}>수정</StyledButton>
              <Link to={'userReg'}><StyledButton>등록</StyledButton></Link>
              <StyledTable hover>
                <thead style={{backgroundColor: "#42454c"}}>
                  <tr>
                    <th style={{width:"5%"}}><input type={"checkbox"} id={'checkAll'} onChange={(e) => allCheck(e.target.checked)} checked={checkedList.length === users.slice(offset, offset + cntPerPage).length ? true : false}/></th>
                    <th style={{width:"15%"}}>부서</th>
                    <th style={{width:"15%"}}>이름</th>
                    <th style={{width:"10%"}}>직급</th>
                    <th style={{width:"15%"}}>직책</th>
                    <th style={{width:"20%"}}>이메일</th>
                    <th style={{width:"20%"}}>연락처</th>
                  </tr>    
                </thead>
                <tbody>
                  {users.length < 1 ? 
                  (<tr>
                    <td colSpan={7} style={{textAlign:"center"}}>검색 결과가 없습니다.</td>
                  </tr>):
                  (users.slice(offset, offset + cntPerPage).map((user, index) => (  
                    <tr key={index}>
                      <td><input type={"checkbox"} name={'checked'+index} id={user.userId} onChange={(e)=> {checkedInputs(e.target.checked, e.target.id)}} checked={checkedList.includes(user.userId) ? true : false}/></td>
                      <td hidden>{user.userId}</td>
                      <td>{user.userDept}</td>
                      <td className="modifyTarget">
                        <StyledLink to={"userModify?userId="+user.userId}>{user.userName}</StyledLink>
                      </td>
                      <td>{user.userRank}</td>
                      <td>{user.userPosition}</td>
                      <td>{user.userEmail}</td>
                      <td>{user.userPhone}</td>  
                    </tr>
                  )))}     
                </tbody>
              </StyledTable>
              <PageSelect 
                type="number"
                value={cntPerPage}
                onChange={onChangePageCnt}>
                <option value={"5"}>5개씩 보기</option>
                <option value={"10"}>10개씩 보기</option>
                <option value={"15"}>15개씩 보기</option>
                <option value={"20"}>20개씩 보기</option>
              </PageSelect>
              <div style={{float: "right"}}>전체 사용자 수 : {users.length}</div>
              <Pagination 
                total={users.length}
                cntPerPage={cntPerPage}
                nowPage={nowPage}
                setNowPage={setNowPage}
                allCheck={allCheck}
              />
          </Col>
      </div>
    </>
  );
}

export default UserList;
