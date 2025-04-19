import * as schema from '@app/common/drizzle/schema';
import { InferSelectModel } from 'drizzle-orm';

export type UserModel = InferSelectModel<typeof schema.user>;
export type StoreModel = InferSelectModel<typeof schema.store>;
export type CategoryModel = InferSelectModel<typeof schema.category>;
export type ProductModel = InferSelectModel<typeof schema.product>;
export type CartItemModel = InferSelectModel<typeof schema.cartItem>;
export type OrderModel = InferSelectModel<typeof schema.order>;
export type OrderItemModel = InferSelectModel<typeof schema.orderItem>;
export type ReviewModel = InferSelectModel<typeof schema.review>;
export type DiscountModel = InferSelectModel<typeof schema.discount>;
export type ProductDiscountModel = InferSelectModel<
  typeof schema.productDiscount
>;
export type FlashSaleModel = InferSelectModel<typeof schema.flashSale>;
export type VoucherModel = InferSelectModel<typeof schema.voucher>;
export type VoucherUsageModel = InferSelectModel<typeof schema.voucherUsage>;
