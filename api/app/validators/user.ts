import vine from '@vinejs/vine'

/**
 * Validates the user creation action
 */
export const signupValidator = vine.compile(
    vine.object({
        name: vine.string().trim(),
        email: vine.string().trim().email(),
        password: vine.string().trim().minLength(8)
    })
)