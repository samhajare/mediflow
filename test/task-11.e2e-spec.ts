/*
 * Opt-in black-box E2E coverage for Task 11.
 *
 * Required only when running against a dedicated test deployment:
 * MEDIFLOW_E2E_BASE_URL, MEDIFLOW_E2E_ADMIN_TOKEN,
 * MEDIFLOW_E2E_SECONDARY_TOKEN, and MEDIFLOW_E2E_OTHER_TENANT_TOKEN.
 * Tokens are read from the environment and are never committed or logged.
 */
const enabled = Boolean(process.env.MEDIFLOW_E2E_BASE_URL && process.env.MEDIFLOW_E2E_ADMIN_TOKEN);
const describeE2e = enabled ? describe : describe.skip;

type Json = Record<string, unknown>;
const baseUrl = process.env.MEDIFLOW_E2E_BASE_URL ?? '';
const adminToken = process.env.MEDIFLOW_E2E_ADMIN_TOKEN ?? '';
const secondaryToken = process.env.MEDIFLOW_E2E_SECONDARY_TOKEN ?? adminToken;
const otherTenantToken = process.env.MEDIFLOW_E2E_OTHER_TENANT_TOKEN ?? '';

async function request(path: string, token: string, init: RequestInit = {}): Promise<{ status: number; body: Json }> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}`, ...(init.headers ?? {}) },
  });
  return { status: response.status, body: (await response.json()) as Json };
}

describeE2e('Task 11 critical appointment flow', () => {
  let doctorId: string;
  let patientId: string;
  let appointmentId: string;
  const startTime = '2026-10-12T03:30:00.000Z';

  it('onboards clinic, creates doctor/schedule/patient, and reads availability', async () => {
    const clinic = await request('/v1/clinics', adminToken, { method: 'POST', body: JSON.stringify({ name: `E2E Clinic ${Date.now()}`, timezone: 'Asia/Kolkata' }) });
    expect([200, 201, 409]).toContain(clinic.status);
    const doctor = await request('/v1/doctors', adminToken, { method: 'POST', body: JSON.stringify({ firstName: 'E2E', lastName: 'Doctor', email: `e2e-${Date.now()}@example.com`, specialization: 'General' }) });
    expect([200, 201]).toContain(doctor.status);
    doctorId = String((doctor.body.data as Json).id);
    const schedule = await request(`/v1/doctors/${doctorId}/schedules`, adminToken, { method: 'POST', body: JSON.stringify({ dayOfWeek: 1, startTime: '09:00', endTime: '11:00', slotDurationMinutes: 30 }) });
    expect([200, 201]).toContain(schedule.status);
    const patient = await request('/v1/patients', secondaryToken, { method: 'POST', body: JSON.stringify({ firstName: 'E2E', lastName: 'Patient' }) });
    expect([200, 201]).toContain(patient.status);
    patientId = String((patient.body.data as Json).id);
    const availability = await request(`/v1/doctors/${doctorId}/availability?date=2026-10-12`, secondaryToken);
    expect(availability.status).toBe(200);
    expect((availability.body.slots as string[] | undefined) ?? ((availability.body.data as Json)?.slots as string[])).toContain(startTime);
  });

  it('books, hides the occupied slot, rejects a competing booking, reschedules, and cancels', async () => {
    const booking = await request('/v1/appointments', secondaryToken, { method: 'POST', body: JSON.stringify({ doctorId, patientId, startTime }) });
    expect([200, 201]).toContain(booking.status);
    appointmentId = String((booking.body.data as Json).id);
    const unavailable = await request(`/v1/doctors/${doctorId}/availability?date=2026-10-12`, secondaryToken);
    expect(((unavailable.body.slots as string[] | undefined) ?? ((unavailable.body.data as Json)?.slots as string[]))).not.toContain(startTime);
    const competing = await request('/v1/appointments', secondaryToken, { method: 'POST', body: JSON.stringify({ doctorId, patientId, startTime }) });
    expect(competing.status).toBe(409);
    expect(competing.body.code).toBe('APPOINTMENT_SLOT_UNAVAILABLE');
    const rescheduled = await request(`/v1/appointments/${appointmentId}/reschedule`, secondaryToken, { method: 'PATCH', body: JSON.stringify({ startTime: '2026-10-12T04:00:00.000Z' }) });
    expect(rescheduled.status).toBe(200);
    const cancelled = await request(`/v1/appointments/${appointmentId}/cancel`, secondaryToken, { method: 'PATCH', body: '{}' });
    expect(cancelled.status).toBe(200);
  });

  it('denies cross-tenant doctor, patient, and appointment access', async () => {
    if (!otherTenantToken) return;
    const doctor = await request(`/v1/doctors/${doctorId}`, otherTenantToken);
    const patient = await request(`/v1/patients/${patientId}`, otherTenantToken);
    const appointment = await request(`/v1/appointments/${appointmentId}`, otherTenantToken);
    expect(doctor.body.code).toBe('DOCTOR_NOT_FOUND');
    expect(patient.body.code).toBe('PATIENT_NOT_FOUND');
    expect(appointment.body.code).toBe('APPOINTMENT_NOT_FOUND');
    expect(doctor.status).toBe(404);
    expect(patient.status).toBe(404);
    expect(appointment.status).toBe(404);
  });
});
