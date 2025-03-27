import { createConfig, loadBalance, rateLimit } from "ponder";
import { http, webSocket, Transport } from "viem";
import { erc20ABI } from "./abis/erc20ABI";

export default createConfig({
	ordering: "multichain",
	database: {
		kind: "postgres",
		connectionString: process.env.DATABASE_URL,
		poolConfig: {
			max: 10,
		},
	},
	networks: {
		// mainnet: {
		// 	chainId: 1,
		// 	transport: loadBalance([
		// 		...(process.env.PONDER_RPC_URL_1?.split(",")
		// 			.filter((el) => !!el)
		// 			.map((rpc) => http(rpc) as Transport) || []),
		// 		...(process.env.PONDER_WSS_URL_1?.split(",")
		// 			.filter((el) => !!el)
		// 			.map((ws) => webSocket(ws)) || []),
		// 		...(process.env.PONDER_RATELIMIT_RPC_URL_1?.split(",")
		// 			.filter((el) => !!el)
		// 			.map((rpc) => rateLimit(http(rpc), { requestsPerSecond: 1 })) || []),
		// 	]),
		// },
		sepolia: {
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
		},
		bscTestnet: {
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
		},
	},
	contracts: {
		ERC20: {
			abi: erc20ABI,
			network: {
				// mainnet: {
				// 	address: [
				// 		"0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
				// 		"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
				// 	],
				// 	startBlock: 22133577,
				// },
				sepolia: {
					address: ["0xf0e5aad1cbf9cd06ae87c4b7a6ed7dca3ad3e060"],
					startBlock: 7985396,
				},
				bscTestnet: {
					address: ["0x2b9eB145A7B94f4cdEBf363c78752095a2C9bE80"],
					startBlock: 49431538,
				},
			},
		},
	},
});
