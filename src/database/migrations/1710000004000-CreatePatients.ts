import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePatients1710000004000 implements MigrationInterface {
  name = 'CreatePatients1710000004000';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE patients (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, first_name varchar(100) NOT NULL, last_name varchar(100) NOT NULL, phone varchar(30), email varchar(255), date_of_birth date, status varchar(20) NOT NULL DEFAULT 'ACTIVE', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), CONSTRAINT patients_tenant_fk FOREIGN KEY (tenant_id) REFERENCES clinics(id) ON DELETE RESTRICT, CONSTRAINT patients_status_check CHECK (status IN ('ACTIVE','INACTIVE')))`,
    );
    await queryRunner.query(
      'CREATE INDEX patients_tenant_status_idx ON patients (tenant_id, status)',
    );
    await queryRunner.query(
      'CREATE INDEX patients_tenant_phone_idx ON patients (tenant_id, phone)',
    );
    await queryRunner.query(
      'CREATE INDEX patients_tenant_email_idx ON patients (tenant_id, email)',
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE patients');
  }
}
