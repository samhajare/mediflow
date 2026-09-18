import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1710000001000 implements MigrationInterface {
  name = 'CreateUsers1710000001000';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE users (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), cognito_sub varchar(255) NOT NULL UNIQUE, tenant_id uuid NOT NULL, email varchar(255) NOT NULL, role varchar(30) NOT NULL, status varchar(20) NOT NULL DEFAULT 'ACTIVE', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), CONSTRAINT users_tenant_fk FOREIGN KEY (tenant_id) REFERENCES clinics(id) ON DELETE RESTRICT, CONSTRAINT users_role_check CHECK (role IN ('CLINIC_ADMIN','RECEPTIONIST','DOCTOR')), CONSTRAINT users_status_check CHECK (status IN ('ACTIVE','INACTIVE')))`,
    );
    await queryRunner.query(
      'CREATE INDEX users_tenant_id_idx ON users (tenant_id)',
    );
    await queryRunner.query(
      'CREATE INDEX users_tenant_role_idx ON users (tenant_id, role)',
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE users');
  }
}
