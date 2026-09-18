import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDoctors1710000002000 implements MigrationInterface {
  name = 'CreateDoctors1710000002000';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE doctors (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, user_id uuid, first_name varchar(100) NOT NULL, last_name varchar(100) NOT NULL, email varchar(255) NOT NULL, phone varchar(30), specialization varchar(150) NOT NULL, qualification varchar(255), status varchar(20) NOT NULL DEFAULT 'ACTIVE', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), CONSTRAINT doctors_tenant_fk FOREIGN KEY (tenant_id) REFERENCES clinics(id) ON DELETE RESTRICT, CONSTRAINT doctors_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL, CONSTRAINT doctors_status_check CHECK (status IN ('ACTIVE','INACTIVE')))`,
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX doctors_tenant_email_unique ON doctors (tenant_id, email)',
    );
    await queryRunner.query(
      'CREATE INDEX doctors_tenant_status_idx ON doctors (tenant_id, status)',
    );
    await queryRunner.query(
      'CREATE INDEX doctors_tenant_specialization_idx ON doctors (tenant_id, specialization)',
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE doctors');
  }
}
