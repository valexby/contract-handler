async function loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
    }
}

async function load() {
    await loadWeb3();
    window.DLCContract = await loadDLCContract();
    window.hotDogsContract = await loadHotDogContract();
    await configureHotDogHooks(window.hotDogsContract);
    await updateDLCStatus()
    updateHotDogs('Ready!');
}

function updateHotDogs(status) {
    const hotDogsStatus = document.getElementById('hotDogsStatus');
    hotDogsStatus.innerHTML = status;
    console.log(status);
}

function updateDLCTotal(status) {
    const DLCTotalStatus = document.getElementById('DLCTotalStatus');
    DLCTotalStatus.innerHTML = status;
    console.log(status);
}

function updateDLCOpen(status) {
    const DLCOpenStatus = document.getElementById('DLCOpenStatus');
    DLCOpenStatus.innerHTML = status;
    console.log(status);
}

function updateDLCAge(status) {
    const DLCAgeStatus = document.getElementById('DLCAgeStatus');
    DLCAgeStatus.innerHTML = status;
    console.log(status);
}

async function getCurrentAccount() {
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
}

async function configureHotDogHooks(contract) {
    contract.events.HotDogCooked({fromBlock: 0})
        .on('data', event => getHotDogsNumber())
    contract.events.HotDogEaten({fromBlock: 0})
        .on('data', event => getHotDogsNumber())
}

async function loadDLCContract() {
    var ABI = await fetch('./contract_abi.json').then(res => res.json())
    const contractAddress = "0x6143a931d4bCB38347936fAacFbea432b4F0DF17"
    return await new window.web3.eth.Contract(ABI, contractAddress);
}

async function loadHotDogContract() {
    var ABI = await fetch('./hot_dog_contract_abi.json').then(res => res.json())
    const contractAddress = "0xD2ce3b3da81095cBcB0761EBd5029c8499221C0F"
    return await new window.web3.eth.Contract(ABI, contractAddress);
}

async function updateDLCStatus() {
    const dlcs = await getDLCs()
    await updateDLCTotal(dlcs.length)
    await updateDLCOpen(dlcs.filter(dlc => dlc.actualClosingTime == "0").length)
}

async function getDLCs() {
    const uuids = await window.DLCContract.methods.allOpenDLC().call()
    return Promise.all(
        uuids.map(
            uuid => window.DLCContract.methods.dlcs(uuid).call()))
}

async function getHotDogsNumber() {
    updateHotDogs('fetching hot dogs amount...');
    const availableHotDogs = await window.hotDogsContract.methods.availableHotDogs().call();
    updateHotDogs(`${availableHotDogs} Available `);
}

async function eatHotDog() {
    updateHotDogs('Transaction in progress...');
    const account = await getCurrentAccount();
    await window.hotDogsContract.methods.getHotDogs(1).send({ from: account });
    updateHotDogs('Eaten');
}

async function cookHotDog() {
    updateHotDogs('Transaction in progress...');
    const account = await getCurrentAccount();
    await window.hotDogsContract.methods.cookHotDogs(1).send({ from: account });
    updateHotDogs('Cooked');
}



window.getHotDogsNumber = getHotDogsNumber;
window.cookHotDog = cookHotDog;
window.eatHotDog = eatHotDog;
load();
