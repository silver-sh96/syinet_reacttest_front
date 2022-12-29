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
import { Row, Col } from "reactstrap";
import "../views/css/UserReg.css";
import styled from 'styled-components';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { postcodeScriptUrl } from "react-daum-postcode/lib/loadPostcode";

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


function UserReg() {

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


  // 사용자 등록 정보 세팅 Start
  const history = useHistory();

  const [userInfo, setUserInfo] = useState({
      userFirstName: '',
      userMiddleName: '',
      userId: '',
      userPw: '',
      userPwCheck: '',
      userPhone: '',
      userHomePhone: '',
      userEmail: '',
      userZipCode: '',
      userAddr: '',
      userAddrDetail: '',
      userDept: '',
      userRank: '',
      userPosition: ''
  });

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

    setUserInfo({...userInfo, "userZipCode": zipCode, "userAddr": fullAddress})
    
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };
  // 우편번호(주소) 검색 이벤트 End

  // 유효성 검사 Start

  // 이름
  const [isNameValid, setIsNameValid] = useState(false);

  const nameVaild =(e)=>{
    let name = e.target.name;
    let val = e.target.value;
    console.log(name, val);

    const nameCheck = /([^가-힣\x20])/i;
    if(nameCheck.test(val)){
      setIsNameValid(true);
    }else{
      setIsNameValid(false);
    }
  }

  // 아이디
  const [isIdValid, setIsIdValid] = useState(false);

  const idVaild =(e)=>{
    let name = e.target.name;
    let val = e.target.value;
    console.log(name, val);

    if(e.key.match(/[^0-9]/g)){
      e.target.value =  e.target.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/gi, '');
    }

    const idCheck =	/^[A-Za-z0-9]{6,12}$/;
    if(idCheck.test(val)){
      setIdCheckPass(false);
      setIdCheckFail(false);
      setIsIdValid(false);
      setIdDuplCheck(true);
        
    }else{
      setIdCheckPass(false);
      setIdCheckFail(false);
      setIdDuplCheck(false);
      setIsIdValid(true);
    }

    if(val === ''){
      setIdCheckPass(false);
      setIdCheckFail(false);
      setIsIdValid(false);
      setIdDuplCheck(false);
    }
  }

  // 아이디 중복확인
  const [idDuplCheck, setIdDuplCheck] = useState(false);
  const [idCheckFail, setIdCheckFail] = useState(false);
  const [idCheckPass, setIdCheckPass] = useState(false)

  const onClickIdCheck =()=> {
    axios.get("http://localhost:8080/react/idDupleCheck.do?userId="+userInfo.userId)
    .then((response) => {
      console.log(response.data);
      if(idDuplCheck === true){
        if(response.data > 0){
          setIsIdValid(false);
          setIdDuplCheck(false);
          setIdCheckPass(false);
          setIdCheckFail(true);
        }else{
          setIsIdValid(false);
          setIdDuplCheck(false);
          setIdCheckFail(false);
          setIdCheckPass(true);
        }
      }else{
        alert('아이디 유효성 검사 후 중복검사를 진행하세요.')
      }
    })
    .catch((error) => {
      alert('실패ㅠㅠㅠ');
    })
  }

  // 비밀번호
  const [isPwValid, setIsPwValid] = useState(false);

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

    if(userInfo.userPwCheck === ''){
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
    } else if(userInfo.userPwCheck !== '') {
        if(pwCheck.test(userInfo.userPw)){
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
      if(userInfo.userPw !== '' && userInfo.userPwCheck !== ''){
        if(isPwValid === false){
          if(userInfo.userPw === userInfo.userPwCheck){
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
  }, [userInfo.userPw, userInfo.userPwCheck])
  
  // 연락처
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const phoneValid =(e)=>{
    let name = e.target.name;
    let val = e.target.value;
    console.log(name, val);

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

  const homePhoneValid =(e)=>{
    let name = e.target.name;
    let val = e.target.value;
    console.log(name, val);

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
  
      if(val === ''){
        setIsEmailValid(false);
      }
    }else{
      if(domainCheck.test(val)){
        setIsEmailValid(false);
      }else{
        setIsEmailValid(true);
      }
  
      if(val === ''){
        setIsEmailValid(false);
      }
    }

    
  }
  // 유효성 검사 End

  const [selectPhone, setSelectPhone] = useState("010");
  const selectPhoneChange =(e)=>{
    console.log(e.target.value);
    setSelectPhone(e.target.value);
  }

  const [selectHomePhone, setSelectHomePhone] = useState("02");
  const selectHomePhoneChange =(e)=>{
    console.log(e.target.value);
    setSelectHomePhone(e.target.value);
  }

  const [domainReadonly, setDomainReadonly] = useState(false);

  const [local, setLocal] = useState("");
  const [domain, setDomain] = useState("");

  const selectDomainChange =(e)=>{
    console.log(e.target.value);
    let val = e.target.value;

    if(val !== '직접입력'){
      setDomain(val);
      setDomainReadonly(true);
      let mail = local.concat('@'+ val);
      const nextInputs = { ...userInfo, 'userEmail': mail, };
      setUserInfo(nextInputs);
      setIsEmailValid(false);

    }else{
      setDomain("");
      setDomainReadonly(false);
    }
  }

  const userInfoChange =(e)=>{
    const {name, value} = e.target;

    if(name === 'userPhone'){

      let phoneVal = selectPhone.concat(value);
      const nextInputs = { ...userInfo, [name]: phoneVal, };
      setUserInfo(nextInputs);

    }else if(name === 'userHomePhone'){

      let homePhoneVal = selectHomePhone.concat(value);
      const nextInputs = { ...userInfo, [name]: homePhoneVal, };
      setUserInfo(nextInputs);

    }else if(name === 'local'){

      setLocal(value);
      let mail = local.concat('@'+ domain);
      const nextInputs = { ...userInfo, 'userEmail': mail, };
      setUserInfo(nextInputs);

    }else if(name === 'domain'){

      setDomain(value);
      let mail = local.concat('@'+ domain);
      const nextInputs = { ...userInfo, 'userEmail': mail, };
      setUserInfo(nextInputs);

    }else{
      const nextInputs = { ...userInfo, [name]: value, };
      setUserInfo(nextInputs);
    }
    
  }

  const params = new URLSearchParams();
  params.append("userFirstName", userInfo.userFirstName);
  params.append("userMiddleName", userInfo.userMiddleName);
  params.append("userId", userInfo.userId);
  params.append("userPw", userInfo.userPw);
  params.append("userPhone", userInfo.userPhone);
  params.append("userHomePhone", userInfo.userHomePhone);
  params.append("userEmail", userInfo.userEmail);
  params.append("userZipCode", userInfo.userZipCode);
  params.append("userAddr", userInfo.userAddr);
  params.append("userAddrDetail", userInfo.userAddrDetail);
  params.append("userDept", userInfo.userDept);
  params.append("userRank", userInfo.userRank);
  params.append("userPosition", userInfo.userPosition);
  // 사용자 등록 정보 세팅 End
  
  // 사용자 등록 실행 Start
  useEffect(() => {
    console.log(userInfo)
  }, [userInfo]);

  const regUserInfo =(e)=> {
    e.preventDefault();

    // 등록 전 유효성 검사 Start
    if(userInfo.userFirstName === ''){
      alert('사용자 성을 입력하세요.');
      return false;
    }

    if(userInfo.userMiddleName === ''){
      alert('사용자 이름을 입력하세요.');
      return false;
    }

    if(userInfo.userId === ''){
      alert('사용자 아이디를 입력하세요.');
      return false;
    }

    if(isIdValid === true){
      alert('아이디를 형식에 맞게 작성해주세요.');
      return false;
    }

    if(idCheckPass === false){
      alert('아이디 중복확인을 진행해주세요.');
      setIdDuplCheck(true);
      return false;
    }

    if(userInfo.userPw === ''){
      alert('사용자 암호를 입력하세요.');
      return false;
    }

    if(isPwValid === true){
      alert('암호를 형식에 맞춰 입력하세요.');
      setIsPwValid(true);
      return false;
    }

    if(isPwChkPass === false || userInfo.userPw !== userInfo.userPwCheck){
      alert('암호확인이 일치하지 않습니다.');
      setIsPwChkValid(true);
      return false;
    }

    if(userInfo.userPhone === ''){
      alert('사용자 연락처를 입력하세요.');
      return false;
    }

    if(userInfo.userHomePhone === ''){
      alert('사용자 자택 연락처를 입력하세요.');
      return false;
    }

    if(isPhoneValid === true || isHomePhoneValid === true){
      alert('연락처를 형식에 맞게 입력하세요.');
      return false;
    }

    if(userInfo.userEmail === ''){
      alert('사용자 이메일을 입력하세요.');
      return false;
    }

    if(isEmailValid === true){
      alert('이메일을 형식에 맞게 입력하세요.');
      return false;
    }

    if(userInfo.userZipCode === '' || userInfo.userAddrDetail === ''){
      alert('주소를 입력하세요.');
      return false;
    }

    if(userInfo.userDept === 'default' || userInfo.userDept === ''){
      alert('부서를 선택하세요.');
      return false;
    }

    if(userInfo.userRank === 'default' || userInfo.userRank === ''){
      alert('직급을 선택하세요.');
      return false;
    }

    if(userInfo.userPosition === 'default' || userInfo.userPosition === ''){
      alert('직책을 선택하세요.');
      return false;
    }
    // 등록 전 유효성 검사 End

    axios.post("http://localhost:8080/react/userReg.do", params)
    .then(function() {
      alert('사용자 등록이 정상적으로 처리되었습니다.');
      history.push('/userList');
    })
    .catch((error) => {
      console.log(error);
    })
  }
  // 사용자 등록 실행 End

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12"> 
          <StyledForm id="userRegForm">
            <StyledTable id="userInfoTable">
              <tbody>
                <tr>
                  <td>사용자 성</td>
                  <td><RegInput type="text" className="userRegInput" id="userFirstName" name="userFirstName" onChange={userInfoChange} onKeyUp={nameVaild}/></td>
                  <td>사용자 이름</td>
                  <td><RegInput type="text" className="userRegInput" id="userMiddleName" name="userMiddleName" onChange={userInfoChange} onKeyUp={nameVaild}/></td>
                </tr>
                {isNameValid && <tr><td></td><td className="invalid-input" colSpan={5} style={{color:"red", textAlign:"center"}}>유효한 한글값을 입력하세요.</td></tr>}
                <tr>
                  <td>아이디</td>
                  <td><RegInput type="text" className="userRegInput" id="userId" name="userId" onChange={userInfoChange} onKeyUp={idVaild}/></td>
                  <td><StyledButton type="button" onClick={onClickIdCheck}>중복확인</StyledButton></td>
                </tr>
                {isIdValid && <tr><td></td><td className="invalid-input" colSpan={3} style={{color:"red", textAlign:"left"}}>6~12자 사이의 영문,숫자 값을 입력하세요.</td></tr>}
                {idDuplCheck && <tr><td></td><td className="invalid-input" colSpan={3} style={{color:"red", textAlign:"left"}}>아이디 중복확인을 진행해주세요.</td></tr>}
                {idCheckFail && <tr><td></td><td className="invalid-input" colSpan={3} style={{color:"red", textAlign:"left"}}>아이디가 존재합니다. 다른아이디를 사용하세요.</td></tr>}
                {idCheckPass && <tr><td></td><td className="invalid-input" colSpan={3} style={{color:"green", textAlign:"left"}}>사용가능한 아이디입니다.</td></tr>}
                <tr>
                  <td>비밀번호</td>
                  <td><RegInput type="password" className="userRegInput" id="userPw" name="userPw" onChange={userInfoChange} onKeyUp={pwVaild}/></td>
                  <td>비밀번호 확인</td>
                  <td><RegInput type="password" id="userPwCheck" name="userPwCheck" onChange={userInfoChange}/></td>  
                </tr>
                {isPwValid && <tr><td></td><td className="invalid-input" colSpan={5} style={{color:"red", textAlign:"left"}}>반복, 연속되지 않은 영문, 숫자, 특문을 포함한 8~15자 값을 입력하세요.</td></tr>}
                {isPwChkValid && <tr><td></td><td className="invalid-input" colSpan={5} style={{color:"red", textAlign:"left"}}>비밀번호 확인이 다릅니다.</td></tr>}
                {isPwChkPass && <tr><td></td><td className="invalid-input" colSpan={5} style={{color:"green", textAlign:"left"}}>사용가능한 비밀번호입니다.</td></tr>}
                <tr>
                  <td>연락처</td>
                   <td colSpan={2}>
                      <select id="phoneF" style={{marginRight:"10px", float:"left"}} onChange={selectPhoneChange}>
                        <option defaultChecked>010</option>
                        <option>011</option>
                        <option>016</option>
                        <option>017</option>
                        <option>018</option>
                        <option>019</option>
                      </select>
                      <RegInput type="text" className="userRegInput" id="userPhone" name="userPhone" style={{width:"200px", float:"left"}} maxLength="8" onChange={userInfoChange} onKeyUp={phoneValid}/>
                  </td>
                  {isPhoneValid && <td className="invalid-input" colSpan={2} style={{color:"red", textAlign:"left"}}>-를 제외한 7~8자리 숫자를 입력해주세요.</td>}
                </tr>
                <tr>
                  <td>자택 전화번호</td>
                  <td colSpan={2}>
                    <select id="homePhoneF" style={{marginRight:"10px", float:"left"}} onChange={selectHomePhoneChange}>
                      <option defaultChecked>02</option>
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
                    <RegInput type="text" className="userRegInput" id="userHomePhone" name="userHomePhone" style={{width:"200px", float:"left"}} maxLength="8" onChange={userInfoChange} onKeyUp={homePhoneValid}/>
                  </td>
                  {isHomePhoneValid && <td className="invalid-input" colSpan={2} style={{color:"red", textAlign:"left"}}>-를 제외한 7~8자리 숫자를 입력해주세요.</td>}
                </tr>
                <tr>
                  <td>개인 이메일</td>
                  <td colSpan={4}>
                    <RegInput type="text" className="userRegInput" id="local" name="local" style={{width:"150px", float:"left"}} onChange={userInfoChange} onKeyUp={emailValid} />
                    <span style={{float:"left", margin:"10px", height:"10px"}}>@</span>
                    {domainReadonly ? 
                      <RegInput type="text" className="userRegInput" id="domain" name="domain" value={domain ||''} style={{width:"150px", float:"left", backgroundColor:"lightgray"}} onChange={userInfoChange} onKeyUp={emailValid} readOnly/>
                    : <RegInput type="text" className="userRegInput" id="domain" name="domain" value={domain ||''} style={{width:"150px", float:"left"}} onChange={userInfoChange} onKeyUp={emailValid} />}
                    <select id="selectDomain" style={{marginLeft:"10px", float:"left", width:"150px"}} onChange={selectDomainChange}>
                      <option defaultChecked>직접입력</option>
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
                </tr>
                <tr>
                  <td>자택 주소</td>
                  <td><RegInput type="text" style={{backgroundColor: "lightgrey"}} className="userRegInput" id="userZipCode" name="userZipCode" value={userInfo.userZipCode||''} readOnly/></td>
                  <td>
                    <StyledButton type="button" onClick={handleClick}>우편번호 검색</StyledButton>
                  </td>
                </tr>
                <tr>
                  <td><RegInput type="hidden"/></td>
                  <td colSpan={3}><TargetInput type="text" style={{backgroundColor: "lightgrey"}} className="userRegInput" id="userAddr" name="userAddr" value={userInfo.userAddr||''} readOnly/></td>
                </tr>
                <tr>
                  <td><RegInput type="hidden"/></td>
                  <td colSpan={3}><TargetInput type="text" className="userRegInput" id="userAddrDetail" name="userAddrDetail" onChange={userInfoChange} /></td>
                </tr>
                <tr>
                  <td>소속 부서</td>
                    <td>
                      <select style={{width:'200px'}} className="userRegInput" id="userDept" name="userDept" onChange={userInfoChange}>
                        <option value={"default"}>: : : 부서 선택 : : :</option>
                        {depts.map((dept, deptIdx) => (
                          <option key={deptIdx}>{dept.deptName}</option>
                        ))} 
                      </select>
                    </td>
                </tr>
                <tr>
                  <td>직급</td>
                  <td>
                    <select style={{width:'200px'}} className="userRegInput" id="userRank" name="userRank" onChange={userInfoChange}>
                      <option value={"default"}>: : : 직급 선택 : : :</option>
                      {ranks.map((rank, rankIdx) => (
                        <option key={rankIdx}>{rank.rankName}</option>
                      ))} 
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>직책</td>
                  <td>
                    <select style={{width:'200px'}} className="userRegInput" id="userPosition" name="userPosition" onChange={userInfoChange}>
                      <option value={"default"}>: : : 직책 선택 : : :</option>
                      {positions.map((position, positionIdx) => (
                        <option key={positionIdx}>{position.positionName}</option>
                      ))} 
                    </select>
                  </td>
                </tr>
              </tbody>
            </StyledTable><br/><br/><br/>
            <RegButton type="button" id="userRegBtn" style={{float:"left", margin:"0", marginLeft:"45%"}} onClick={regUserInfo}>등록</RegButton>
            <RegButton type="button" id="userRegBtn" style={{float:"left", marginLeft:"20px"}} onClick={regUserInfo}>취소</RegButton>
            <br/>
          </StyledForm>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default UserReg;
