import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import AboutUs from './components/pages/AboutUs';
import SignUp from './components/pages/SignUp';
import Optimize from './components/pages/Optimize';
import MyEvent from './components/MyEvent';
import Footer from './components/Footer';

function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/optimize' element={<Optimize />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path="/my-event/:eventId" element={<MyEvent />} />
      </Routes>
      <Footer />
    </Router>
    </>
  );
}

export default App;
