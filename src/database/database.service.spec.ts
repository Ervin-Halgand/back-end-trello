import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database.module';

describe('DatabaseModule', () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
    }).compile();

    // Retrieve the Sequelize instance
    sequelize = module.get<Sequelize>(Sequelize);
  });

  it('should be connected to the database', async () => {
    // Expect that the authentication resolves without throwing an error
    await expect(sequelize.authenticate()).resolves.not.toThrow();
  });

  afterAll(async () => {
    // Close the database connection after tests
    await sequelize.close();
  });
});
