import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateLimit1602818562106 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.createTable(
      new Table({
        name: 'limit',
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
            name: 'total_limit',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'current_limit',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'credit_card_number',
            type: 'int',
          },
          {
            name: 'is_debit',
            type: 'boolean',
          },
        ],
        foreignKeys: [
          {
            name: 'CreditCardLimit',
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
    await queryRunner.dropTable('limit');
  }
}
