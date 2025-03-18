import React, { useState } from 'react';

const LoginPage = () => {
  const [account, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { account, password };

    try {
      // 发送 POST 请求到 API
      const response = await fetch('http://10.5.6.174:9101/api/AD/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key':'3ce17b00-68c3-41a1-812b-f87017b4dfad'
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });

    const result = await response.json();
     console.log(result);
      if (result.result) {
        // 登录成功，保存用户名到 localStorage 并跳转到问卷页面
        localStorage.setItem('username', account);
        window.location.href = '/survey'; // 跳转到问卷页面
      } else {
        setErrorMessage(result.msg);
      }
    } catch (error) {
      console.error('登录错误:', error);
      setErrorMessage('登录失败，请稍后再试');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={account}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>

      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default LoginPage;
