<template>
  <div>
      <div className='addproduct__container'>
        <h2>Add a new product</h2>
        <form className="addProduct__form">
          <input type="number" name='name' v-model="amount" required/>
          <label>Note: The amount you will choose will top up your previous amount</label>

          <button className='addProduct__cta' @click="onSend()">Bid</button>
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
import ChainMixin, {account} from "../mixins/ChainMixin";
export default {
  mixins: [ChainMixin],
  name: 'Bid',
  methods:{
    async onSend() {
      
    }
  }
}
</script>
