import { ponder } from "ponder:registry";
import { transfer } from "ponder:schema";

ponder.on("ERC20:Transfer", async ({ event, context }) => {
	await context.db.insert(transfer).values({
		id: event.id,
		chainId: context.network.chainId,
		txHash: event.transaction.hash,
		blockNumber: event.block.number,
		token: event.log.address,
		from: event.args.from,
		to: event.args.to,
		amount: event.args.amount,
		timestamp: Number(event.block.timestamp),
	});
});
