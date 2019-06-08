const { MarketLogic } = require('ew-market-contracts-sonnen');
const { SonnenProducingAssetLogic } = require('ew-asset-registry-contracts-sonnen');
const Web3 = require('web3');

const web3 = new Web3('https://rpc.slock.it/tobalaba');
const MARKET_LOGIC_INSTANCE_ADDRESS = '0xF246974e43B3C0435cb18D2379C06347410cAa3c'; // MarketLogic
const PRODUCING_ASSET_LOGIC_INSTANCE_ADDRESS = '0x292A6c92a6C66e39e6eA07E69f6C7d490C5827C9'; // AssetProducingRegistryLogic
const ASSET_OWNER = {
    PRIVATE_KEY: '0xfaab95e72c3ac39f7c060125d9eca3558758bb248d1a4cdc9c1b7fd3f91a4485'
}
const SMART_METER = {
    PRIVATE_KEY: '0x554f3c1470e9f66ed2cf1dc260d2f4de77a816af2883679b1dc68c551e8fa5ed'
};

const CREATE_SUPPLY_EXAMPLE_PARAMS = {
    "assetId":1,
    "regionId":"",
    "timeFrameEndTimestamp":1559944800000,
    "timeFrameStartTimestamp":1559599200000,
    "powerInWh":200,
    "price":1,
    "marketLogicInstance": MARKET_LOGIC_INSTANCE_ADDRESS
}

/**
 * EXAMPLE PARAMS:
 * 
 * "assetId":1,
 * "regionId":"",
 * "timeFrameEndTimestamp":1559944800000,
 * "timeFrameStartTimestamp":1559599200000,
 * "powerInWh":200,
 * "price":1,
 * "marketLogicInstance":"0xF246974e43B3C0435cb18D2379C06347410cAa3c"}"
 */
async function createSupply(
    assetId,
    regionId,
    timeFrameStartTimestamp,
    timeFrameEndTimestamp,
    powerInWh,
    price
) {
    const marketLogic = new MarketLogic(
        web3,
        MARKET_LOGIC_INSTANCE_ADDRESS
    );

    await marketLogic.createSupply(assetId, regionId, timeFrameStartTimestamp, timeFrameEndTimestamp, powerInWh, price, {
        privateKey: ASSET_OWNER.PRIVATE_KEY
    });
}

async function saveSmartMeterRead(
    assetId,
    newMeterRead,
    lastSmartMeterReadFileHash,
    timeFrameStartTimestamp,
    timeFrameEndTimestamp,
    averagePower,
    powerProfileURL
) {
    const assetRegistry = new SonnenProducingAssetLogic(
        web3,
        PRODUCING_ASSET_LOGIC_INSTANCE_ADDRESS
    );

    await assetRegistry.saveSonnenSmartMeterRead(
        assetId,
        newMeterRead,
        lastSmartMeterReadFileHash,
        timeFrameStartTimestamp,
        timeFrameEndTimestamp,
        averagePower,
        powerProfileURL,
        {
            privateKey: SMART_METER.PRIVATE_KEY
        });
}

async function getDemands() {
    const demands = [];
    const marketLogic = new MarketLogic(
        web3,
        MARKET_LOGIC_INSTANCE_ADDRESS
    );
    const listLength = await marketLogic.getAllDemandListLength();

    for (let i = 0; i < listLength; i++) {
        demands.push(await marketLogic.getDemand(i));
    }

    return demands;
}

(async () => {
    // EXAMPLE CALL:
    //
    // await createSupply(
    //     CREATE_SUPPLY_EXAMPLE_PARAMS.assetId,
    //     CREATE_SUPPLY_EXAMPLE_PARAMS.regionId,
    //     CREATE_SUPPLY_EXAMPLE_PARAMS.timeFrameStartTimestamp,
    //     CREATE_SUPPLY_EXAMPLE_PARAMS.timeFrameEndTimestamp,
    //     CREATE_SUPPLY_EXAMPLE_PARAMS.powerInWh,
    //     CREATE_SUPPLY_EXAMPLE_PARAMS.price
    // );

    const demands = await getDemands();

    console.log('demands', demands);
})();