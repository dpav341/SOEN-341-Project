import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";
// import { useCookies } from 'react-cookie';
// import { handleCookies } from '../../utils/helpers';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';
import './Select.css';


export default function Select() {

  return (

    <div className="Icon-Wrapper">
      <div className='labels'>
        <button><FontAwesomeIcon className="icons" icon={faMessage} /></button>
        <p>Messages</p>
      </div>
      <div className='labels'>
        <button><FontAwesomeIcon className="icons" icon={faBullhorn} /></button>
        <p>Text Channels</p>
      </div>
    </div>
  );
};
