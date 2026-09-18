import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDoctorSchedules1710000003000 implements MigrationInterface {
  name = 'CreateDoctorSchedules1710000003000';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE doctor_schedules (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, doctor_id uuid NOT NULL, day_of_week smallint NOT NULL, start_time time NOT NULL, end_time time NOT NULL, slot_duration_minutes smallint NOT NULL DEFAULT 30, status varchar(20) NOT NULL DEFAULT 'ACTIVE', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), CONSTRAINT schedules_tenant_fk FOREIGN KEY (tenant_id) REFERENCES clinics(id) ON DELETE RESTRICT, CONSTRAINT schedules_doctor_fk FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT, CONSTRAINT schedules_day_check CHECK (day_of_week BETWEEN 0 AND 6), CONSTRAINT schedules_time_check CHECK (start_time < end_time), CONSTRAINT schedules_slot_duration_check CHECK (slot_duration_minutes > 0), CONSTRAINT schedules_status_check CHECK (status IN ('ACTIVE','INACTIVE')))`,
    );
    await queryRunner.query(
      'CREATE INDEX doctor_schedules_tenant_doctor_idx ON doctor_schedules (tenant_id, doctor_id)',
    );
    await queryRunner.query(
      'CREATE INDEX doctor_schedules_tenant_doctor_day_status_idx ON doctor_schedules (tenant_id, doctor_id, day_of_week, status)',
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE doctor_schedules');
  }
}
