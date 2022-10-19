import React, { useState, useEffect } from 'react'
import axios from "axios";
import styled from '@emotion/styled';
import CustomPaper from '../../components/CustomPaper';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const url = 'https://b0055c23-9249-422f-a317-960947120571.mock.pstmn.io';

function CustomFormControlLabel(props){
  return (
    <FormControlLabel 
      control={<Checkbox className = "Checkbox"/>}
      label={
        <Typography variant="body1">
          {props.labeltext}
        </Typography>
      }
      {...props}
    />
  );
}

function CustomTextField(props){
  return (
    <TextField variant="outlined" size="small" error={props.helpermsgcode>-1?false:true} 
    helperText={handleHelperText(props.helpermsgcode)} {...props}
    />
  );
}



/*
1. 별명은 1자 이상 30자 미만으로 입력해주세요.
2. 특수문자는 @#~만 입력해주세요
3. 중복 확인을 해주세요.
4. 사용 중인 별명입니다.
5. 사용 가능한 별명입니다.
*/
function handleHelperText(msgCode) {
  if(msgCode===0) return "";
  else if(msgCode===100) return "사용 가능한 별명입니다.";
  else if(msgCode===101) return "별명을 입력해주세요.";
  else if(msgCode===102) return "30자 미만으로 입력해주세요.";
  else if(msgCode===103) return "특수문자는 @#~만 입력해주세요.";
  else if(msgCode===104) return "중복 확인을 해주세요.";
  else if(msgCode===105) return "사용 중인 별명입니다.";
}

const checkData = [
  { 
    labelText: "이용약관 동의",
    isChecked: false
  },
  { 
    labelText: "개인정보 수집 및 이용 동의",
    isChecked: false
  }
]

export default function SignUp() {
  const [userNicknameMsgCode, setUserNicknameMsgCode] = useState(101);
  const [userEmailErrCode, setUserEmailErrCode] = useState(0);
  const [allowTerms, setAllowTerms] = useState(checkData);

  useEffect(() => {
    setAllowTerms(checkData);
  }, []);

  const handleSubmit = (event) => {
    const { currentTarget } = event;
    event.preventDefault();
    const data = new FormData(currentTarget);
    if(!(data.get('userNickname')
      && data.get('email')
      && data.get('password')
      && data.get('confirmPassword'))){
        console.log("미입력된 항목이 있습니다. 다시 확인해주세요.");
      }
    console.log({
      userNickname: data.get('userNickname'),
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const handleNicknameInput = (e) => {
    const userNickname = e.target.value;

    // 중복 확인 버튼 활성화되어 있을 경우 비활성화
    if(userNickname.length < 1) {
      setUserNicknameMsgCode(101);
    }
    else if(userNickname.length > 29){
      setUserNicknameMsgCode(102);
    }
    else{
      // 중복 확인 버튼 활성화
      setUserNicknameMsgCode(104);
    }
  }

  function handleUserNickname() {
    axios.get(`${url}/api/v1/nicknames/duplicate`).then((response) => {
      const { nickname_is_unique } = response.data
      if(nickname_is_unique) {
        setUserNicknameMsgCode(100);
        // 중복 확인 버튼 비활성화
        // 다음 입력창으로 focus 이동
      }
      else{
        setUserNicknameMsgCode(105);
      }
    })
  }

  function handleUserEmail() {
    axios.get(`${url}/api/v1/users/duplicate`).then((response)=> {
      const { user_is_unique } = response.data
      if(user_is_unique){
        setUserEmailErrCode(1);
      }
      else{
        setUserEmailErrCode(-1);
      }
    }) 
  }

  const handleChange = () => {
    // Component와 연결된 isChecked를 true 혹은 false로 변경한다.
  }

  return (
    <StyledPaper>
      <Typography variant="h5">
          회원가입
      </Typography>
      <Stack component="form" onSubmit={handleSubmit} spacing={2}>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="flex-start" spacing={1}>
            <StyledTextField
              onInput={handleNicknameInput}
              placeholder="별명"
              name="userNickname"
              helpermsgcode={userNicknameMsgCode}
              autoComplete="off"
              inputProps={{maxLength:30}}
            />
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleUserNickname}
              disabled={true}
            >
              중복확인
            </Button>
          </Stack>
          <Stack direction="row" alignItems="flex-start" spacing={1}>
            <StyledTextField
              placeholder="이메일"
              name="email"
              usererrcode={userEmailErrCode}
              autoComplete="email"
            />
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleUserEmail}
            >
              중복확인
            </Button>
          </Stack>
          <StyledTextField
            name="password"
            placeholder="비밀번호"
            type="password"
            autoComplete="password"
          />
          <StyledTextField
            name="confirmPassword"
            placeholder="비밀번호 확인"
            type="password"
            autoComplete="current-password"
          />
        </Stack>
        <Stack>
          <StyledFormControlLabel
          controlvalue = "allowAllTerms"
          labeltext = "전체 동의"
          onChange={handleChange}
          />
          {
            allowTerms.map((allowTerm)=> (
              <StyledFormControlLabel
                key = {allowTerm.labelText}
                labeltext = {allowTerm.labelText}
                checked = {allowTerm.isChecked}
                onChange = {handleChange}
              />
            ))
          }
        </Stack>
        <StyledButton
          size="small"
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          회원가입
        </StyledButton>
      </Stack>
    </StyledPaper>
  )
}

const StyledButton = styled(Button)`
  padding: ${props => props.theme.spacing(5)}, 0;
`;

const StyledFormControlLabel = styled(CustomFormControlLabel)`
  & .Checkbox {
    padding: ${props => props.theme.spacing(0.5, 1)};
    & .MuiSvgIcon-root {
      font-size: 1.2rem;
    }
  }   
`;

const StyledTextField = styled(CustomTextField)`
  & .MuiInputBase-input {
    padding: ${props => props.theme.spacing(0.5, 2)};
  }
`;

const StyledPaper = styled(CustomPaper)`
  & > * {
    :not(:last-child){
      margin-bottom: ${props=> props.theme.spacing(4)};
    }
  }
`;