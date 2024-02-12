import React from 'react'
import {useNavigate} from "react-router-dom"

const BidButton = ({product}) => {
  const navigate = useNavigate()

  const handleClick = () =>  navigate(`/products/bid/${product.name}/${product.owner}`)

  return (
    <img onClick={handleClick} src="bid.svg" className="editIcon"></img>
  )
}

export default BidButton
