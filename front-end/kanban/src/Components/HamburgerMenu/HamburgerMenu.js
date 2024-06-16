import React, { } from 'react';
import { ReactComponent as MenuClosed } from '../../Imgs/MenuClosed.svg';
import { ReactComponent as MenuOpen } from '../../Imgs/MenuOpen.svg';
import './HamburgerMenu.css';

const HamburgerMenu = ({ buttons, isOpen, onToggle }) => {

    return (
        <div className="hamburger-menu">
            <button className="hamburger-button" onClick={onToggle}>
                {isOpen ? <MenuOpen /> : <MenuClosed />}
            </button>
            <div className={`menu-items ${isOpen ? 'open' : ''}`}>
                {buttons.map((button, index) => (
                    <button
                        key={index}
                        className="menu-item"
                        style={{ backgroundColor: button.color }}
                        onClick={button.onClick}
                    >
                        {button.icon} {button.text}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HamburgerMenu;
