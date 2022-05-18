import { hash, compare } from 'bcryptjs'
import { AuthContext } from '../context/authContext'
import { User } from '../entity/User'
import { createRefreshToken, createAccessToken } from '../util/auth'
import { setRefreshtoken } from '../util/setRefreshToken'
import { ObjectType, Field, Arg, Ctx, Mutation } from 'type-graphql'

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string
  @Field(() => User)
  user: User
}

@ObjectType()
class RegisterResponse {
  @Field()
  accessToken: string
  @Field(() => User)
  user: User
}

export class AuthResolver {
  @Mutation(() => RegisterResponse)
  async register(
    @Arg('username') username: string,
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: AuthContext
  ) {
    const hashedPassword = await hash(password, 12)
    try {
      const user = new User()
      user.username = username
      user.email = email
      user.password = hashedPassword
      await user.save()

      setRefreshtoken(res, createRefreshToken(user))

      return {
        accessToken: createAccessToken(user),
        user,
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Ctx() { res }: AuthContext
  ): Promise<LoginResponse> {
    const user = await User.findOneBy({ username })
    if (!user) {
      throw new Error('Could not find user')
    }

    const valid = await compare(password, user.password)
    if (!valid) {
      throw new Error('Incorrect password')
    }

    setRefreshtoken(res, createRefreshToken(user))

    return {
      accessToken: createAccessToken(user),
      user,
    }
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: AuthContext) {
    setRefreshtoken(res, '')
    return true
  }
}
