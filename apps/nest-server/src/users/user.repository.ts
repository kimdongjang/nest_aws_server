import { AbstractRepository, EntityRepository } from "typeorm";
import { UserEntity } from "./entities/user.entity";

@EntityRepository(UserEntity)
export class UserRepository extends AbstractRepository<UserEntity> {

    public async findOneByEmail(email: string) {
        const qb = this.repository
          .createQueryBuilder('User')
          .leftJoinAndSelect('User.userAuth', 'userAuth')
          .leftJoinAndSelect('User.userProfile', 'userProfile')
    
        qb.andWhere('User.email = :email', { email })
    
        return qb.getOne()
      }
    
}