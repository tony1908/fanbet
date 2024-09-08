import React, { useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { TrendingUpIcon, ClockIcon } from "lucide-react";
import { getChain } from "@dynamic-labs/utils";
import { DynamicWidget, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { encodeFunctionData, decodeFunctionResult, createPublicClient, custom } from "viem";  // Import necessary viem functions

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
        iconUrls: ["https://app.dynamic.xyz/assets/networks/ethereum.svg"],
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

const Main = () => {
    const { primaryWallet } = useDynamicContext();

    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState("");
    const [txnHash, setTxnHash] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(""); // New state for success message

    if (!primaryWallet) return <div className="flex flex-col items-center justify-center text-center">
        <DynamicWidget/>
    </div>;

    // ABI for the createMarket function
    const abi = [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "marketId",
                    "type": "uint256",
                },
                {
                    "internalType": "string",
                    "name": "question",
                    "type": "string",
                },
                {
                    "internalType": "uint256",
                    "name": "durationInHours",
                    "type": "uint256",
                },
            ],
            "name": "createMarket",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
        },
    ];

    const contractAddress = "0x9f017a14F8eD98839Ce393eF768Ec635e4802c8E"; // Add your contract address here

    // Define custom chains for Viem
    const customChains = {
        "88882": {
            id: 88882,
            name: "Chiliz Spicy Testnet",
            nativeCurrency: {
                name: "Chiliz",
                symbol: "CHZ",
                decimals: 18,
            },
            rpcUrls: ["https://spicy-rpc.chiliz.com/"],
            blockExplorerUrls: ["https://testnet.chiliscan.com/"],
        },
        "11155111": {
            id: 11155111,
            name: "Sepolia Testnet",
            nativeCurrency: {
                name: "SepoliaETH",
                symbol: "ETH",
                decimals: 18,
            },
            rpcUrls: ["https://rpc.sepolia.org"],
            blockExplorerUrls: ["https://sepolia.etherscan.io/"],
        },
    };

    // Function to generate a random number for the //fan// part
    const generateRandomFanValue = () => {
        return Math.floor(Math.random() * 100); // Generates a random number between 0 and 99
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const provider = await primaryWallet.connector.getSigner();
            if (!provider) {
                console.error("No provider found");
                return;
            }

            const chainId = await provider.getChainId();
            console.log("Detected Chain ID:", chainId); // Log the detected chain ID

            // Detect and set the correct chain based on the detected chainId
            const chain = customChains[chainId];
            if (!chain) {
                alert("Unsupported chain. Please switch your network.");
                setLoading(false);
                return;
            }

            // Encode the function data with hardcoded id 8
            const data = encodeFunctionData({
                abi: abi,
                functionName: "createMarket",
                args: [8, title, parseInt(duration)], // id is hardcoded as 8
            });

            // Send the transaction
            const transaction = await provider.sendTransaction({
                chain: chain,
                account: primaryWallet.address,
                to: contractAddress,
                data,
            });

            console.log("Transaction Hash:", transaction);
            setTxnHash(transaction.hash);

            // Generate dynamic fan value
            const fanValue = generateRandomFanValue();

            // Update the success message with the dynamically generated fan value
            setSuccessMessage(`Please copy this string: //fan// ${fanValue} //fan// and paste it into your YouTube, TikTok, or Twitch description to convert it into a prediction market`);

        } catch (error) {
            console.error("Failed to create market:", error);
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center text-white">
            {/* Wallet Connection Widget */}
            <div className="flex flex-col items-center justify-center text-center">
                <DynamicWidget />
            </div>

            {/* Prediction Market Form */}
            <div className="w-full max-w-3xl mx-auto p-4 mt-16">
                <h1 className="text-2xl font-bold text-center mb-4 text-purple-300">
                    Create a Prediction Market
                </h1>

                <form className="bg-indigo-800 shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={onSubmit}>
                    <div className="mb-6">
                        <label
                            htmlFor="title"
                            className="block text-purple-200 text-sm font-bold mb-2"
                        >
                            <TrendingUpIcon className="inline-block mr-1 text-purple-300" />
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-indigo-900 leading-tight focus:outline-none focus:shadow-outline bg-purple-100"
                            placeholder="Enter market title"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="duration"
                            className="block text-purple-200 text-sm font-bold mb-2"
                        >
                            <ClockIcon className="inline-block mr-1 text-purple-300" />
                            Duration (in hours)
                        </label>
                        <input
                            type="number"
                            id="duration"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-indigo-900 leading-tight focus:outline-none focus:shadow-outline bg-purple-100"
                            placeholder="Enter duration"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            disabled={loading}
                        >
                            {loading ? "Creating Market..." : "Create Market"}
                        </button>
                    </div>

                    {/* Display transaction hash if available */}
                    {txnHash && (
                        <p className="mt-4 text-green-400">Transaction Hash: {txnHash}</p>
                    )}

                    {/* Success message with copy button */}
                    {successMessage && (
                        <div className="mt-4 bg-gradient-to-r from-green-400 to-teal-500 p-4 rounded shadow-md animate-pulse text-center">
                            <p className="text-lg font-bold">{successMessage}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Main;