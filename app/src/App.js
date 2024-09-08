import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { mergeNetworks } from '@dynamic-labs/sdk-react-core';

import Main from "./Main";

const evmNetworks = [
    {
        blockExplorerUrls: ["https://testnet.chiliscan.com/"],
        chainId: 88882,
        chainName: "Chiliz Spicy Testnet",
        iconUrls: ["https://app.dynamic.xyz/assets/networks/chiliz.svg"],
        name: "Chiliz Spicy",
        nativeCurrency: {
            decimals: 18,
            name: "Chiliz",
            symbol: "CHZ",
        },
        networkId: 88882,
        rpcUrls: ["https://spicy-rpc.chiliz.com/"],
        vanityName: "Spicy",
    },
    {
        blockExplorerUrls: ["https://sepolia.etherscan.io/"],
        chainId: 11155111,
        chainName: "Sepolia Testnet",
        iconUrls: ["https://app.dynamic.xyz/assets/networks/ethereum.svg"],  // You can reuse the Ethereum icon if available
        name: "Sepolia",
        nativeCurrency: {
            decimals: 18,
            name: "SepoliaETH",
            symbol: "ETH",
        },
        networkId: 11155111,
        rpcUrls: ["https://rpc.sepolia.org"],
        vanityName: "Sepolia",
    },
];

const App = () => (
    <DynamicContextProvider
        settings={{
            environmentId: "",
            overrides: {
                evmNetworks: (networks) => mergeNetworks(evmNetworks, networks),
            },
            walletConnectors: [EthereumWalletConnectors],
        }}
    >
        <Main />
    </DynamicContextProvider>
);

export default App;
