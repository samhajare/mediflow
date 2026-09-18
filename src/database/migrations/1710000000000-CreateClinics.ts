import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClinics1710000000000 implements MigrationInterface {
  name = 'CreateClinics1710000000000';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE clinics (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name varchar(150) NOT NULL, email varchar(255), phone varchar(30), timezone varchar(100) NOT NULL, status varchar(20) NOT NULL DEFAULT 'ACTIVE', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), CONSTRAINT clinics_status_check CHECK (status IN ('ACTIVE','INACTIVE')))`,
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE clinics');
  }
}
