import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateBalance1602818089076 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.createTable(
      new Table({
        name: 'balance',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'company_id',
            type: 'uuid',
          },
          {
            name: 'balance',
            type: 'varchar',
          },
          {
            name: 'debit_card_number',
            type: 'varchar',
          },
        ],
        foreignKeys: [
          {
            name: 'CompanyBalance',
            referencedTableName: 'companies',
            referencedColumnNames: ['id'],
            columnNames: ['company_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('balance');
  }
}
