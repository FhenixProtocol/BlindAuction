import React, {useEffect, useState} from 'react'
import EndAuctionButton from "./EndAuctionButton"
import { Link} from "react-router-dom"
import BidButton from "./Bid";

const Products = () => {
  const [myProducts, setMyProducts] = useState(null)
  const [theirProducts, setTheirProducts] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=> {
      const fetchProducts = () => {
        fetch("http://localhost:4000/api").then(res => res.json()).then(data => {
          setMyProducts(data.products.filter(product => product.owner === localStorage.getItem("address")));
          setTheirProducts((data.products.filter(product => product.owner !== localStorage.getItem("address"))));
          setLoading(false)
      })}
      fetchProducts()
  }, [])

  return (
    <div className='app_frame'>
      <Link to="/products/add" className='products__cta'>LIST A PRODUCT</Link>
    <div className='big_frame'>
      <div className='frame'>
      <div className='table__container'>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Owner</th>
            <th>Due</th>
            <th>Winning Price</th>
            <th>Winner</th>
            <th>Act</th>
          </tr>
        </thead>
        <tbody>
          {loading ? <tr><td>Loading</td></tr> : myProducts.map(product => (
            <tr key={`${product.name}${product.owner}`}>
              <td>{product.name}</td>
              <td>{product.owner}</td>
              <td>{product.dueTime}</td>
              <td>{product.winningPrice}</td>
              <td>{product.winner}</td>
              <td><EndAuctionButton product={product}/></td>
            </tr>
          ))}

        </tbody>
      </table>
      </div>
      </div>
      <div className='frame'>
        <div className='table__container'>
          <table>
            <thead>
            <tr>
              <th>Product</th>
              <th>Owner</th>
              <th>Due</th>
              <th>Winning Price</th>
              <th>Winner</th>
              <th>Act</th>
            </tr>
            </thead>
            <tbody>
            {loading ? <tr><td>Loading</td></tr> : theirProducts.map(product => (
              <tr key={`${product.name}${product.owner}`}>
                <td>{product.name}</td>
                <td>{product.owner}</td>
                <td>{product.dueTime}</td>
                <td>{product.winningPrice}</td>
                <td>{product.winner}</td>
                <td><BidButton product={product}/></td>
              </tr>
            ))}

            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>

  )
}

export default Products
