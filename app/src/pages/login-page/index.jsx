import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VscLock, VscMail } from "react-icons/vsc";
import api from "../../services/api";
import "./login-page.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      setLoading(false);
      return;
    }

    try {
      const result = await api.login(email, password);
      if (result.success) {
        // Store user info in localStorage if you want to persist it
        localStorage.setItem('user', JSON.stringify(result.user));
        navigate("/home");
      } else {
        // Display the specific error message from the backend
        setError(result.message);
      }
    } catch (error) {
      setError("Erro ao conectar-se ao servidor");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-shape"></div>
        <div className="login-shape"></div>
      </div>

      <div className="login-card">
        <div className="login-logo">
          <img src="/mentor.svg" alt="MentorIA" />
          <div className="login-logo-text">
            <h1>MentorIA</h1>
            <p>Trilhas de aprendizagem</p>
          </div>
        </div>

        <h2 className="login-title">Faça login na plataforma</h2>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <VscMail className="input-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="input-wrapper">
              <VscLock className="input-icon" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Lembrar-me</label>
            </div>
            <a href="#" className="forgot-password">Esqueceu a senha?</a>
          </div>

          <button
            type="submit"
            className={`login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-footer">
          <p>Não tem uma conta? <a href="#">Fale com sua instituição</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;