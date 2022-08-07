// import Web3 from './web3';

async function loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
    }
}

async function load() {
    await loadWeb3();
    window.contract = await loadContract();
    window.hot_dogs_contract = await loadHotDogContract();
    updateStatus('Ready!');
}

function updateStatus(status) {
    const statusEl = document.getElementById('status');
    statusEl.innerHTML = status;
    console.log(status);
}

async function loadContract() {
    var ABI = await fetch('./contract_abi.json').then(res => res.json())
    const contractAddress = "0x365441EC0974F6AC9871c704128e9da2BEdE10CE"
    return await new window.web3.eth.Contract(ABI, contractAddress);
}

async function loadHotDogContract() {
    var ABI = await fetch('./hot_dog_contract_abi.json').then(res => res.json())
    const contractAddress = "0xD2ce3b3da81095cBcB0761EBd5029c8499221C0F"
    return await new window.web3.eth.Contract(ABI, contractAddress);
}

async function printCoolNumber() {
    updateStatus('fetching Cool Number...');
    const coolNumber = await window.contract.methods.closingPriceAndTimeOfDLC("oO6rCZIq").call();
    updateStatus(`coolNumber: ${coolNumber[0]}`);
}

window.printCoolNumber = printCoolNumber;
load();
