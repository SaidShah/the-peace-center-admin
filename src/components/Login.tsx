import { useState } from 'react';
import { TextField, FormLabel, Button } from "@mui/material";

interface LoginProps {
  handleLoginUser: (email: string, password: string) => void;
  isEmailError?: boolean;
  isPasswordError?: boolean;
}

const Login = ({handleLoginUser, isEmailError, isPasswordError}: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 

  const handleLogin = () => {
    handleLoginUser(email, password);
  };

  return (
    <div style={{padding: "10% 0"}} className="">
      <div style={{padding: "2% 2%", textAlign: "center"}}>
        <div>
          <FormLabel style={{fontSize: "2rem", fontWeight: "bold", color: "black"}}>Email </FormLabel>
        </div>
        <div>
          <TextField style={{background: "white", width: "300px"}} error={isEmailError} onChange={e => setEmail(e.target.value)} size="medium" id="filled-basic" label="Email" variant="filled" placeholder="email address"/>
        </div>
      </div>

      <div style={{padding: "2% 2%", textAlign: "center"}}>
        <div>
          <FormLabel style={{fontSize: "2rem", fontWeight: "bold", color: "black"}}>Password </FormLabel>
        </div>
        <div>
          <TextField style={{background: "white", width: "300px", color: "black"}} error={isPasswordError} onChange={e => setPassword(e.target.value)} size="medium" id="filled-basic" label="password" variant="filled" placeholder="password"/>
        </div>
      </div>

      <div style={{padding: "2% 2%", textAlign: "center"}}>
        <div>
          <Button onClick={handleLogin} style={{width: "200px", height: "50px"}} disabled={email.length == 0 && password.length == 0} variant="contained">Login</Button>
        </div>
      </div>
    </div>
  );
}
export default Login;
