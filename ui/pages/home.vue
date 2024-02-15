<template>
  <div class="home">
    <form className='home__form'>
      <div className='app_frame'>
      <NuxtLink to="/add">List a product</NuxtLink>
    <div className='big_frame'>
      <div className='frame'>
      <h2>Your Auctions</h2>
      <div className='table__container'>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Owner</th>
            <th>Contract</th>
            <th>Due</th>
            <th>Winning Price</th>
            <th>Winner</th>
            <th>Act</th>
          </tr>
        </thead>
        <tbody>
          <div v-if="loading">Loading...</div>
          <template v-else-if="myProducts.length === 0"><tr><td/><td/><td/><td/><td/><td/><td/></tr></template>
          <template v-else><tr v-for="({name, owner, dueTime, winningPrice, winner, contract}, index) in myProducts" :key="name + owner + index">
              <td>{{name}}</td>
              <td>{{owner}}</td>
              <td>{{contract}}</td>
              <td>{{dueTime}}</td>
              <td>{{winningPrice}}</td>
              <td>{{winner}}</td>
              <td><img variant="primary" @click="cancel()" src="@/assets/cancel.svg" class="editIcon" id="{{contract}}"/></td>
            </tr></template>

        </tbody>
      </table>
      </div>
      </div>
      <div className='frame'>
        <h2>Other Auctions</h2>
        <div className='table__container'>
          <table>
            <thead>
            <tr>
              <th>Product</th>
              <th>Owner</th>
              <th>Contract</th>
              <th>Due</th>
              <th>Winning Price</th>
              <th>Winner</th>
              <th>Act</th>
            </tr>
            </thead>
            <tbody>
              <div v-if="loading">Loading...</div>
              <template v-else-if="theirProducts.length === 0"><tr><td/><td/><td/><td/><td/><td/><td/></tr></template>
              <template v-else><tr v-for="({name, owner, dueTime, winningPrice, winner, contract}, index) in theirProducts" :key="name + owner + index">
              <td>{{name}}</td>
              <td>{{owner}}</td>
              <td>{{contract}}</td>
              <td>{{dueTime}}</td>
              <td>{{winningPrice}}</td>
              <td>{{winner}}</td>
              <td><img variant="primary" @click="bid(id)" src="@/assets/bid.svg" class="editIcon" id="{{contract}}"/></td>
              </tr></template>


            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
    </form>  
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function listProduct() {
  router.push({path:'/add'});
}

function bid(contractAddress: string) {
  router.push({path:'/bid', params: {contract: contractAddress}});
}

function cancel() {
  router.push('/add');
}
</script>

<script lang="ts">
// @ is an alias to /src
import axios from 'axios'
import ChainMixin, {account} from '../mixins/ChainMixin';

export default {
  mixins: [ChainMixin],
  name: 'HomeView',
  async mounted() {
    // this.myProducts = JSON.parse((await axios.get(`http://127.0.0.1:1337/get-my?owner=${account}`)).output[0]);
    this.myProducts = JSON.parse((await axios.get(`http://127.0.0.1:1337/get-my?owner=${account}`)).data.output)
    this.theirProducts = JSON.parse((await axios.get(`http://127.0.0.1:1337/get-their?owner=${account}`)).data.output)
    console.log(`Getting product for ${account}`);
  },
  data() {
    return {loading: false, myProducts:[{name: "", owner: "", dueTime: "", winningPrice: 0, winner: "", contract: ""}], theirProducts: [{name: "", owner: "", dueTime: "", winningPrice: 0, winner: "", contract: ""}]}
  },
  methods:{
    
  }
}
</script>

<style>
</style>
