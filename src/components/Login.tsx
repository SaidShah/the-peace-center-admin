import "../styles/Login.css";
import { useState } from "react";
import { TextField, FormLabel, Button } from "@mui/material";

interface LoginProps {
  handleLoginUser: (email: string, password: string) => void;
  isEmailError?: boolean;
  isPasswordError?: boolean;
}

const Login = ({
  handleLoginUser,
  isEmailError,
  isPasswordError,
}: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    handleLoginUser(email, password);
  };

  return (
    <div className="outer-container">
      <div className="input-container">
        <div>
          <FormLabel className="label">Email </FormLabel>
        </div>
        <div style={{ width: "400px !important", margin: "0 auto" }}>
          <TextField
            className="login-textfield"
            error={isEmailError}
            onChange={(e) => setEmail(e.target.value)}
            size="medium"
            id="filled-basic"
            label="Email"
            variant="filled"
            placeholder="email address"
          />
          {isEmailError && (
            <h2 style={{ color: "#f78383" }} className="error-message">
              Please enter a valid email address.
            </h2>
          )}
        </div>
      </div>

      <div className="input-container">
        <div>
          <FormLabel className="label">Password </FormLabel>
        </div>
        <div style={{ width: "400px !important", margin: "0 auto" }}>
          <TextField
            style={{ width: "400px !important" }}
            className="login-textfield"
            error={isPasswordError}
            onChange={(e) => setPassword(e.target.value)}
            size="medium"
            id="filled-basic"
            label="password"
            variant="filled"
            placeholder="password"
          />
          {isPasswordError && (
            <h2 style={{ color: "#f78383" }} className="error-message">
              Please enter a valid email address.
            </h2>
          )}
        </div>
      </div>

      <div className="input-container">
        <div>
          <Button
            onClick={handleLogin}
            className="login-button"
            disabled={email.length == 0 || password.length == 0}
            variant="contained"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Login;
