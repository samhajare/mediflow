import { DataSource } from 'typeorm';
import { databaseOptions } from '../src/config/database.config';

const runIntegration = process.env.MEDIFLOW_DB_INTEGRATION === 'true';
const describeDatabase = runIntegration ? describe : describe.skip;

describeDatabase('database constraints (local/test PostgreSQL only)', () => {
  let dataSource: DataSource;
  let clinicId: string;
  let otherClinicId: string;
  let doctorId: string;
  let patientId: string;

  beforeAll(async () => {
    if (process.env.NODE_ENV === 'production')
      throw new Error('Database integration tests cannot target production');
    dataSource = new DataSource({ ...databaseOptions(), migrationsRun: false });
    await dataSource.initialize();
    await dataSource.runMigrations();
    const clinic = await dataSource.query(
      "INSERT INTO clinics (name, timezone) VALUES ('Test Clinic', 'UTC') RETURNING id",
    );
    const otherClinic = await dataSource.query(
      "INSERT INTO clinics (name, timezone) VALUES ('Other Clinic', 'UTC') RETURNING id",
    );
    clinicId = clinic[0].id;
    otherClinicId = otherClinic[0].id;
    const doctor = await dataSource.query(
      "INSERT INTO doctors (tenant_id, first_name, last_name, email, specialization) VALUES ($1, 'A', 'Doctor', 'same@example.com', 'General') RETURNING id",
      [clinicId],
    );
    doctorId = doctor[0].id;
    const patient = await dataSource.query(
      "INSERT INTO patients (tenant_id, first_name, last_name) VALUES ($1, 'A', 'Patient') RETURNING id",
      [clinicId],
    );
    patientId = patient[0].id;
  });

  afterAll(async () => {
    await dataSource?.destroy();
  });

  it('enforces tenant foreign keys', async () => {
    await expect(
      dataSource.query(
        "INSERT INTO patients (tenant_id, first_name, last_name) VALUES ($1, 'X', 'Y')",
        ['00000000-0000-0000-0000-000000000000'],
      ),
    ).rejects.toThrow();
  });

  it('allows the same doctor email in another tenant but not the same tenant', async () => {
    await expect(
      dataSource.query(
        "INSERT INTO doctors (tenant_id, first_name, last_name, email, specialization) VALUES ($1, 'B', 'Doctor', 'same@example.com', 'General')",
        [clinicId],
      ),
    ).rejects.toThrow();
    await expect(
      dataSource.query(
        "INSERT INTO doctors (tenant_id, first_name, last_name, email, specialization) VALUES ($1, 'B', 'Doctor', 'same@example.com', 'General')",
        [otherClinicId],
      ),
    ).resolves.toBeDefined();
  });

  it('enforces schedule checks', async () => {
    await expect(
      dataSource.query(
        "INSERT INTO doctor_schedules (tenant_id, doctor_id, day_of_week, start_time, end_time, slot_duration_minutes) VALUES ($1, $2, 7, '09:00', '10:00', 30)",
        [clinicId, doctorId],
      ),
    ).rejects.toThrow();
    await expect(
      dataSource.query(
        "INSERT INTO doctor_schedules (tenant_id, doctor_id, day_of_week, start_time, end_time, slot_duration_minutes) VALUES ($1, $2, 1, '10:00', '09:00', 30)",
        [clinicId, doctorId],
      ),
    ).rejects.toThrow();
  });

  it('prevents active double booking but permits a cancelled slot', async () => {
    const values = [
      clinicId,
      doctorId,
      patientId,
      '2026-10-01T10:00:00Z',
      '2026-10-01T10:30:00Z',
    ];
    await dataSource.query(
      "INSERT INTO appointments (tenant_id, doctor_id, patient_id, start_time, end_time, status) VALUES ($1, $2, $3, $4, $5, 'CANCELLED')",
      values,
    );
    await dataSource.query(
      "INSERT INTO appointments (tenant_id, doctor_id, patient_id, start_time, end_time, status) VALUES ($1, $2, $3, $4, $5, 'SCHEDULED')",
      values,
    );
    await expect(
      dataSource.query(
        "INSERT INTO appointments (tenant_id, doctor_id, patient_id, start_time, end_time, status) VALUES ($1, $2, $3, $4, $5, 'CONFIRMED')",
        values,
      ),
    ).rejects.toThrow();
  });
});
