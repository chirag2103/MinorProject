import { useState, FormEvent } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import '../styles/signin.scss';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();
    let userData = {
      email: email,
      password: password,
    };
    let userDataJSON = JSON.stringify(userData);
    axios
      .post('http://localhost:4000/api/login', userDataJSON, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .then((res: AxiosResponse) => {
        console.log(res);
        const token = res.data.token;
        localStorage.setItem('token', token);

        navigate('/admin/dashboard');
      })
      .catch((err: AxiosError) => {
        alert(err);
      });
  };

  return (
    <>
      <div className='main-container'>
        <div className='container'>
          <form action='' className='form signin' onSubmit={handleLogin}>
            <h2>Sign In</h2>
            <div className='inputFields'>
              <input
                type='email'
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                required
              />
              <span>email</span>
            </div>
            <div className='inputFields'>
              <input
                type='password'
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                required
              />
              <span>password</span>
            </div>
            <div className='inputFields'>
              <input type='submit' />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
