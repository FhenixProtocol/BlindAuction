import React, {useState} from 'react'
import {useNavigate} from "react-router-dom"

const AddProduct = ({socket}) => {
  const [name, setName] = useState("")
  const [dueTime, setDueTime] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('addProduct', {name, owner: localStorage.getItem("address"), dueTime});
    navigate("/products")
  }

  return (
    <div>
      <div className='addproduct__container'>
        <h2>Add a new product</h2>
        <form className="addProduct__form" onSubmit={handleSubmit}>
          <label htmlFor='name'>Name of the product</label>
          <input type="text" name='name' value={name} onChange={e => setName(e.target.value)} required/>

          <label htmlFor='due'>Due data and time</label>
          <input type="time" name='due' value={dueTime} onChange={e => setDueTime(e.target.value)} required/>

          <button className='addProduct__cta'>SEND</button>
        </form>
      </div>

    </div>
  )
}

export default AddProduct
