import React from 'react';
import {Link,useNavigate} from 'react-router-dom';

const Navbar=()=>{
  const navigate=useNavigate();
  const token=localStorage.getItem('token');

  const handleLogout=()=>{
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className='navbar'>
      <div className='brand'>
        <Link to="/dashboard">Bug Tracker</Link>
      </div>
      <div className='links'>
        {token ? (
          <>
            <button onClick={handleLogout}>Deconectare</button>
          </>
          
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Inregistrare</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;