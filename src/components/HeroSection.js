import React from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarthAmericas } from '@fortawesome/free-solid-svg-icons';

function HeroSection() {
  return (
    <div className='hero-container'>
      <video src='/videos/home-video-3.mp4' autoPlay loop muted />
      <h1>Gather<i className='fas fa-map-pin'/></h1>
      <p>Get together, faster.</p>
      <div className='hero-btns'>
        <Button 
          className='btns' 
          buttonStyle='btn--outline' 
          buttonSize='btn--large'
          scrollTo="createEventSection"
        >
          GET STARTED
        </Button>
        <Button 
          className='btns' 
          buttonStyle='btn--primary' 
          buttonSize='btn--large'
        >
          WHAT WE DO <FontAwesomeIcon icon={faEarthAmericas} />
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
