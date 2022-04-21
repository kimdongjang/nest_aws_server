import { DynamicModule, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({
    providers:[DatabaseService]
})
export class DatabaseModule {
    // static forRoot(entities = [], option?): DynamicModule{
        
    //     return{
            
    //     }
    // }
}
