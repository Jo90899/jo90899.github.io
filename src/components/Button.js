import React from 'react';
import './Button.css';
import { Link } from 'react-router-dom';

const STYLES = ['btn--primary', 'btn--outline'];

const SIZES = ['btn--medium', 'btn--large'];

export const Button = ({
    children, 
    type, 
    onClick, 
    buttonStyle, 
    buttonSize,
    link,
    scrollTo
}) => {
    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0]

    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0]

    const handleClick = (e) => {
        if (scrollTo) {
          e.preventDefault();
          const targetElement = document.getElementById(scrollTo);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
        if (onClick) {
          onClick(e);
        }
      };
    
      if (link) {
        return (
          <Link to={link} className={`btn ${checkButtonStyle} ${checkButtonSize}`} onClick={handleClick}>
            {children}
          </Link>
        );
      } else {
        return (
          <button
            className={`btn ${checkButtonStyle} ${checkButtonSize}`}
            onClick={handleClick}
            type={type}
          >
            {children}
          </button>
        );
      }
    };