import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import nookies from "nookies";
import { useRouter } from "next/router";
import Logo from "../components/Logo";

const Login = (props) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [identifierError, setIdentifierError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const [mutateFunction, { data, loading, error }] = useMutation(gql`
    mutation ($loginInput: UsersPermissionsLoginInput!) {
      login(input: $loginInput) {
        jwt
        user {
          id
        }
      }
    }
  `);

  if (data) {
    nookies.set(null, "jwt", data.login.jwt, { maxAge: 3 * 24 * 60 * 60 });
    nookies.set(null, "user", data.login.user.id, { maxAge: 3 * 24 * 60 * 60 });
    const router = useRouter();
    router.push("/");
  }

  const handleSubmit = function (e) {
    e.preventDefault();
    const loginInput = {
      identifier,
      password,
    };

    if (identifier === "") {
      setIdentifierError("Nome de usuário não pode ser em branco.");
      return false;
    }

    if (password === "") {
      setPasswordError("Senha não pode ser em branco.");
      return false;
    }

    mutateFunction({
      variables: { loginInput },
    });
  };

  return (
    <div className="flex h-screen items-center justify-center p-8 bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-72">
        <h3 className="text-xl">
          <Logo />
        </h3>
        <form onSubmit={handleSubmit}>
          <label>
            <span className="block mt-4 mb-2 font-medium">Nome de usuário</span>
            <input
              type="text"
              autoFocus
              className={`input ${
                identifierError && identifier === "" ? "input-error" : ""
              }`}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            ></input>
            {identifierError && identifier === "" ? (
              <div className="text-red-600 py-2 text-xs">{identifierError}</div>
            ) : (
              ""
            )}
          </label>
          <label>
            <span className="block mt-4 mb-2 font-medium">Senha</span>
            <input
              type="password"
              className={`input ${
                passwordError && password === "" ? "input-error" : ""
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            {passwordError && password === "" ? (
              <div className="text-red-600 py-2 text-xs">{passwordError}</div>
            ) : (
              ""
            )}
          </label>
          <div className="flex justify-end mt-4">
            <button type="submit" className="button button-primary">
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
