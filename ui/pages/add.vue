<template>
  <div>
      <div className='addproduct__container'>
        <h2>Add a new product</h2>
        <form className="addProduct__form">
          <label htmlFor='name'>Name of the product</label>
          <input type="text" name='name' v-model="name" required/>

          <label htmlFor='due'>Due data and time</label>
          <input type="time" name='due' v-model="dueTime" required/>

          <button className='addProduct__cta' @click="onSend()">SEND</button>
          <NuxtLink to="/home">Back Home!</NuxtLink>
        </form>
      </div>

    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<script lang="ts">

// @ is an alias to /src
import axios from 'axios'
import ChainMixin, {account, provider} from "../mixins/ChainMixin";
export default {
  mixins: [ChainMixin],
  name: 'Add',
  methods:{
    async onSend() {
      
      const product = {name: this.name,
      owner: account,
      dueTime: this.dueTime,
      winningPrice: 0,
      winner: "None",
      contract: ""};

    const signer = provider.getSigner();
    const compiledContract = JSON.parse(fs.readFileSync("../../contracts/artifacts/WrappingERC20.json"));

    const contractFactory = new ethers.ContractFactory(compiledContract.abi, compiledContract.data.bytecode, signer);
    const contract = await contractFactory.deploy("Wrapped Fhenix", "WFHNIX");
    await contract.deployed();
      
      console.log(`Posting product with ${JSON.stringify(product)}`);
      await axios.post(`http://127.0.0.1:1337/set`, JSON.stringify(product));
    }
  }
}
</script>
