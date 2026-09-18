import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('patients')
@Index('patients_tenant_status_idx', ['tenantId', 'status'])
@Index('patients_tenant_phone_idx', ['tenantId', 'phone'])
@Index('patients_tenant_email_idx', ['tenantId', 'email'])
export class Patient {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ name: 'tenant_id', type: 'uuid' }) tenantId!: string;
  @Column({ name: 'first_name', length: 100 }) firstName!: string;
  @Column({ name: 'last_name', length: 100 }) lastName!: string;
  @Column({ type: 'varchar', length: 30, nullable: true }) phone!:
    string | null;
  @Column({ type: 'varchar', length: 255, nullable: true }) email!:
    string | null;
  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth!: string | null;
  @Column({ length: 20, default: 'ACTIVE' }) status!: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
