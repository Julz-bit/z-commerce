import { relations, sql } from 'drizzle-orm'
import { boolean, decimal, foreignKey, integer, jsonb, pgEnum, pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

export const CartItemStatus = pgEnum('CartItemStatus', ['active', 'wishlist', 'out_of_stock'])

export const OrderStatus = pgEnum('OrderStatus', ['pending', 'for_payment', 'paid', 'processing', 'on_transit', 'delivered', 'received', 'completed', 'cancelled', 'failed', 'returned', 'refunded'])

export const PaymentType = pgEnum('PaymentType', ['cod', 'gcash', 'card', 'bank', 'paypal', 'other'])

export const user = pgTable('user', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	cursor: serial('cursor').notNull(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	name: text('name').notNull(),
	phone: text('phone').notNull(),
	addresses: jsonb('addresses'),
	lastAccess: timestamp('lastAccess', { precision: 3 }),
	isVerified: boolean('isVerified'),
	avatar: text('avatar'),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 })
});

export const store = pgTable('store', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	cursor: serial('cursor').notNull(),
	ownerId: text('ownerId').notNull(),
	name: text('name').notNull(),
	description: text('description'),
	rating: decimal('rating', { precision: 65, scale: 30 }),
	isVerified: boolean('isVerified'),
	contactNumber: text('contactNumber'),
	logo: text('logo'),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 })
}, (store) => ({
	'store_owner_fkey': foreignKey({
		name: 'store_owner_fkey',
		columns: [store.ownerId],
		foreignColumns: [user.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const category = pgTable('category', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	cursor: serial('cursor').notNull(),
	name: text('name').notNull().unique(),
	parentId: text('parentId'),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow()
}, (category) => ({
	'category_parent_fkey': foreignKey({
		name: 'category_parent_fkey',
		columns: [category.parentId],
		foreignColumns: [category.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const product = pgTable('product', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	cursor: serial('cursor').notNull(),
	storeId: text('storeId').notNull(),
	name: text('name').notNull(),
	description: text('description'),
	categories: jsonb('categories'),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 })
}, (product) => ({
	'product_store_fkey': foreignKey({
		name: 'product_store_fkey',
		columns: [product.storeId],
		foreignColumns: [store.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const productVariant = pgTable('productVariant', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	cursor: serial('cursor').notNull(),
	productId: text('productId').notNull(),
	sku: text('sku').notNull().unique(),
	quantity: integer('quantity').notNull(),
	price: decimal('price', { precision: 65, scale: 30 }).notNull(),
	attributes: jsonb('attributes'),
	files: jsonb('files'),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull()
}, (productVariant) => ({
	'productVariant_product_fkey': foreignKey({
		name: 'productVariant_product_fkey',
		columns: [productVariant.productId],
		foreignColumns: [product.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const cartItem = pgTable('cartItem', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	cursor: serial('cursor').notNull(),
	userId: text('userId').notNull(),
	productId: text('productId').notNull(),
	productVariantId: text('productVariantId').notNull(),
	storeId: text('storeId').notNull(),
	quantity: integer('quantity').notNull().default(1),
	price: decimal('price', { precision: 65, scale: 30 }).notNull(),
	status: CartItemStatus('status').notNull().default("active"),
	addedAt: timestamp('addedAt', { precision: 3 }).notNull().defaultNow()
}, (cartItem) => ({
	'cartItem_product_fkey': foreignKey({
		name: 'cartItem_product_fkey',
		columns: [cartItem.productId],
		foreignColumns: [product.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'cartItem_store_fkey': foreignKey({
		name: 'cartItem_store_fkey',
		columns: [cartItem.storeId],
		foreignColumns: [store.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'cartItem_user_fkey': foreignKey({
		name: 'cartItem_user_fkey',
		columns: [cartItem.userId],
		foreignColumns: [user.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'cartItem_variant_fkey': foreignKey({
		name: 'cartItem_variant_fkey',
		columns: [cartItem.productVariantId],
		foreignColumns: [productVariant.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const order = pgTable('order', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	cursor: serial('cursor').notNull(),
	userId: text('userId').notNull(),
	storeId: text('storeId').notNull(),
	total: decimal('total', { precision: 65, scale: 30 }).notNull(),
	status: OrderStatus('status').notNull().default("pending"),
	paymentType: PaymentType('paymentType'),
	shippingInfo: jsonb('shippingInfo').notNull(),
	paymentInfo: jsonb('paymentInfo').notNull(),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 })
}, (order) => ({
	'order_store_fkey': foreignKey({
		name: 'order_store_fkey',
		columns: [order.storeId],
		foreignColumns: [store.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'order_user_fkey': foreignKey({
		name: 'order_user_fkey',
		columns: [order.userId],
		foreignColumns: [user.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const orderItem = pgTable('orderItem', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	cursor: serial('cursor').notNull(),
	orderId: text('orderId').notNull(),
	productId: text('productId').notNull(),
	productVariantId: text('productVariantId').notNull(),
	quantity: integer('quantity').notNull(),
	price: decimal('price', { precision: 65, scale: 30 }).notNull()
}, (orderItem) => ({
	'orderItem_order_fkey': foreignKey({
		name: 'orderItem_order_fkey',
		columns: [orderItem.orderId],
		foreignColumns: [order.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'orderItem_product_fkey': foreignKey({
		name: 'orderItem_product_fkey',
		columns: [orderItem.productId],
		foreignColumns: [product.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'orderItem_variant_fkey': foreignKey({
		name: 'orderItem_variant_fkey',
		columns: [orderItem.productVariantId],
		foreignColumns: [productVariant.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const review = pgTable('review', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	cursor: serial('cursor').notNull(),
	userId: text('userId').notNull(),
	productId: text('productId').notNull(),
	rating: integer('rating').notNull(),
	comment: text('comment'),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 })
}, (review) => ({
	'review_product_fkey': foreignKey({
		name: 'review_product_fkey',
		columns: [review.productId],
		foreignColumns: [product.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'review_user_fkey': foreignKey({
		name: 'review_user_fkey',
		columns: [review.userId],
		foreignColumns: [user.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const discount = pgTable('discount', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	cursor: serial('cursor').notNull(),
	storeId: text('storeId').notNull(),
	name: text('name'),
	type: text('type').notNull(),
	amount: decimal('amount', { precision: 65, scale: 30 }).notNull(),
	minorderValue: decimal('minorderValue', { precision: 65, scale: 30 }),
	maxdiscountValue: decimal('maxdiscountValue', { precision: 65, scale: 30 }),
	startAt: timestamp('startAt', { precision: 3 }),
	endAt: timestamp('endAt', { precision: 3 }),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow()
}, (discount) => ({
	'discount_store_fkey': foreignKey({
		name: 'discount_store_fkey',
		columns: [discount.storeId],
		foreignColumns: [store.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const productDiscount = pgTable('productDiscount', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	cursor: serial('cursor').notNull(),
	productId: text('productId').notNull(),
	discountId: text('discountId').notNull()
}, (productDiscount) => ({
	'productDiscount_discount_fkey': foreignKey({
		name: 'productDiscount_discount_fkey',
		columns: [productDiscount.discountId],
		foreignColumns: [discount.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'productDiscount_product_fkey': foreignKey({
		name: 'productDiscount_product_fkey',
		columns: [productDiscount.productId],
		foreignColumns: [product.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'productDiscount_productId_discountId_unique_idx': uniqueIndex('productDiscount_productId_discountId_key')
		.on(productDiscount.productId, productDiscount.discountId)
}));

export const flashSale = pgTable('flashSale', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	cursor: serial('cursor').notNull(),
	productId: text('productId').notNull(),
	flashPrice: decimal('flashPrice', { precision: 65, scale: 30 }).notNull(),
	stockLimit: integer('stockLimit'),
	startAt: timestamp('startAt', { precision: 3 }).notNull(),
	endAt: timestamp('endAt', { precision: 3 }).notNull(),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow()
}, (flashSale) => ({
	'flashSale_product_fkey': foreignKey({
		name: 'flashSale_product_fkey',
		columns: [flashSale.productId],
		foreignColumns: [product.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const voucher = pgTable('voucher', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	cursor: serial('cursor').notNull(),
	code: text('code').notNull().unique(),
	storeId: text('storeId'),
	type: text('type').notNull(),
	amount: decimal('amount', { precision: 65, scale: 30 }).notNull(),
	minorderValue: decimal('minorderValue', { precision: 65, scale: 30 }),
	maxdiscountValue: decimal('maxdiscountValue', { precision: 65, scale: 30 }),
	totalUsageLimit: integer('totalUsageLimit'),
	peruserLimit: integer('peruserLimit'),
	startAt: timestamp('startAt', { precision: 3 }),
	endAt: timestamp('endAt', { precision: 3 }),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow()
}, (voucher) => ({
	'voucher_store_fkey': foreignKey({
		name: 'voucher_store_fkey',
		columns: [voucher.storeId],
		foreignColumns: [store.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const voucherUsage = pgTable('voucherUsage', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	cursor: serial('cursor').notNull(),
	voucherId: text('voucherId').notNull(),
	userId: text('userId').notNull(),
	orderId: text('orderId').notNull(),
	usedAt: timestamp('usedAt', { precision: 3 }).notNull().defaultNow()
}, (voucherUsage) => ({
	'voucherUsage_order_fkey': foreignKey({
		name: 'voucherUsage_order_fkey',
		columns: [voucherUsage.orderId],
		foreignColumns: [order.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'voucherUsage_user_fkey': foreignKey({
		name: 'voucherUsage_user_fkey',
		columns: [voucherUsage.userId],
		foreignColumns: [user.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'voucherUsage_voucher_fkey': foreignKey({
		name: 'voucherUsage_voucher_fkey',
		columns: [voucherUsage.voucherId],
		foreignColumns: [voucher.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'voucherUsage_voucherId_userId_orderId_unique_idx': uniqueIndex('voucherUsage_voucherId_userId_orderId_key')
		.on(voucherUsage.voucherId, voucherUsage.userId, voucherUsage.orderId)
}));

export const userRelations = relations(user, ({ many }) => ({
	cartItems: many(cartItem, {
		relationName: 'cartItemTouser'
	}),
	orders: many(order, {
		relationName: 'orderTouser'
	}),
	reviews: many(review, {
		relationName: 'reviewTouser'
	}),
	stores: many(store, {
		relationName: 'storeTouser'
	}),
	voucherUsages: many(voucherUsage, {
		relationName: 'userTovoucherUsage'
	})
}));

export const storeRelations = relations(store, ({ many, one }) => ({
	cartItems: many(cartItem, {
		relationName: 'cartItemTostore'
	}),
	discounts: many(discount, {
		relationName: 'discountTostore'
	}),
	orders: many(order, {
		relationName: 'orderTostore'
	}),
	products: many(product, {
		relationName: 'productTostore'
	}),
	owner: one(user, {
		relationName: 'storeTouser',
		fields: [store.ownerId],
		references: [user.id]
	}),
	vouchers: many(voucher, {
		relationName: 'storeTovoucher'
	})
}));

export const categoryRelations = relations(category, ({ one, many }) => ({
	parent: one(category, {
		relationName: 'categoryToParent',
		fields: [category.parentId],
		references: [category.id]
	}),
	children: many(category, {
		relationName: 'categoryToParent'
	})
}));

export const productRelations = relations(product, ({ many, one }) => ({
	cartItems: many(cartItem, {
		relationName: 'cartItemToproduct'
	}),
	flashSales: many(flashSale, {
		relationName: 'flashSaleToproduct'
	}),
	orderItems: many(orderItem, {
		relationName: 'orderItemToproduct'
	}),
	store: one(store, {
		relationName: 'productTostore',
		fields: [product.storeId],
		references: [store.id]
	}),
	productDiscounts: many(productDiscount, {
		relationName: 'productToproductDiscount'
	}),
	reviews: many(review, {
		relationName: 'productToreview'
	}),
	variants: many(productVariant, {
		relationName: 'productToproductVariant'
	})
}));

export const productVariantRelations = relations(productVariant, ({ one, many }) => ({
	product: one(product, {
		relationName: 'productToproductVariant',
		fields: [productVariant.productId],
		references: [product.id]
	}),
	cartItem: many(cartItem, {
		relationName: 'cartItemToproductVariant'
	}),
	orederItem: many(orderItem, {
		relationName: 'orderItemToproductVariant'
	})
}));

export const cartItemRelations = relations(cartItem, ({ one }) => ({
	product: one(product, {
		relationName: 'cartItemToproduct',
		fields: [cartItem.productId],
		references: [product.id]
	}),
	store: one(store, {
		relationName: 'cartItemTostore',
		fields: [cartItem.storeId],
		references: [store.id]
	}),
	user: one(user, {
		relationName: 'cartItemTouser',
		fields: [cartItem.userId],
		references: [user.id]
	}),
	variant: one(productVariant, {
		relationName: 'cartItemToproductVariant',
		fields: [cartItem.productVariantId],
		references: [productVariant.id]
	})
}));

export const orderRelations = relations(order, ({ one, many }) => ({
	store: one(store, {
		relationName: 'orderTostore',
		fields: [order.storeId],
		references: [store.id]
	}),
	user: one(user, {
		relationName: 'orderTouser',
		fields: [order.userId],
		references: [user.id]
	}),
	orderItems: many(orderItem, {
		relationName: 'orderToorderItem'
	}),
	voucherUsages: many(voucherUsage, {
		relationName: 'orderTovoucherUsage'
	})
}));

export const orderItemRelations = relations(orderItem, ({ one }) => ({
	order: one(order, {
		relationName: 'orderToorderItem',
		fields: [orderItem.orderId],
		references: [order.id]
	}),
	product: one(product, {
		relationName: 'orderItemToproduct',
		fields: [orderItem.productId],
		references: [product.id]
	}),
	variant: one(productVariant, {
		relationName: 'orderItemToproductVariant',
		fields: [orderItem.productVariantId],
		references: [productVariant.id]
	})
}));

export const reviewRelations = relations(review, ({ one }) => ({
	product: one(product, {
		relationName: 'productToreview',
		fields: [review.productId],
		references: [product.id]
	}),
	user: one(user, {
		relationName: 'reviewTouser',
		fields: [review.userId],
		references: [user.id]
	})
}));

export const discountRelations = relations(discount, ({ one, many }) => ({
	store: one(store, {
		relationName: 'discountTostore',
		fields: [discount.storeId],
		references: [store.id]
	}),
	productDiscounts: many(productDiscount, {
		relationName: 'discountToproductDiscount'
	})
}));

export const productDiscountRelations = relations(productDiscount, ({ one }) => ({
	discount: one(discount, {
		relationName: 'discountToproductDiscount',
		fields: [productDiscount.discountId],
		references: [discount.id]
	}),
	product: one(product, {
		relationName: 'productToproductDiscount',
		fields: [productDiscount.productId],
		references: [product.id]
	})
}));

export const flashSaleRelations = relations(flashSale, ({ one }) => ({
	product: one(product, {
		relationName: 'flashSaleToproduct',
		fields: [flashSale.productId],
		references: [product.id]
	})
}));

export const voucherRelations = relations(voucher, ({ one, many }) => ({
	store: one(store, {
		relationName: 'storeTovoucher',
		fields: [voucher.storeId],
		references: [store.id]
	}),
	usages: many(voucherUsage, {
		relationName: 'voucherTovoucherUsage'
	})
}));

export const voucherUsageRelations = relations(voucherUsage, ({ one }) => ({
	order: one(order, {
		relationName: 'orderTovoucherUsage',
		fields: [voucherUsage.orderId],
		references: [order.id]
	}),
	user: one(user, {
		relationName: 'userTovoucherUsage',
		fields: [voucherUsage.userId],
		references: [user.id]
	}),
	voucher: one(voucher, {
		relationName: 'voucherTovoucherUsage',
		fields: [voucherUsage.voucherId],
		references: [voucher.id]
	})
}));