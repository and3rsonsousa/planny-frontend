import { useState } from "react";
import Router from "next/router";
import request, { gql } from "graphql-request";
import Logo from "../components/Logo";
import nookies from "nookies";

const Login = (props) => {
  if (nookies.get("planny").user && nookies.get("planny").token) {
    setTimeout(() => {
      Router.push("/");
    }, 500);
  }
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [identifierError, setIdentifierError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const QUERY = gql`
    mutation ($input: UsersPermissionsLoginInput!) {
      login(input: $input) {
        jwt
        user {
          id
          email
        }
      }
    }
  `;

  const handleSubmit = async function (e) {
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

    const data = await request(
      "https://cryptic-beyond-85441.herokuapp.com/graphql",
      QUERY,
      {
        input: loginInput,
      }
    );
    const {
      jwt,
      user: { id, email },
    } = data.login;

    nookies.set(null, "token", jwt, { maxAge: 3 * 24 * 60 * 60 });
    nookies.set(null, "user", id, { maxAge: 3 * 24 * 60 * 60 });

    Router.push("/");
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
              <span>Entrar</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
