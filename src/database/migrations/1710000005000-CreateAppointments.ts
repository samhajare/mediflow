import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAppointments1710000005000 implements MigrationInterface {
  name = 'CreateAppointments1710000005000';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE appointments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL, doctor_id uuid NOT NULL, patient_id uuid NOT NULL, start_time timestamptz NOT NULL, end_time timestamptz NOT NULL, status varchar(20) NOT NULL, reason varchar(500), cancelled_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), CONSTRAINT appointments_tenant_fk FOREIGN KEY (tenant_id) REFERENCES clinics(id) ON DELETE RESTRICT, CONSTRAINT appointments_doctor_fk FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT, CONSTRAINT appointments_patient_fk FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT, CONSTRAINT appointments_status_check CHECK (status IN ('SCHEDULED','CONFIRMED','CANCELLED','COMPLETED','NO_SHOW')), CONSTRAINT appointments_time_check CHECK (start_time < end_time))`,
    );
    await queryRunner.query(
      'CREATE INDEX appointments_tenant_doctor_start_idx ON appointments (tenant_id, doctor_id, start_time)',
    );
    await queryRunner.query(
      'CREATE INDEX appointments_tenant_patient_start_idx ON appointments (tenant_id, patient_id, start_time)',
    );
    await queryRunner.query(
      'CREATE INDEX appointments_tenant_status_start_idx ON appointments (tenant_id, status, start_time)',
    );
    await queryRunner.query(
      "CREATE UNIQUE INDEX appointments_active_slot_unique ON appointments (tenant_id, doctor_id, start_time) WHERE status IN ('SCHEDULED', 'CONFIRMED')",
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE appointments');
  }
}
