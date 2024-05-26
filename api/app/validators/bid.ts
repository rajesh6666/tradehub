import vine from '@vinejs/vine'

/**
 * Validates the user creation action
 */
export const storeValidator = vine.compile(
    vine.object({
        productId: vine.number(),
        parentId: vine.number().optional(),
        offerPrice: vine.number().range([1, 999999])
    })
)

export const purchaseValidator = vine.compile(
    vine.object({
        productId: vine.number()
    })
)