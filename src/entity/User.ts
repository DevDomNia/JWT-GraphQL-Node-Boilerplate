import { Field, Int, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => String)
  @Column('text', { unique: true })
  username: string

  @Field(() => String)
  @Column('text', { unique: true })
  email: string

  @Column('text')
  password: string
}
