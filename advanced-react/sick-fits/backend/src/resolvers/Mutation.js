const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')
const { transport, makeANiceEmail } = require('../mail')
const { hasPermission } = require('../utils')

const Mutations = {
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that.')
    }

    const item = await ctx.db.mutation.createItem({
      data: {
        ...args,
        user: {
          connect: {
            id: ctx.request.userId,
          }
        }
      }
    }, info)

    return item
  },
  updateItem(parent, args, ctx, info) {
    const updates = { ...args }
    delete updates.id
    return ctx.db.mutation.updateItem({
      data: updates,
      where: { id: args.id },
    }, info)
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id }
    const item = await ctx.db.query.item({ where }, '{ id, title, user { id } }')

    const ownsItem = item.user.id === ctx.request.userId
    const hasPermissions = ctx.request.user.permissions.some(
      permission => ['ADMIN', 'ITEMDELETE'].includes(permission)
    )

    if (!ownsItem && !hasPermissions) {
      throw new Error("You're not allowed.")
    }

    return ctx.db.mutation.deleteItem({ where }, info)
  },
  async signup(parent, args, ctx, info) {
    const email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10)
    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        email,
        password,
        permissions: {
          set: ['USER']
        }
      }
    }, info)

    // create JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    // set the JWT as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    })

    // return the user to the browser
    return user
  },
  async signin(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email }})
    if (!user) {
      throw new Error(`No such user found for email ${email}`)
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new Error('Invalid Password!')
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)

    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    })

    return user
  },
  async signout(parent, { id }, ctx, info) {
    return ctx.response.clearCookie('token')
  },
  async requestReset(parent, { email }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email }})
    if (!user) {
      throw new Error(`No such user found for email ${email}`)
    }

    // set resetToken and resetTokenExpiry
    const randomBytesPromisified = promisify(randomBytes)
    const resetToken = (await randomBytesPromisified(20)).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000 // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    })

    const resetLink = `${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}`
    const mailRes = await transport.sendMail({
      from: 'hi@chadoh.com',
      to: user.email,
      subject: 'Sick Fits: Reset Password',
      html: makeANiceEmail(
        `Your Password Reset Token is here!
        <br />
        👉🏼 <a href="${resetLink}">Click Here To Reset</a>`
      )
    })

    return {
      message: 'Password reset instructions sent!'
    }
  },
  async resetPassword(parent, args, ctx, info) {
    if (args.password !== args.confirmPassword) {
      throw new Error('Passwords do not match!')
    }

    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000,
      }
    })
    if (!user) {
      throw new Error('Token is either invalid or expired!')
    }

    const password = await bcrypt.hash(args.password, 10)
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { id: user.id },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      }
    }, info)

    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET)

    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    })

    return updatedUser
  },
  async updatePermissions(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!')
    }

    const currentUser = await ctx.db.query.user({
      where: { id: ctx.request.userId }
    }, info)

    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE'])

    return ctx.db.mutation.updateUser({
      where: { id: args.userId },
      data: {
        permissions: {
          set: args.permissions,
        }
      },
    }, info)
  },

  async addToCart(parent, args, ctx, info) {
    const { userId } = ctx.request

    if (!userId) {
      throw new Error('You must be logged in!')
    }

    // query the users current cart
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id },
      }
    })

    // check if item is already in cart, increment quantity if so
    if (existingCartItem) {
      return ctx.db.mutation.updateCartItem({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 },
      }, info)
    }

    // if it's not, create fresh CartItem
    return ctx.db.mutation.createCartItem({
      data: {
        user: {
          connect: { id: userId },
        },
        item: {
          connect: { id: args.id },
        },
      }
    }, info)
  },
  async removeFromCart(parent, { id }, ctx, info) {
    const cartItem = await ctx.db.query.cartItem({
      where: { id }
    }, '{ id, user { id } }')
    if (!cartItem) {
      throw new Error(`Hmm, something went wrong. No item with id=${id} found in your cart!`)
    }

    if (ctx.request.userId !== cartItem.user.id) {
      throw new Error('You can only remove items from your own cart... 😕')
    }

    return ctx.db.mutation.deleteCartItem({
      where: { id }
    }, info)
  }
};

module.exports = Mutations;
