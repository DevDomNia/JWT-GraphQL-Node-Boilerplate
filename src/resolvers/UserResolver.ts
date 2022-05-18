import { AuthContext } from 'src/context/authContext'
import { User } from '../entity/User'
import { isAuth } from '../middleware/isAuth'
import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql'

@Resolver()
export class UserResolver {
  @Query(() => String)
  sayHello() {
    return 'Hello ... its me ... graphql!'
  }
  @Query(() => User)
  @UseMiddleware(isAuth)
  getUserInfo(@Ctx() { payload }: AuthContext) {
    return User.findOneBy({ id: Number(payload?.userId) })
  }

  @Query(() => [User])
  @UseMiddleware(isAuth)
  getUsers() {
    return User.find()
  }
}
