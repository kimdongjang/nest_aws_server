import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UserService {
    private readonly users = [
        {
            userid: 1,
            username: 'john',
            password: 'changeme',
        },
        {
            userid: 2,
            username: 'maria',
            password: 'guess'
        }
    ];

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }
}
