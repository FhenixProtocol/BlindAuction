const ethers = require("ethers");

const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http').Server(app);
const PORT = 4000
const fs = require("fs")
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});
const savedData = fs.readFileSync("data.json")
const objectData = JSON.parse(savedData)

let client;
let address;
let provider;
let werc20Contract;

app.use(cors())


function findProduct(nameKey, myArray, last_bidder, amount){
  for (let i=0; i < myArray.length; i++) {
      if (myArray[i].name === nameKey) {
         myArray[i].last_bidder = last_bidder
         myArray[i].price = amount
      }
    }
  const stringData = JSON.stringify(objectData, null, 2)
  fs.writeFile("data.json", stringData, (err)=> {
    console.error(err)
  })
}



socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
    });

    socket.on('addProduct', (data) => {
        const extendedData = {...data, winningPrice: 0, winner: "None"};
        objectData["products"].push(extendedData)
        const stringData = JSON.stringify(objectData, null, 2)
        fs.writeFile("data.json", stringData, (err)=> {
          console.error(err)
        })
    socket.broadcast.emit("addProductResponse", data)
  });

  socket.on('setClient', async (data) => {
    client = data.client;
    address = data.address;
    provider = data.provider;

    console.log(JSON.stringify(provider))

    const signer = provider.getSigner();
    const compiledContract = JSON.parse(fs.readFileSync("../../contracts/artifacts/WrappingERC20.json"));

    const contractFactory = new ethers.ContractFactory(compiledContract.abi, compiledContract.data.bytecode, signer);
    const contract = await contractFactory.deploy("Wrapped Fhenix", "WFHNIX");
    await contract.deployed();

    werc20Contract = contract.address;
  });

  socket.on("bidProduct", data => {
    findProduct(data.name, objectData["products"], data.last_bidder, data.amount)
    socket.broadcast.emit("bidProductResponse", data)
  })

});

app.get("/api", (req, res) => {
  const data = fs.readFileSync("data.json")
  const products =  JSON.parse(data)
  res.json(products)
});


http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
