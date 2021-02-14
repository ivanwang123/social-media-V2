import React, { useContext, useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { Button, Form, InputOnChangeData } from "semantic-ui-react";
import { useForm } from "react-hook-form";
import { LOGIN_MUTATION } from "../graphql/user/mutation";
import { LoginType } from "../type/UserType";
import { AuthContext } from "../context/authContext";
import { useHistory } from "react-router-dom";

function Login() {
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    trigger,
  } = useForm<LoginType>();
  const authContext = useContext(AuthContext);

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    register(
      { name: "email" },
      {
        required: "Email is required",
        pattern: {
          value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
          message: "Invalid email address",
        },
      }
    );
    register({ name: "password" }, { required: "Password is required" });
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const res: any = await authContext.login(data);

    if (res.data) {
      history.push(`/profile/${res.data.login.handle}`);
    } else if (res.errors) {
      setError(res.errors[0].message);
    }

    setLoading(false);
  });

  return (
    <div className="form-page-container">
      <Form onSubmit={onSubmit}>
        <h1>Login</h1>
        <Form.Input
          label="Email"
          placeholder="Email"
          name="email"
          type="text"
          autoComplete="off"
          onChange={async (_: any, { name, value }: InputOnChangeData) => {
            setValue(name, value);
            await trigger(name);
          }}
          error={errors.email ? errors.email.message : false}
        />
        <Form.Input
          label="Password"
          placeholder="Password"
          name="password"
          type="password"
          autoComplete="off"
          onChange={async (_: any, { name, value }: InputOnChangeData) => {
            setValue(name, value);
            await trigger(name);
          }}
          error={errors.password ? errors.password.message : false}
        />
        <Button type="submit" primary loading={loading}>
          Login
        </Button>
        {error && <p className="error-msg">{error}</p>}
      </Form>
    </div>
  );
}

export default Login;
