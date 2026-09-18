import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('doctor_schedules')
@Index('doctor_schedules_tenant_doctor_idx', ['tenantId', 'doctorId'])
@Index('doctor_schedules_tenant_doctor_day_status_idx', [
  'tenantId',
  'doctorId',
  'dayOfWeek',
  'status',
])
export class DoctorSchedule {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ name: 'tenant_id', type: 'uuid' }) tenantId!: string;
  @Column({ name: 'doctor_id', type: 'uuid' }) doctorId!: string;
  @Column({ name: 'day_of_week', type: 'smallint' }) dayOfWeek!: number;
  @Column({ name: 'start_time', type: 'time' }) startTime!: string;
  @Column({ name: 'end_time', type: 'time' }) endTime!: string;
  @Column({ name: 'slot_duration_minutes', type: 'smallint', default: 30 })
  slotDurationMinutes!: number;
  @Column({ length: 20, default: 'ACTIVE' }) status!: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
