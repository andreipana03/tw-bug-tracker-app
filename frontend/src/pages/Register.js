import React,{useState} from 'react';
import { useNavigate,Link } from 'react-router-dom';

const Register=()=>{
  const navigate=useNavigate()
  const [formData,setFormData]=useState({
    email:'',
    password:'',
    role:'MP'
  });

  const [error,setError]=useState('');

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.name] :e.target.value});
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setError('');

    if(formData.password.length<6){
      setError("Parola trebuie sa aiba minim 6 caractere");
      return;
    }

    try{
      const response=await fetch('http://localhost:5000/api/users',{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data=await response.json();

      if(!response.ok){
        throw new Error(data.message || 'Eroare la înregistrare');
      }

      alert('Cont creat! Te rugăm să te autentifici.');
      navigate('/login');
    }catch(err){
      setError(err.message);

    }
  };

  return (
    <div className='auth-container'>
      <h2>Inregistrare</h2>
      {error && <div className='error'>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type='email' name='email' placeholder='Email' onChange={handleChange}></input>
        <input type='password' name='password' placeholder='Parola' onChange={handleChange}></input>
        <label>Rol:</label>
        <select name='role' value={formData.role} onChange={handleChange}>
          <option value="MP">Membru proiect (MP)</option>
          <option value="TST">Tester (TST)</option>
        </select>
        <button type='submit'>Creeaza cont</button>
      </form>
      <p>Ai deja cont? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Register;
