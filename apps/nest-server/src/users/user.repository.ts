import { User } from "src/database/entities/User.entity";
import { AbstractRepository, EntityRepository } from "typeorm";

@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {
  public async findOneByEmail(email: string) {
    const qb = this.repository.createQueryBuilder("User").leftJoinAndSelect("User.userAuth", "userAuth").leftJoinAndSelect("User.userProfile", "userProfile");

    qb.andWhere("User.email = :email", { email });

    return qb.getOne();
  }
}
