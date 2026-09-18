import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
@Index('users_tenant_id_idx', ['tenantId'])
@Index('users_tenant_role_idx', ['tenantId', 'role'])
export class User {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ name: 'cognito_sub', length: 255, unique: true })
  cognitoSub!: string;
  @Column({ name: 'tenant_id', type: 'uuid' }) tenantId!: string;
  @Column({ length: 255 }) email!: string;
  @Column({ length: 30 }) role!: string;
  @Column({ length: 20, default: 'ACTIVE' }) status!: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
