import { BigInt, ethereum } from "@graphprotocol/graph-ts"
import {
  Upline as UplineEvent,
  NewDeposit as NewDepositEvent,
  DirectPayout as DirectPayoutEvent,
  MatchPayout as MatchPayoutEvent,
  Withdraw as WithdrawEvent,
  NewAirdrop as NewAirdropEvent
} from "../generated/Faucet/Faucet"
import { Transaction, Upline, NewDeposit, DirectPayout, MatchPayout, Withdraw, NewAirdrop } from "../generated/schema"

export function handleNewAirdrop(event: NewAirdropEvent): void {
  let transaction = getOrCreateTransaction(event)

  let from = event.params.from
  let to = event.params.to
  let amount = event.params.amount
  let timestamp = event.params.timestamp

  let airdrop = new NewAirdrop(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )

  airdrop.transaction = transaction.id
  airdrop.from = from
  airdrop.to = to
  airdrop.amount = amount
  airdrop.timestamp = timestamp

  transaction.deposits.push(airdrop.id);

  airdrop.save()
  transaction.save();
}

export function handleWithdraw(event: WithdrawEvent): void {
  let transaction = getOrCreateTransaction(event)

  let addr = event.params.addr
  let amount = event.params.amount

  let withdraw = new Withdraw(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )

  withdraw.transaction = transaction.id
  withdraw.amount = amount

  transaction.deposits.push(withdraw.id);

  withdraw.save()
  transaction.save();
}

export function handleMatchPayout(event: MatchPayoutEvent): void {
  let transaction = getOrCreateTransaction(event)

  let addr = event.params.addr
  let from = event.params.from
  let amount = event.params.amount

  let matchPayout = new MatchPayout(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )

  matchPayout.transaction = transaction.id
  matchPayout.from = from
  matchPayout.amount = amount

  transaction.deposits.push(matchPayout.id);

  matchPayout.save()
  transaction.save();
}

export function handleDirectPayout(event: DirectPayoutEvent): void {
  let transaction = getOrCreateTransaction(event)

  let from = event.params.from
  let amount = event.params.amount

  let directPayout = new DirectPayout(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )

  directPayout.transaction = transaction.id
  directPayout.from = from
  directPayout.amount = amount

  transaction.deposits.push(directPayout.id);

  directPayout.save()
  transaction.save();
}

export function handleNewDeposit(event: NewDepositEvent): void {
  let transaction = getOrCreateTransaction(event)

  let addr = event.params.addr
  let amount = event.params.amount

  let deposit = new NewDeposit(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )

  deposit.transaction = transaction.id
  deposit.amount = amount

  transaction.deposits.push(deposit.id);

  deposit.save()
  transaction.save();
}


export function handleUpline(event: UplineEvent): void {
  let transaction = getOrCreateTransaction(event);
  let upline = new Upline(
    event.params.addr.toHex() + '-' + event.params.upline.toHex() + '-' + event.transaction.hash.toHex()
  );

  upline.upline = event.params.upline;
  upline.transaction = transaction.id;

  transaction.uplines.push(upline.id);

  upline.save();
  transaction.save();
}

function getOrCreateTransaction(event: ethereum.Event): Transaction {
  let transaction = Transaction.load(event.transaction.hash.toHex())

  if (transaction == null) {
    transaction = new Transaction(event.transaction.hash.toHex())
    transaction.blockNumber = event.block.number
    transaction.save()
  }

  return transaction as Transaction
}
