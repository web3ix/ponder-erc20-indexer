import { createConfig, loadBalance, rateLimit, ChainConfig } from "ponder";
import { http, webSocket, Transport } from "viem";
import { erc20ABI } from "./abis/erc20ABI";

let chains: { [key: string]: ChainConfig } = {};

let erc20Chains: any = {};

process.env.PONDER_NETWORK_CHAIN_IDS_SUPPORTED?.split(",").forEach(
	(chainId) => {
		if (process.env[`PONDER_NETWORK_ENABLE_${chainId}`] === "true") {
			chains[process.env[`PONDER_NETWORK_KEY_${chainId}`]!] = {
				id: +chainId,
				rpc: loadBalance([
					...(process.env[`PONDER_NETWORK_KEY_${chainId}`]
						?.split(",")
						.filter((el) => !!el)
						.map((rpc) => http(rpc) as Transport) || []),
					...(process.env[`PONDER_WSS_URL_${chainId}`]
						?.split(",")
						.filter((el) => !!el)
						.map((ws) => webSocket(ws)) || []),
					...(process.env[`PONDER_RATELIMIT_RPC_URL_${chainId}`]
						?.split(",")
						.filter((el) => !!el)
						.map((rpc) => rateLimit(http(rpc), { requestsPerSecond: 1 })) ||
						[]),
				]),
			};

			erc20Chains[process.env[`PONDER_NETWORK_KEY_${chainId}`]!] = {
				address:
					process.env[`PONDER_ERC20_CONTRACTS_${chainId}`]?.split(",") || [],
				startBlock: !!process.env[`PONDER_START_BLOCK_${chainId}`]
					? Number(process.env[`PONDER_START_BLOCK_${chainId}`])
					: "latest",
			};
		}
	}
);

export default createConfig({
	ordering: "multichain",
	database:
		process.env.DATABASE_KIND === "postgres"
			? {
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
			  }
			: {
					kind: "pglite",
			  },
	chains,
	contracts: {
		ERC20: {
			abi: erc20ABI,
			chain: erc20Chains,
		},
	},
});
