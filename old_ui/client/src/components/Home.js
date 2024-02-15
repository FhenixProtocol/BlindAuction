import {useNavigate} from "react-router-dom"
import { FhenixClient } from 'fhenixjs';
const ethers = require("ethers")

const Home = ({socket})  => {
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        let provider = new ethers.BrowserProvider(window.ethereum);
        let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log(`LIORRR ${JSON.stringify(provider)} ${JSON.stringify(window.ethereum)}`);
        socket.emit('setClient', {client: new FhenixClient(provider), address: accounts[0], provider});
        localStorage.setItem("address", accounts[0]);
        navigate("/products")
      }

  return (
    <div>
        <form className='home__form'>
            <label htmlFor="metamask">Please connect your metamask wallet</label>
            <img src="metamask.png" className='home__cta' onClick={handleSubmit}></img>
        </form>
    </div>
  )
}

export default Home
