import React from 'react';
import '../../App.css';
import HeroSection from '../HeroSection';
import Cards from '../Cards';
import CreateEvent from '../CreateEvent';

function Home () {
    return (
        <>
          <HeroSection />
          <div id="createEventSection">
            <CreateEvent />
          </div>
          <Cards />
        </>
    );
}

export default Home;