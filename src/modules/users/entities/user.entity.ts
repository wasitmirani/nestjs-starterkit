import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert 
} from 'typeorm';

import * as bcrypt from 'bcrypt';
import { Helpers } from 'src/common/utils/helpers';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;
  @Column({ type: 'varchar', length: 255, nullable: true })
  uuid?: string | null;
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'timestamp', nullable: true, name: 'email_verified_at' })
  emailVerifiedAt?: Date | null;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'remember_token' })
  rememberToken?: string | null;

  @CreateDateColumn({ type: 'timestamp', nullable: true, name: 'created_at' })
  createdAt?: Date | null;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, name: 'updated_at' })
  updatedAt?: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  token?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'user_name' })
  userName?: string | null;

 

  @Column({ type: 'varchar', length: 255, nullable: true })
  slug?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'first_name' })
  firstName?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'last_name' })
  lastName?: string | null;

  @Column({ type: 'datetime', nullable: true, name: 'last_login' })
  lastLogin?: Date | null;

  @Column({
    type: 'varchar',
    length: 255,
    default: 'default.png',
    name: 'thumbnail',
  })
  thumbnail: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  city?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  state?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'zip_code' })
  zipCode?: string | null;

  @Column({ type: 'date', nullable: true })
  dob?: Date | null;

  @Column({
    type: 'enum',
    enum: ['male', 'female', 'other'],
    nullable: true,
  })
  gender?: 'male' | 'female' | 'other' | null;

  @Column({
    type: 'enum',
    enum: ['single', 'married', 'divorced', 'widowed'],
    nullable: true,
    name: 'marital_status',
  })
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed' | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone?: string | null;

 @BeforeInsert()
  async beforeInsert() {
    // Generate UUID if not provided
    if (!this.uuid) {
      this.uuid = Helpers.generateUUID();
    }

    // // Generate username if not provided
    // if (!this.username && this.email) {
    //   this.username = Helpers.generateUsernameFromEmail(this.email);
    // }

    // // Hash password if provided and not already hashed
    // if (this.password && !this.password.startsWith('$2a$')) {
    //   this.password = await bcrypt.hash(this.password, 12);
    // }
  }


   async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}