import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@app/common/drizzle/drizzle.service';
import { eq } from 'drizzle-orm';
import { user } from '@app/common/drizzle/schema';
import { UserModel } from '@app/common/drizzle/models.type';
import { SignUpDto } from '@app/modules/auth/dtos/sign-up-dto';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class UserService {
  constructor(private readonly drizzle: DrizzleService) {}

  async findByEmail(email: string): Promise<UserModel | undefined> {
    return await this.drizzle.client.query.user.findFirst({
      where: eq(user.email, email),
    });
  }

  async create(
    dto: Omit<SignUpDto, 'passwordConfirmation'>,
  ): Promise<UserModel> {
    const {
      addressLine,
      barangay,
      cityMunicipality,
      province,
      country,
      postalCode,
      ...rest
    } = dto;
    const address = [
      {
        reciever: rest.name,
        phone: rest.phone,
        addressLine,
        barangay,
        cityMunicipality,
        province,
        country,
        postalCode,
      },
    ];
    return await this.drizzle.client
      .insert(user)
      .values({
        id: createId(),
        ...rest,
        addresses: address,
      })
      .returning()
      .then((rows) => rows[0]);
  }

  // async findOne(id: number) {
  //   const result = await this.drizzle.client.execute(
  //     sql`EXPLAIN SELECT * FROM product WHERE categories @> '["Electronics"]'`,
  //   );

  //   console.log(
  //     id,
  //     result.rows.map((r) => r['QUERY PLAN']),
  //   );
  // }
}
