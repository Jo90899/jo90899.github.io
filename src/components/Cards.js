import React from 'react';
import CardItem from './CardItem';
import './Cards.css';

function Cards() {
  return (
    <div className='cards'>
      <h1>Check out our AWESOME features!</h1>
      <div className="cards__wrapper">
      <ul className='cards__items'>
            <CardItem
              src='images/mapbox.jpg'
              text='Use MapboxAPI to get optimized routes for you and your friends'
              label='Gather'
              path='/sign-up'
            />
            <CardItem
              src='images/friends.jpg'
              text='Connect with friends for easy ride-planning'
              label='Gather'
              path='/sign-up'
            />
          </ul>
      </div>
    </div>
  )
}

export default Cards
