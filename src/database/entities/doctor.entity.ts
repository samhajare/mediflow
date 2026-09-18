import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('doctors')
@Index('doctors_tenant_email_unique', ['tenantId', 'email'], { unique: true })
@Index('doctors_tenant_status_idx', ['tenantId', 'status'])
@Index('doctors_tenant_specialization_idx', ['tenantId', 'specialization'])
export class Doctor {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ name: 'tenant_id', type: 'uuid' }) tenantId!: string;
  @Column({ name: 'user_id', type: 'uuid', nullable: true }) userId!:
    string | null;
  @Column({ name: 'first_name', length: 100 }) firstName!: string;
  @Column({ name: 'last_name', length: 100 }) lastName!: string;
  @Column({ length: 255 }) email!: string;
  @Column({ type: 'varchar', length: 30, nullable: true }) phone!:
    string | null;
  @Column({ length: 150 }) specialization!: string;
  @Column({ type: 'varchar', length: 255, nullable: true }) qualification!:
    string | null;
  @Column({ length: 20, default: 'ACTIVE' }) status!: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
