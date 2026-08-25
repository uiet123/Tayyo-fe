import type { CreditBalance, CreditPackage, CreditTransaction } from "@/types";
import { mockCreditPackages } from "@/lib/mock/credits";
import { ApiError, request, type RequestOptions } from "./client";
import { notifyStoreChanged, store } from "./store";

export function getCreditBalance(options?: RequestOptions): Promise<CreditBalance> {
  return request(() => ({ ...store.credits }), options);
}

export function getCreditPackages(options?: RequestOptions): Promise<CreditPackage[]> {
  return request(() => mockCreditPackages, options);
}

export function getCreditTransactions(options?: RequestOptions): Promise<CreditTransaction[]> {
  return request(() => [...store.transactions], options);
}

/**
 * Placeholder for checkout. The real implementation will create a payment
 * order and hand off to the gateway; nothing in the UI needs to change.
 */
export function purchaseCredits(packageId: string, options?: RequestOptions): Promise<never> {
  return request(() => {
    const pack = mockCreditPackages.find((item) => item.id === packageId);
    throw new ApiError(
      pack
        ? `Payments are not live yet. The ${pack.name} pack will be purchasable soon.`
        : "Unknown credit package.",
      501,
      "PAYMENTS_NOT_IMPLEMENTED",
    );
  }, options);
}

/** Used by mock flows that need to spend credits without a payment step. */
export function spendCredits(amount: number, activity: string): CreditBalance {
  store.credits.balance = Math.max(0, store.credits.balance - amount);
  store.credits.usedThisMonth += amount;
  store.transactions = [
    {
      id: `txn_${Math.random().toString(36).slice(2, 8)}`,
      date: new Date().toISOString(),
      activity,
      kind: "practice-questions",
      amount: -amount,
      balanceAfter: store.credits.balance,
    },
    ...store.transactions,
  ];
  notifyStoreChanged();
  return { ...store.credits };
}
