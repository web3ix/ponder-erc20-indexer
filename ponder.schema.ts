import { index, onchainTable, primaryKey } from "ponder";

export const transfer = onchainTable(
	"transfer",
	(t) => ({
		id: t.text().primaryKey(),
		chainId: t.integer().notNull(),
		txHash: t.hex().notNull(),
		blockNumber: t.bigint().notNull(),
		token: t.text(),
		from: t.hex().notNull(),
		to: t.hex().notNull(),
		amount: t.bigint().notNull(),
		timestamp: t.integer().notNull(),
	}),
	(table) => ({
		fromIdx: index("from_index").on(table.from),
		toIdx: index("to_index").on(table.from),
	})
);
