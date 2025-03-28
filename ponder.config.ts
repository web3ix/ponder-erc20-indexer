import { createConfig, loadBalance, rateLimit, NetworkConfig } from "ponder";
import { http, webSocket, Transport } from "viem";
import { erc20ABI } from "./abis/erc20ABI";

let networks: { [key: string]: NetworkConfig } = {};

let erc20ContractsNetwork: any = {};

if (process.env.PONDER_NETWORK_ENABLE_1 === "true") {
	networks["mainnet"] = {
		chainId: 1,
		transport: loadBalance([
			...(process.env.PONDER_RPC_URL_1?.split(",")
				.filter((el) => !!el)
				.map((rpc) => http(rpc) as Transport) || []),
			...(process.env.PONDER_WSS_URL_1?.split(",")
				.filter((el) => !!el)
				.map((ws) => webSocket(ws)) || []),
			...(process.env.PONDER_RATELIMIT_RPC_URL_1?.split(",")
				.filter((el) => !!el)
				.map((rpc) => rateLimit(http(rpc), { requestsPerSecond: 1 })) || []),
		]),
	};

	erc20ContractsNetwork["mainnet"] = {
		address: [
			"0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
			"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
		],
		startBlock: !!process.env.PONDER_START_BLOCK_1
			? Number(process.env.PONDER_START_BLOCK_1)
			: "latest",
	};
}

if (process.env.PONDER_NETWORK_ENABLE_11155111 === "true") {
	networks["sepolia"] = {
		chainId: 11155111,
		transport: loadBalance([
			...(process.env.PONDER_RPC_URL_11155111?.split(",")
				.filter((el) => !!el)
				.map((rpc) => http(rpc) as Transport) || []),
			...(process.env.PONDER_WSS_URL_11155111?.split(",")
				.filter((el) => !!el)
				.map((ws) => webSocket(ws)) || []),
			...(process.env.PONDER_RATELIMIT_RPC_URL_11155111?.split(",")
				.filter((el) => !!el)
				.map((rpc) => rateLimit(http(rpc), { requestsPerSecond: 1 })) || []),
		]),
	};

	erc20ContractsNetwork["sepolia"] = {
		address: ["0xf0e5aad1cbf9cd06ae87c4b7a6ed7dca3ad3e060"],
		startBlock: !!process.env.PONDER_START_BLOCK_11155111
			? Number(process.env.PONDER_START_BLOCK_11155111)
			: "latest",
	};
}

if (process.env.PONDER_NETWORK_ENABLE_11155111 === "true") {
	networks["bscTestnet"] = {
		chainId: 97,
		transport: loadBalance([
			...(process.env.PONDER_RPC_URL_97?.split(",")
				.filter((el) => !!el)
				.map((rpc) => http(rpc) as Transport) || []),
			...(process.env.PONDER_WSS_URL_97?.split(",")
				.filter((el) => !!el)
				.map((ws) => webSocket(ws)) || []),
			...(process.env.PONDER_RATELIMIT_RPC_URL_97?.split(",")
				.filter((el) => !!el)
				.map((rpc) => rateLimit(http(rpc), { requestsPerSecond: 1 })) || []),
		]),
	};

	erc20ContractsNetwork["bscTestnet"] = {
		address: ["0x2b9eB145A7B94f4cdEBf363c78752095a2C9bE80"],
		startBlock: !!process.env.PONDER_START_BLOCK_97
			? Number(process.env.PONDER_START_BLOCK_97)
			: "latest",
	};
}

export default createConfig({
	ordering: "multichain",
	database: {
		kind: "postgres",
		connectionString: process.env.DATABASE_URL,
		poolConfig: {
			max: Number(process.env.DATABASE_MAX_CONNECTION || 5),
			ssl:
				process.env.DATABASE_SSL === "false"
					? undefined
					: {
							rejectUnauthorized: false,
					  },
		},
	},
	networks,
	contracts: {
		ERC20: {
			abi: erc20ABI,
			network: erc20ContractsNetwork,
		},
	},
});
