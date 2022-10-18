import React, { useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CustomPaper from '../../components/CustomPaper';
import { useTheme } from '@mui/material/styles';
import styled from '@emotion/styled';
import axios from "axios";

const url = 'https://b0055c23-9249-422f-a317-960947120571.mock.pstmn.io';

function CustomFormControlLabel(props){
  return (
    <FormControlLabel 
      control={<Checkbox className = "Checkbox" value={props.controlvalue}/>}
      label={
        <Typography variant="body1">
          {props.labeltext}
        </Typography>
      }
      {...props}
    />
  );
}

const StyledFormControlLabel = styled(CustomFormControlLabel)`
  & .Checkbox {
    padding: ${props => props.theme.spacing(0.5, 1)};
    & .MuiSvgIcon-root {
      font-size: 1.2rem;
    }
  }   
`;

function CustomTextField(props){
  return (
    <TextField variant="outlined" size="small" error={props.usererrcode>-1?false:true} 
    helperText={handleHelperText(props.usererrcode)} {...props}
    />
  );
}

const StyledTextField = styled(CustomTextField)`
  & .MuiInputBase-input {
    padding: ${props => props.theme.spacing(0.5, 2)};
  }
`;

/*
1. 별명은 1자 이상 30자 미만으로 입력해주세요.
2. 특수문자는 @#~만 입력해주세요
3. 중복 확인을 해주세요.
4. 사용 중인 별명입니다.
5. 사용 가능한 별명입니다.
*/
function handleHelperText(usererrcode) {
  if(usererrcode===0) return "";
  else if(usererrcode===100) return "별명을 입력해주세요.";
  else if(usererrcode===200) return "30자 이하로만 입력 가능합니다.";
  else if(usererrcode===300) return "특수문자는 @#~만 입력해주세요.";
  else if(usererrcode===400) return "중복 확인을 해주세요.";
  else if(usererrcode===500) return "사용 중인 별명입니다.";
  else if(usererrcode===600) return "사용 가능한 별명입니다.";
}

export default function SignUp() {
  const theme = useTheme();

  const [userNickname, setUserNickname] = useState('')
  const [userNicknameErrCode, setUserNicknameErrCode] = useState(0)
  const [userEmail, setUserEmail] = useState('')
  const [userEmailErrCode, setUserEmailErrCode] = useState(0)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [allowAllterms, setAllowAllterms] = useState(false)
  const [allowServiceTerms, setAllowServiceTerms] = useState(false)
  const [allowPrivateTerms, setAllowPrivateTerms] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
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

  function handleUserNickname() {
    axios.get(`${url}/api/v1/nicknames/duplicate`).then((response)=> {
      if(response.data.user_is_unique){
        setUserEmailErrCode(1);
      }
      else{
        setUserEmailErrCode(-1);
      }
    })
  }

  function handleUserEmail() {
    axios.get(`${url}/api/v1/users/duplicate`).then((response)=> {
      if(response.data.nickname_is_unique){
        setUserEmailErrCode(1);
      }
      else{
        setUserEmailErrCode(-1);
      }
    }) 
  }

  return (
    <CustomPaper sx={{gap: theme.spacing(5, 0)}}>
      <Typography variant="h5">
          회원가입
      </Typography>
      <Stack component="form" onSubmit={handleSubmit} spacing={2}>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="flex-start" spacing={1}>
            <StyledTextField
              value={userNickname}
              onInput={(e) => {
                if(e.target.value.length < 1) {
                  setUserNicknameErrCode(100);
                  setUserNickname(e.target.value);
                }
                else if(e.target.value.length > 30){
                  setUserNicknameErrCode(200);
                }
                else{
                  setUserNicknameErrCode(0);
                  setUserNickname(e.target.value);
                }
              }}
              placeholder="별명"
              name="userNickname"
              usererrcode={userNicknameErrCode}
              autoComplete="off"
            />
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleUserNickname}
            >
              중복확인
            </Button>
          </Stack>
          <Stack direction="row" alignItems="flex-start" spacing={1}>
            <StyledTextField
              value={userEmail}
              onInput={(e) => setUserEmail(e.target.value)}
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
            value={password}
            onInput={(e) => setPassword(e.target.value)}
            name="password"
            placeholder="비밀번호"
            type="password"
            autoComplete="password"
          />
          <StyledTextField
            value={confirmPassword}
            onInput={(e) => setConfirmPassword(e.target.value)}
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
          checked={allowAllterms}
          onChange={(e)=>{
            setAllowAllterms(e.target.checked);
            setAllowServiceTerms(e.target.checked);
            setAllowPrivateTerms(e.target.checked);
          }}
          theme={theme}
          />
          <StyledFormControlLabel
            controlvalue = "allowServiceTerms"
            labeltext = "이용약관 동의"
            checked={allowServiceTerms}
            onChange={(e)=> setAllowServiceTerms(e.target.checked)}
          />
          <StyledFormControlLabel
            controlvalue = "allowPrivateTerms"
            labeltext = "개인정보 수집 및 이용 동의"
            checked={allowPrivateTerms}
            onChange={(e)=> setAllowPrivateTerms(e.target.checked)}
          />
        </Stack>
        <Button
          size="small"
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{paddingTop:1.2, paddingBottom:1.2}}
        >
          회원가입
        </Button>
      </Stack>
    </CustomPaper>
  )
} 