import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('appointments')
@Index('appointments_tenant_doctor_start_idx', [
  'tenantId',
  'doctorId',
  'startTime',
])
@Index('appointments_tenant_patient_start_idx', [
  'tenantId',
  'patientId',
  'startTime',
])
@Index('appointments_tenant_status_start_idx', [
  'tenantId',
  'status',
  'startTime',
])
export class Appointment {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ name: 'tenant_id', type: 'uuid' }) tenantId!: string;
  @Column({ name: 'doctor_id', type: 'uuid' }) doctorId!: string;
  @Column({ name: 'patient_id', type: 'uuid' }) patientId!: string;
  @Column({ name: 'start_time', type: 'timestamptz' }) startTime!: Date;
  @Column({ name: 'end_time', type: 'timestamptz' }) endTime!: Date;
  @Column({ length: 20 }) status!: string;
  @Column({ type: 'varchar', length: 500, nullable: true }) reason!:
    string | null;
  @Column({ name: 'cancelled_at', type: 'timestamptz', nullable: true })
  cancelledAt!: Date | null;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
