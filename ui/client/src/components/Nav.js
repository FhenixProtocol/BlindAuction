import React, {useState, useEffect} from 'react'
import {FhenixClient} from "fhenixjs";


const Nav = ({header, socket}) => {

  return (
    <nav className='navbar'>
      <div className='header'>
        <h2>{header}</h2>
      </div>
    </nav>
  )
}

export default Nav
