import React from 'react'
import {useNavigate} from "react-router-dom"

const EndAuctionButton = ({product}) => {
  const navigate = useNavigate()

  const handleClick = () =>  navigate(`/products/end/${product.name}/${product.owner}`)

  return (
    <img onClick={handleClick} src="cancel.svg" className="editIcon"></img>
  )
}

export default EndAuctionButton
