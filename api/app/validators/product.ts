import vine from '@vinejs/vine'

/**
 * Validates the user creation action
 */
export const storeValidator = vine.compile(
    vine.object({
        name: vine.string().trim(),
        price: vine.number().range([1, 999999]),
        description: vine.string().maxLength(200).nullable()
    })
)