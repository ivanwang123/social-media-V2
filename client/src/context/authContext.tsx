import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { createContext, useEffect, useState } from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import { LOGIN_MUTATION, LOGOUT_MUTATION } from "../graphql/user/mutation";
import { IS_AUTH_QUERY, ME_QUERY } from "../graphql/user/query";
import { LoginType } from "../type/UserType";

type MeType = {
  id: number;
  handle: string;
  fullName: string;
};

interface AuthContextType {
  me: MeType | null;
  login: (data: LoginType) => void;
  logout: () => void;
}

const initialContext: AuthContextType = {
  me: null,
  login: (data: LoginType) => {},
  logout: () => {},
};

const AuthContext = createContext(initialContext);

function AuthProvider({ children }: any) {
  const [loginMutation] = useMutation(LOGIN_MUTATION, {
    errorPolicy: "all",
  });
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);
  const { loading, data: meData, refetch } = useQuery(ME_QUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const login = async (data: LoginType) => {
    const res = await loginMutation({
      variables: data,
    });

    await refetch();
    return res;
  };

  const logout = async () => {
    const res = await logoutMutation();

    await refetch();
    return res;
  };

  return (
    <>
      {loading ? (
        <Dimmer active inverted>
          <Loader size="large" />
        </Dimmer>
      ) : (
        <AuthContext.Provider
          value={{
            me: meData ? meData.me : null,
            login,
            logout,
          }}
        >
          {children}
        </AuthContext.Provider>
      )}
    </>
  );
}

export { AuthContext, AuthProvider };
