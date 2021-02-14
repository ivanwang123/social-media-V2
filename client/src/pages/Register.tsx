import { useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Button, Form, InputOnChangeData } from "semantic-ui-react";
import { REGISTER_MUTATION } from "../graphql/user/mutation";
import { RegisterType } from "../type/UserType";

function Register() {
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    trigger,
  } = useForm<RegisterType>();
  const [registerMutation, { loading, error, data }] = useMutation(
    REGISTER_MUTATION,
    {
      errorPolicy: "all",
    }
  );

  const history = useHistory();

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
    register({ name: "firstName" }, { required: "First name is required" });
    register({ name: "lastName" }, { required: "Last name is required" });
    register({ name: "handle" }, { required: "Handle is required" });
    register({ name: "age" }, { required: "Age is required" });
  }, []);

  const onSubmit = handleSubmit((data) => {
    registerMutation({
      variables: { ...data, age: parseFloat(data.age) },
    });
  });

  if (data) {
    history.push("/login");
  }

  let errorMsg = "";
  if (error) {
    const graphqlError =
      error.graphQLErrors[0].extensions?.exception.validationErrors[0]
        .constraints;
    if (graphqlError) {
      for (const [key, value] of Object.entries(graphqlError)) {
        errorMsg = value as string;
      }
    } else {
      errorMsg = error.message;
    }
  }

  return (
    <div className="form-page-container">
      <Form onSubmit={onSubmit}>
        <h1>Sign Up</h1>
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
        <Form.Input
          label="Handle"
          placeholder="Handle"
          name="handle"
          type="text"
          autoComplete="off"
          onChange={async (_: any, { name, value }: InputOnChangeData) => {
            setValue(name, value);
            await trigger(name);
          }}
          error={errors.handle ? errors.handle.message : false}
        />
        <Form.Input
          label="First Name"
          placeholder="First Name"
          name="firstName"
          type="text"
          autoComplete="off"
          onChange={async (_: any, { name, value }: InputOnChangeData) => {
            setValue(name, value);
            await trigger(name);
          }}
          error={errors.firstName ? errors.firstName.message : false}
        />
        <Form.Input
          label="Last Name"
          placeholder="Last Name"
          name="lastName"
          type="text"
          autoComplete="off"
          onChange={async (_: any, { name, value }: InputOnChangeData) => {
            setValue(name, value);
            await trigger(name);
          }}
          error={errors.lastName ? errors.lastName.message : false}
        />
        <Form.Input
          label="Age"
          placeholder="Age"
          name="age"
          type="number"
          autoComplete="off"
          onChange={async (_: any, { name, value }: InputOnChangeData) => {
            setValue(name, value);
            await trigger(name);
          }}
          error={errors.age ? errors.age.message : false}
        />
        <Button type="submit" primary loading={loading}>
          Sign Up
        </Button>
        {error && <p className="error-msg">{errorMsg}</p>}
        <div className="padding-3"></div>
      </Form>
    </div>
  );
}

export default Register;
