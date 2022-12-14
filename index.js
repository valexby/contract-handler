const ELEMENT_HOT_DOG_STATUS = 'hotDogsStatus'
const ELENENT_DLC_TOTAL_STATUS = 'DLCTotalStatus'
const ELEMENT_DLC_OPEN_STATUS = 'DLCOpenStatus'
const ELEMENT_DLC_AGE_STATUS = 'DLCAgeStatus'

async function loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
    }
}

async function load() {
    await loadWeb3();
    const contractsConfig = await fetch('./contractsConfig.json').then(res => res.json())
    window.DLCContract = await new window.web3.eth.Contract(
        contractsConfig.DLC.abi,
        contractsConfig.DLC.address
    );
    window.hotDogsContract = await new window.web3.eth.Contract(
        contractsConfig.hotDogs.abi,
        contractsConfig.hotDogs.address
    );
    await configureHotDogHooks(window.hotDogsContract);
    await configureDLCHooks(window.DLCContract);
    await updateDLCStatus();
    await getHotDogsNumber();
}

function updateStatus(status, elementId) {
    const statusElement = document.getElementById(elementId);
    statusElement.innerHTML = status;
    console.log(status);
}

async function getCurrentAccount() {
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
}

async function configureHotDogHooks(contract) {
    contract.events.HotDogCooked({
            fromBlock: 0
        })
        .on('data', event => getHotDogsNumber())
    contract.events.HotDogEaten({
            fromBlock: 0
        })
        .on('data', event => getHotDogsNumber())
}

async function configureDLCHooks(contract) {
    contract.events.NewDLC({
            fromBlock: 0
        })
        .on('data', event => updateDLCStatus())
    contract.events.CloseDLC({
            fromBlock: 0
        })
        .on('data', event => updateDLCStatus())
    contract.events.EarlyCloseDLC({
            fromBlock: 0
        })
        .on('data', event => updateDLCStatus())
}

async function updateDLCStatus() {
    const dlcs = await getDLCs()
    await updateStatus(dlcs.length, ELENENT_DLC_TOTAL_STATUS)
    const closedDLCs = dlcs.filter(dlc => dlc.actualClosingTime != '0')
    await updateStatus(
        dlcs.length - closedDLCs.length,
        ELEMENT_DLC_OPEN_STATUS
    )
    // In the blockchain of the test contract there are time values with different precision
    // so we casting all them to single precision
    const closingTimes = dlcs.map(dlc => (Date.now() / dlc.closingTime) > 100 ? dlc.closingTime * 1000 : dlc.closingTime)
    const futureClosingTimes = closingTimes.filter(closingTime => closingTime > Date.now())
    if (futureClosingTimes.length == 0) {
        await updateStatus(
            'All contracts closed',
            ELEMENT_DLC_AGE_STATUS
        )
    } else {
        // Unfortunately we filter by closingTime from dlcs, not by actualClosingTime and
        // closedDLCs, because Closing of DLCs doesn't work for now.
        const newestDLCClosingTime = futureClosingTimes.reduce(
            (prev, curr) => prev < curr ? prev : curr
        )
        const newestDLCAge = Math.round((Date.now() - newestDLCClosingTime) / 1000 / 3600 / 24)
        await updateStatus(
            `${newestDLCAge} days`,
            ELEMENT_DLC_AGE_STATUS
        )
    }
}

async function getDLCs() {
    const uuids = await window.DLCContract.methods.allOpenDLC().call()
    return Promise.all(
        uuids.map(
            uuid => window.DLCContract.methods.dlcs(uuid).call()))
}

async function getHotDogsNumber() {
    updateStatus('fetching hot dogs amount...', ELEMENT_HOT_DOG_STATUS);
    const availableHotDogs = await window.hotDogsContract.methods.availableHotDogs().call();
    updateStatus(`${availableHotDogs} Available `, ELEMENT_HOT_DOG_STATUS);
}

async function eatHotDog() {
    updateStatus('Transaction in progress...', ELEMENT_HOT_DOG_STATUS);
    const account = await getCurrentAccount();
    await window.hotDogsContract.methods.getHotDogs(1).send({
        from: account
    });
    updateStatus('Eaten', ELEMENT_HOT_DOG_STATUS);
}

async function cookHotDog() {
    updateStatus('Transaction in progress...', ELEMENT_HOT_DOG_STATUS);
    const account = await getCurrentAccount();
    await window.hotDogsContract.methods.cookHotDogs(1).send({
        from: account
    });
    updateStatus('Cooked', ELEMENT_HOT_DOG_STATUS);
}

window.getHotDogsNumber = getHotDogsNumber;
window.cookHotDog = cookHotDog;
window.eatHotDog = eatHotDog;
window.getDLCs = getDLCs;
load();
