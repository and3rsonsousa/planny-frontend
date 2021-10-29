import { useState } from "react";
import Router from "next/router";
import request, { gql } from "graphql-request";
import Logo from "../components/Logo";
import nookies from "nookies";

const Login = (props) => {
  if (nookies.get("planny").token) {
    setTimeout(() => {
      Router.push("/");
    }, 500);
  }
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const QUERY = gql`
    query ($username: String!, $password: String!) {
      profiles(where: { username: $username, password: $password }) {
        id
      }
    }
  `;

  const handleSubmit = async function (e) {
    e.preventDefault();

    if (username === "") {
      setUsernameError("Nome de usuário não pode ser em branco.");
      return false;
    }

    if (password === "") {
      setPasswordError("Senha não pode ser em branco.");
      return false;
    }

    const data = await request(
      // "https://cryptic-beyond-85441.herokuapp.com/graphql",
      "https://api-us-east-1.graphcms.com/v2/ckursm70w0eq101y2982b3c14/master",
      QUERY,
      {
        username,
        password,
      }
    );

    const { id } = data.profiles[0];

    nookies.set(null, "token", id, {
      maxAge: 3 * 24 * 60 * 60,
    });

    Router.push("/");
  };

  return (
    <div className="flex h-screen items-center justify-center p-8 bg-neutral-1">
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
                usernameError && username === "" ? "input-error" : ""
              }`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></input>
            {usernameError && username === "" ? (
              <div className="text-red-600 py-2 text-xs">{usernameError}</div>
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
