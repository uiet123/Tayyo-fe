import type { CreditBalance, CreditPackage, CreditTransaction } from "@/types";
import { mockCreditPackages } from "@/lib/mock/credits";
import { ApiError, request, type RequestOptions } from "./client";
import { mapTransaction, type ApiPage, type ApiTransaction } from "./mappers";

export async function getCreditBalance(options?: RequestOptions): Promise<CreditBalance> {
  const [{ balance }, txns] = await Promise.all([
    request<{ balance: number }>("/credits/balance", {}, options),
    request<ApiPage<ApiTransaction>>("/credits/transactions?pageSize=50", {}, options),
  ]);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const usedThisMonth = txns.items
    .filter((t) => t.amount < 0 && new Date(t.createdAt) >= monthStart)
    .reduce((sum, t) => sum - t.amount, 0);
  const lifetimePurchased = txns.items
    .filter((t) => t.type === "PURCHASE" && t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  return { balance, usedThisMonth, lifetimePurchased, lowBalanceThreshold: 40 };
}

/** Packages stay static until payments are wired up. */
export function getCreditPackages(_options?: RequestOptions): Promise<CreditPackage[]> {
  return Promise.resolve(mockCreditPackages);
}

export async function getCreditTransactions(
  options?: RequestOptions,
): Promise<CreditTransaction[]> {
  const data = await request<ApiPage<ApiTransaction>>(
    "/credits/transactions?pageSize=50",
    {},
    options,
  );
  return data.items.map(mapTransaction);
}

/**
 * Placeholder for checkout. The real implementation will create a payment
 * order and hand off to the gateway; nothing in the UI needs to change.
 */
export async function purchaseCredits(
  packageId: string,
  _options?: RequestOptions,
): Promise<never> {
  const pack = mockCreditPackages.find((item) => item.id === packageId);
  throw new ApiError(
    pack
      ? `Payments are not live yet. The ${pack.name} pack will be purchasable soon.`
      : "Unknown credit package.",
    501,
    "PAYMENTS_NOT_IMPLEMENTED",
  );
}
