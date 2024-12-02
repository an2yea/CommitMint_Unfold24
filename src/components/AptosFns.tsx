import {Aptos, AptosConfig, Network} from '@aptos-labs/ts-sdk'

async function fundWallet(walletAddress: string) {
    if (!walletAddress) {
        return 0;
    }
    console.log("Funding wallet", walletAddress);
    try {
    const config = new AptosConfig({
        network: Network.TESTNET
    });
    const aptos = new Aptos(config);

    await aptos.fundAccount({
        accountAddress: walletAddress,
        amount: 100000000,
        });
    console.log("Account funding successful")
    } catch (error) {
        console.error("Error funding wallet", error);
    }
}

export default fundWallet;