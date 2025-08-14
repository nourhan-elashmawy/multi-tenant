import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class AddTenantColumn1754991660863 implements MigrationInterface {
  name = 'AddTenantColumn1754991660863';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the email index
    await queryRunner.dropIndex('users', 'IDX_users_email');

    // Add tenantId column
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'tenantId',
        type: 'varchar',
        isNullable: false,
      }),
    );

    // Drop the existing name column
    await queryRunner.dropColumn('users', 'name');

    // Re-add the name column with updated constraints
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'name',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the name column
    await queryRunner.dropColumn('users', 'name');

    // Re-add name column with original constraints (varchar(255))
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'name',
        type: 'varchar',
        length: '255',
        isNullable: false,
      }),
    );

    // Drop the tenantId column
    await queryRunner.dropColumn('users', 'tenantId');

    // Recreate the email index
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_users_email',
        columnNames: ['email'],
      }),
    );
  }
}
