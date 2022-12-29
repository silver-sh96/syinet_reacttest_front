import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Row, Col } from "reactstrap";
import axios from 'axios';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { postcodeScriptUrl } from "react-daum-postcode/lib/loadPostcode";
import { useHistory } from "react-router-dom";

const RegInput = styled.input`
  border: 1px solid #dddddd;
  border-radius: 5px;
  width: 200px;
  height: 40px; 
  margin: 0px;
`;

const StyledForm = styled.form`
  background-color: white;
  padding: 50px;
  border: 1px solid #dddddd;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,.25);
`;

const StyledButton = styled.button`
  height: 40px;
  width: 100px;
  border-radius: 5px;
  border: 1px solid #F1F1F1;
  background-color: #66615B	;
  color: white;
  font-size: 12px;
  margin-left: 5px;
`;

const RegButton = styled(StyledButton)`
  text-align: center;
  margin-left: 47%;
`;

const StyledTable = styled.table`
  border-collapse: separate;
  border-spacing: 5px 10px;
  table-layout: fixed;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`;

const TargetInput = styled(RegInput)`
  width: 100%;
`;

const UserModify = () => {

  const history = useHistory();

  const [userId, setUserId] = useState('');
  const [userPw, setuserPw] = useState('');
  const [userPwCheck, setuserPwCheck] = useState('');
  const [userFirstName, setuserFirstName] = useState('');
  const [userMiddleName, setuserMiddleName] = useState('');
  const [userDept, setuserDept] = useState('');
  const [userPosition, setuserPosition] = useState('');
  const [userRank, setuserRank] = useState('');
  const [userPhone, setuserPhone] = useState('');
  const [userHomePhone, setuserHomePhone] = useState('');
  const [userZipCode, setUserZipCode] = useState('');
  const [userAddr, setUserAddr] = useState('');
  const [userAddrDetail, setuserAddrDetail] = useState('');
  const [userEmail, setuserEmail] = useState('');

  const getParams = new URLSearchParams(window.location.search);
  let getUserId = getParams.get("userId");
      
  useEffect(() => {
  axios.get("http://localhost:8080/react/userSelectForModify.do?userId="+getUserId)
      .then((response) => {
          console.log(response.data[0])
          const info = response.data[0];
          setUserId(info.userId);
          setuserPw(info.userPw);
          setuserFirstName(info.userFirstName);
          setuserMiddleName(info.userMiddleName);
          setuserDept(info.userDept);
          setuserPosition(info.userPosition);
          setuserRank(info.userRank);
          setuserPhone(info.userPhone);
          setSelectPhone(info.userPhone.substring(0,3));
          setPhoneNum(info.userPhone.substring(3,11));
          setuserHomePhone(info.userHomePhone);
          if(info.userHomePhone.substring(0,2) === '02'){
            setSelectHomePhone(info.userHomePhone.substring(0,2));
            setHomePhoneNum(info.userHomePhone.substring(2,10));
          }else{
            setSelectHomePhone(info.userHomePhone.substring(0,3));
            setHomePhoneNum(info.userHomePhone.substring(3,11));
          }
          setuserEmail(info.userEmail);
          setLocal(info.userEmail.split('@')[0]);
          setDomain(info.userEmail.split('@')[1]);
          setUserZipCode(info.userZipCode);
          setUserAddr(info.userAddr);
          setuserAddrDetail(info.userAddrDetail);
      })
  }, []);

    // 부서, 직급, 직책 가져오기 Start
  const [depts, setDepts] = useState([{
    deptNum: '',
    deptName: ''
  }])

  const [ranks, setRanks] = useState([{
    rankNum: '',
    rankName: ''
  }])

  const [positions, setPositions] = useState([{
    positionNum: '',
    positionName: ''
  }])

  useEffect(() => {
    axios.get("http://localhost:8080/react/deptList.do")
      .then((response) => {
        setDepts(response.data);
      })
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8080/react/rankList.do")
      .then((response) => {
        setRanks(response.data);
      })
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8080/react/positionList.do")
      .then((response) => {
        setPositions(response.data);
      })
  }, []);
  // 부서, 직급, 직책 가져오기 End

  // info setting start
  const fnameChange =(e)=>{
    setuserFirstName(e.target.value);
  }

  const mnameChange =(e)=>{
    setuserMiddleName(e.target.value)
  }

  const pwChange =(e)=>{
    setuserPw(e.target.value);
  }

  const pwChkChange =(e)=>{
    setuserPwCheck(e.target.value);
  }

  const addrChange =(e)=>{
    setuserAddrDetail(e.target.value);
  }
  // info setting end

  // 우편번호(주소) 검색 이벤트 Start
  const open = useDaumPostcodePopup(postcodeScriptUrl);
  const handleComplete = (e) => {
    let zipCode = e.zonecode;
    let fullAddress = e.address;
    let extraAddress = '';

    if (e.addressType === 'R') {
      if (e.bname !== '') {
        extraAddress += e.bname;
      }
      if (e.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${e.buildingName}` : e.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }
    setUserZipCode(zipCode);
    setUserAddr(fullAddress);
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };
  // 우편번호(주소) 검색 이벤트 End

  const changeOption =(e)=> {
    console.log(e.target.value);

  }

  // 유효성 검사 Start

  // 이름
  const [isNameValid, setIsNameValid] = useState(false);

  const fnameVaild =(e)=>{
    let name = e.target.name;
    let val = e.target.value;
    console.log(name, val);
    setuserFirstName(val);

    const nameCheck = /([^가-힣\x20])/i;
    if(nameCheck.test(val)){
      setIsNameValid(true);
    }else{
      setIsNameValid(false);
    }
  }

  const mnameVaild =(e)=>{
    let name = e.target.name;
    let val = e.target.value;
    console.log(name, val);
    setuserMiddleName(val);

    const nameCheck = /([^가-힣\x20])/i;
    if(nameCheck.test(val)){
      setIsNameValid(true);
    }else{
      setIsNameValid(false);
    }
  }

  // 비밀번호
  const [isPwValid, setIsPwValid] = useState(false);

  const del =(e)=> {
    console.log(e.target.value);
    setuserPw('');
  }

  const pwVaild =(e)=>{
    let name = e.target.name;
    let val = e.target.value;
    console.log(name, val);

    const pwCheck =	/^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
    const againCheck = /(\w)\1\1\1/;
    let ascSeqCharCnt = 0; // 오름차순 연속 문자 카운트
		let descSeqCharCnt = 0; // 내림차순 연속 문자 카운트  
		let char_0;
		let char_1;
		let char_2; 
		let diff_0_1;
		let diff_1_2;

    for(var i = 0; i < val.length; i++){
      // charAt(): 문자값 반환
      char_0 = val.charAt(i);
      char_1 = val.charAt(i+1);
      char_2 = val.charAt(i+2);
        
      // charCodeAt(): 유니코드값 반환
      diff_0_1 = char_0.charCodeAt(0) - char_1.charCodeAt(0);
      diff_1_2 = char_1.charCodeAt(0) - char_2.charCodeAt(0);
    
      if(diff_0_1 === 1 && diff_1_2 === 1){
        ascSeqCharCnt += 1;
      }
    
      if(diff_0_1 === -1 && diff_1_2 === -1){
        descSeqCharCnt += 1;
      }
    }

    if(userPwCheck === ''){
      if(pwCheck.test(val) || val === ''){
        setIsPwValid(false);
      } else {
        setIsPwValid(true);
      }
  
      if(isPwValid === false){
        if(againCheck.test(val)){
          setIsPwValid(true);
        }
  
        if(ascSeqCharCnt > 1 || descSeqCharCnt > 1){
          setIsPwValid(true);
        }
      }
    } else if(userPwCheck !== '') {
        if(pwCheck.test(userPw)){
          setIsPwValid(false);
        } else {
          setIsPwValid(true);
          setIsPwChkValid(false);
        }

        if(againCheck.test(val)){
          setIsPwValid(true);
          setIsPwChkValid(false);
        }
  
        if(ascSeqCharCnt > 1 || descSeqCharCnt > 1){
          setIsPwValid(true);
          setIsPwChkValid(false);
        }

    }
    
  }

  // 비밀번호 확인
  const [isPwChkValid, setIsPwChkValid] = useState(false);
  const [isPwChkPass, setIsPwChkPass] = useState(false);

  useEffect(() => {
    if(userPw !== '' && userPwCheck !== ''){
      if(isPwValid === false){
        if(userPw === userPwCheck){
          setIsPwChkPass(true);
          setIsPwChkValid(false);
        } else {
          setIsPwChkPass(false);
          setIsPwChkValid(true);
        }
      } else {
        setIsPwChkPass(false);
        setIsPwChkValid(false);
      }

    }
  }, [userPw, userPwCheck]);

  

  // 연락처
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [selectPhone, setSelectPhone] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  
  const selectPhoneChange =(e)=>{
    setSelectPhone(e.target.value);
  }

  const phoneNumChange =(e)=>{
    setPhoneNum(e.target.value);
  }

  useEffect(() => {
    setSelectPhone(selectPhone);
    setPhoneNum(phoneNum);
    setuserPhone(selectPhone + phoneNum);
    console.log(userPhone, "phone!!");
  }, [selectPhone, phoneNum, userPhone]);

  const phoneValid =(e)=>{
    let val = e.target.value;

    const phoneCheck = /^\d{3,4}\d{4}$/;
    if(phoneCheck.test(val)){
      setIsPhoneValid(false);
    }else{
      setIsPhoneValid(true);
    }

    if(val === ''){
      setIsPhoneValid(false);
    }
  }

  // 자택연락처
  const [isHomePhoneValid, setIsHomePhoneValid] = useState(false);
  const [selectHomePhone, setSelectHomePhone] = useState("");
  const [homePhoneNum, setHomePhoneNum] = useState("");

  const selectHomePhoneChange =(e)=>{
    setSelectHomePhone(e.target.value);
  }

  const homePhoneNumChange =(e)=>{
    setHomePhoneNum(e.target.value);
  }

  useEffect(() => {
    setSelectHomePhone(selectHomePhone);
    setHomePhoneNum(homePhoneNum);
    setuserHomePhone(selectHomePhone + homePhoneNum);
    console.log(userHomePhone, "HomePhone!!");
  }, [selectHomePhone, homePhoneNum, userHomePhone]);

  const homePhoneValid =(e)=>{
    let val = e.target.value;

    const homePhoneCheck = /^\d{3,4}\d{4}$/;
    if(homePhoneCheck.test(val)){
      setIsHomePhoneValid(false);
    }else{
      setIsHomePhoneValid(true);
    }

    if(val === ''){
      setIsHomePhoneValid(false);
    }
  }

  // 이메일
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [domainReadonly, setDomainReadonly] = useState(false);
  const [local, setLocal] = useState("");
  const [domain, setDomain] = useState("");

  const localChange =(e)=> {
    setLocal(e.target.value);
  }

  const domainChange =(e)=> {
    setDomain(e.target.value);
  }

  const selectDomainChange =(e)=>{
    console.log(e.target.value);
    let val = e.target.value;

    if(val !== '직접입력'){
      setDomain(val);
      setDomainReadonly(true);
      setIsEmailValid(false);
    }else{
      setDomain("");
      setDomainReadonly(false);
    }
  }

  useEffect(() => {
    setLocal(local);
    setDomain(domain);
    setuserEmail(local + '@' + domain);
    console.log(userEmail, "Email!!");
  }, [local, domain, userEmail]);

  const emailValid =(e)=>{
    let name = e.target.name;
    let val = e.target.value;
    console.log(name, val);

    const localCheck = /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]$/;
    const domainCheck = /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{1,5}$/;

    if(name === 'local'){
      if(localCheck.test(val)){
        setIsEmailValid(false);
      }else{
        setIsEmailValid(true);
      }
    }else{
      if(domainCheck.test(val)){
        setIsEmailValid(false);
      }else{
        setIsEmailValid(true);
      }
    }
    
    if(val === ''){
      setIsEmailValid(false);
    }
  }
  // 유효성 검사 End

  // 사용자 수정 정보 세팅 start
  const params = new URLSearchParams();
  params.append("userFirstName", userFirstName);
  params.append("userMiddleName", userMiddleName);
  params.append("userId", userId);
  params.append("userPw", userPw);
  params.append("userPhone", userPhone);
  params.append("userHomePhone", userHomePhone);
  params.append("userEmail", userEmail);
  params.append("userZipCode", userZipCode);
  params.append("userAddr", userAddr);
  params.append("userAddrDetail", userAddrDetail);
  params.append("userDept", userDept);
  params.append("userRank", userRank);
  params.append("userPosition", userPosition);
  // 사용자 등록 정보 세팅 End

  const userModifyBtn =(e)=> {
    e.preventDefault();

    // 등록 전 유효성 검사 Start
    if(userFirstName === ''){
      alert('사용자 성을 입력하세요.');
      return false;
    }

    if(userMiddleName === ''){
      alert('사용자 이름을 입력하세요.');
      return false;
    }

    if(userPw === ''){
      alert('사용자 암호를 입력하세요.');
      return false;
    }

    if(isPwValid === true){
      alert('암호를 형식에 맞춰 입력하세요.');
      setIsPwValid(true);
      return false;
    }

    if(isPwChkPass === false || userPw !== userPwCheck){
      alert('암호확인이 일치하지 않습니다.');
      setIsPwChkValid(true);
      return false;
    }

    if(userPhone === '' || phoneNum === '' || selectPhone ===''){
      alert('사용자 연락처를 입력하세요.');
      return false;
    }

    if(userHomePhone === '' || homePhoneNum === '' || selectHomePhone === ''){
      alert('사용자 자택 연락처를 입력하세요.');
      return false;
    }

    if(isPhoneValid === true || isHomePhoneValid === true){
      alert('연락처를 형식에 맞게 입력하세요.');
      return false;
    }

    if(local === '' || domain === ''){
      alert('사용자 이메일을 입력하세요.');
      return false;
    }

    if(isEmailValid === true){
      alert('이메일을 형식에 맞게 입력하세요.');
      return false;
    }

    if(userZipCode === '' || userAddrDetail === '' || userZipCode === 'null' || userAddrDetail === 'null'){
      alert('주소를 입력하세요.');
      return false;
    }
    // 등록 전 유효성 검사 End

    axios.post("http://localhost:8080/react/userModify.do", params)
    .then(function() {
      alert('사용자 수정이 정상적으로 처리되었습니다.');
      history.push('/userList');
    })
    .catch((error) => {
      console.log(error);
    })
  }
  // 사용자 수정 실행 End
  

    return (
        <>
      <div className="content">
        <Row>
          <Col md="12"> 
          <StyledForm>
            <StyledTable>
                    <tbody>
                        <tr>
                        <td>사용자 성</td>
                        <td><RegInput type="text" id="userFirstName" value={userFirstName ||''} onChange={fnameChange} onKeyUp={fnameVaild}/></td>
                        <td>사용자 이름</td>
                        <td><RegInput type="text" id="userMiddleName" value={userMiddleName ||''} onChange={mnameChange} onKeyUp={mnameVaild} /></td>
                        </tr>
                        {isNameValid && <tr><td></td><td className="invalid-input" colSpan={5} style={{color:"red", textAlign:"center"}}>유효한 한글값을 입력하세요.</td></tr>}
                        <tr>
                        <td>아이디</td>
                        <td><RegInput type="text" style={{backgroundColor: "lightgrey"}} value={userId ||''} readOnly/></td>
                        </tr>
                        <tr>
                        <td>비밀번호</td>
                        <td><RegInput type="password" value={userPw ||''} onChange={pwChange} onKeyUp={pwVaild} onClick={del}/></td>
                        <td>비밀번호 확인</td>
                        <td><RegInput type="password" value={userPwCheck ||''} onChange={pwChkChange} /></td>
                        </tr>
                        {isPwValid && <tr><td></td><td className="invalid-input" colSpan={5} style={{color:"red", textAlign:"left"}}>반복, 연속되지 않은 영문, 숫자, 특문을 포함한 8~15자 값을 입력하세요.</td></tr>}
                        {isPwChkValid && <tr><td></td><td className="invalid-input" colSpan={5} style={{color:"red", textAlign:"left"}}>비밀번호 확인이 다릅니다.</td></tr>}
                        {isPwChkPass && <tr><td></td><td className="invalid-input" colSpan={5} style={{color:"green", textAlign:"left"}}>사용가능한 비밀번호입니다.</td></tr>}
                        <tr>
                          <td>연락처</td>
                          <td colSpan={2}>
                            <select id="selectPhone" style={{marginRight:"10px", float:"left"}} onChange={selectPhoneChange} value = {selectPhone||''}>
                              <option>010</option>
                              <option>011</option>
                              <option>016</option>
                              <option>017</option>
                              <option>018</option>
                              <option>019</option>
                            </select>
                            <RegInput type="text" className="userRegInput" id="phoneNum" name="phoneNum" style={{width:"200px", float:"left"}} maxLength="8" onChange={phoneNumChange} onKeyUp={phoneValid} value = {phoneNum||''}/>
                            <input type="text" className="userRegInput" id="userPhone" name="userPhone" defaultValue={userPhone ||''} style={{display: "none"}} />
                          </td>
                          {isPhoneValid && <td className="invalid-input" colSpan={2} style={{color:"red", textAlign:"left"}}>-를 제외한 11자리 이하 숫자를 입력해주세요.</td>}
                        </tr>
                        <tr>
                          <td>자택 전화번호</td>
                          <td colSpan={2}>
                            <select id="selectHomePhone" style={{marginRight:"10px", float:"left"}} onChange={selectHomePhoneChange} value = {selectHomePhone||''}>
                              <option>02</option>
                              <option>031</option>
                              <option>032</option>
                              <option>042</option>
                              <option>044</option>
                              <option>051</option>
                              <option>052</option>
                              <option>062</option>
                              <option>063</option>
                              <option>064</option>
                            </select>
                            <RegInput type="text" className="userRegInput" id="homePhoneNum" name="homePhoneNum" style={{width:"200px", float:"left"}} maxLength="8" onChange={homePhoneNumChange} onKeyUp={homePhoneValid} value = {homePhoneNum||''}/>
                            <input type="text" className="userRegInput" id="userHomePhone" name="userHomePhone" defaultValue={userHomePhone ||''} style={{display: "none"}} />
                          </td>
                          {isHomePhoneValid && <td className="invalid-input" colSpan={2} style={{color:"red", textAlign:"left"}}>-를 제외한 7~8자리 숫자를 입력해주세요.</td>}
                        </tr>
                        <tr>
                        <td>개인 이메일</td>
                        <td colSpan={4}>
                          <RegInput type="text" className="userRegInput" id="local" name="local" style={{width:"150px", float:"left"}} onChange={localChange} onKeyUp={emailValid} value={local||''} />
                          <span style={{float:"left", margin:"10px", height:"10px"}}>@</span>
                          {domainReadonly ? 
                            <RegInput type="text" className="userRegInput" id="domain" name="domain" value={domain ||''} style={{width:"150px", float:"left", backgroundColor:"lightgray"}} onChange={domainChange} onKeyUp={emailValid} readOnly/>
                          : <RegInput type="text" className="userRegInput" id="domain" name="domain" value={domain ||''} style={{width:"150px", float:"left"}} onChange={domainChange} onKeyUp={emailValid} />}
                          <select id="selectDomain" value={domain||''} style={{marginLeft:"10px", float:"left", width:"150px"}} onChange={selectDomainChange}>
                            <option>직접입력</option>
                            <option>daum.com</option>
                            <option>gmail.com</option>
                            <option>hanmail.net</option>
                            <option>nate.com</option>
                            <option>naver.com</option>
                            <option>outlook.com</option>
                            <option>yahoo.com</option>
                          </select>
                        </td>
                        {isEmailValid && <td className="invalid-input" colSpan={2} style={{color:"red", textAlign:"left"}}>이메일 형식을 지켜서 작성해주세요.</td>}
                        <td>
                          <input type="text" className="userRegInput" id="local" name="local" defaultValue={userEmail ||''} style={{display: "none"}}/>
                        </td>
                        </tr>
                        <tr>
                        <td>자택 주소</td>
                        <td><RegInput type="text" id="userZipCode" name="userZipCode" style={{backgroundColor: "lightgrey"}} value={userZipCode ||''} readOnly /></td>
                        <td><StyledButton type="button" onClick={handleClick}>우편번호 검색</StyledButton></td>
                        </tr>
                        <tr>
                        <td><RegInput type="hidden"/></td>
                        <td colSpan={3}><TargetInput type="text" id="userAddr" name="userAddr" style={{backgroundColor: "lightgrey"}} value={userAddr ||''} readOnly /></td>
                        </tr>
                        <tr>
                        <td><RegInput type="hidden"/></td>
                        <td colSpan={3}><TargetInput type="text" id="userAddrDetail" name="userAddrDetail" value={userAddrDetail ||''} onChange={addrChange}/></td>
                        </tr>
                        <tr>
                        <td>소속 부서</td>
                            <td>
                            <select style={{width:'200px'}} value={userDept ||''} onChange={changeOption}>
                                {depts.map((dept, deptIdx) => (
                                  <option key={deptIdx}>{dept.deptName}</option>
                                ))} 
                            </select>
                            </td>
                        </tr>
                        <tr>
                        <td>직급</td>
                        <td>
                            <select style={{width:'200px'}} value={userRank ||''} onChange={changeOption}>
                                {ranks.map((rank, rankIdx) => (
                                  <option key={rankIdx}>{rank.rankName}</option>
                                ))} 
                            </select>
                        </td>
                        </tr>
                        <tr>
                        <td>직책</td>
                        <td>
                            <select style={{width:'200px'}} value={userPosition ||''} onChange={changeOption}>
                                {positions.map((position, positionIdx) => (
                                  <option key={positionIdx}>
                                    {position.positionName}
                                  </option>
                                ))}
                            </select>
                        </td>
                        </tr>
                    </tbody>
            </StyledTable><br/><br/><br/>
            <RegButton type="button" id="userModifyBtn" onClick={userModifyBtn}>등록</RegButton>
          </StyledForm>
          
          </Col>
        </Row>
      </div>
    </>
    );
};

export default UserModify;