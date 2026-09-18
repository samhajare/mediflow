import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clinics')
export class Clinic {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ length: 150 }) name!: string;
  @Column({ type: 'varchar', length: 255, nullable: true }) email!:
    string | null;
  @Column({ type: 'varchar', length: 30, nullable: true }) phone!:
    string | null;
  @Column({ length: 100 }) timezone!: string;
  @Column({ length: 20, default: 'ACTIVE' }) status!: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
