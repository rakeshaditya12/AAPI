import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { MembersAddress } from 'src/database/entities/members-address.entity';
import { MembersEducation } from 'src/database/entities/members-education.entity';
import { MembersPayment } from 'src/database/entities/members-payment.entity';
import { MembersPhone } from 'src/database/entities/members-phone.entity';
import { Members } from 'src/database/entities/members.entity';
import { MembersRepository } from 'src/database/repositories/member.repository';
import { hashPassword } from 'src/utils/password';
import { createQueryBuilder } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { CreateQuickMemberDto } from './dto/create-quick-member.dto';
import { SearchMemberDto } from './dto/search-member.dto';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from 'src/stripe/constants';
import { STRIPE } from 'src/stripe/stripe-constants';
import { AvailableMemberDto } from './dto/available-member.dto';

@Injectable()
export class MembershipService {
  constructor(
    private readonly membersRepository: MembersRepository,
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
  ) {}

  async create(createMemberDto: CreateMemberDto) {
    const alreadyExistMember = await this.membersRepository.findByEmail(
      createMemberDto.username,
    );

    if (alreadyExistMember) {
      throw new BadRequestException(
        `member with email id ${createMemberDto.username} already exist`,
      );
    }
    // *****************************
    if (createMemberDto.payment) {
      const stripeCardToken = await this.createStripeCardToken(
        createMemberDto.payment_details[0].card_number,
        createMemberDto.payment_details[0].card_expiration_date,
        createMemberDto.payment_details[0].card_cvv_number,
      );

      if (stripeCardToken['id'] && stripeCardToken['object'] == 'token') {
        const stripeCustomer = await this.createStripeCustomer(
          createMemberDto.payment_details[0].card_holder_name,
          createMemberDto.primary_email_address,
          stripeCardToken.id,
        );

        if (stripeCustomer['id'] && stripeCustomer['object'] == 'customer') {
          const stripeCharge = await this.createStripeCharge(
            createMemberDto.payment_details[0].amount,
            stripeCustomer['id'],
            stripeCustomer['default_source'],
          );

          if (
            stripeCharge['id'] &&
            stripeCharge['object'] == 'payment_intent' &&
            stripeCharge['status'] == 'succeeded'
          ) {
            return await this.saveLongMemberDetails(
              createMemberDto,
              stripeCustomer['id'],
            );
          } else {
            return stripeCharge;
          }
        }
      } else {
        return stripeCardToken;
      }
    } else {
      return await this.saveLongMemberDetails(createMemberDto);
    }
    // *****************************
  }

  async saveLongMemberDetails(
    createMemberDto: CreateMemberDto,
    stripeCustomerId?: string,
  ) {
    console.log(createMemberDto);
    const member = new Members();
    member.member_type = createMemberDto.member_type;
    member.member_sub_type = createMemberDto.member_sub_type;
    if ('profile_picture' in createMemberDto) {
      member.profile_picture = createMemberDto.profile_picture;
    }
    member.first_name = createMemberDto.first_name;
    if ('middle_name' in createMemberDto) {
      member.middle_name = createMemberDto.first_name;
    }
    member.last_name = createMemberDto.last_name;
    member.primary_degree = createMemberDto.primary_degree;
    if ('secondary_degree' in createMemberDto) {
      member.secondary_degree = createMemberDto.secondary_degree;
    }
    member.primary_specialty = createMemberDto.primary_specialty;
    if ('secondary_specialty' in createMemberDto) {
      member.secondary_specialty = createMemberDto.secondary_specialty;
    }
    member.gender = createMemberDto.gender;
    if ('date_of_birth' in createMemberDto) {
      member.date_of_birth = createMemberDto.date_of_birth;
    }
    member.primary_email_address = createMemberDto.primary_email_address;
    if ('secondary_email_address' in createMemberDto) {
      member.secondary_email_address = createMemberDto.secondary_email_address;
    }
    if ('email_address_visible' in createMemberDto) {
      member.email_address_visible = createMemberDto.email_address_visible;
    }
    member.newsletter = createMemberDto.newsletter;
    if ('region' in createMemberDto) {
      member.region = createMemberDto.region;
    }
    if ('job_title' in createMemberDto) {
      member.job_title = createMemberDto.job_title;
    }
    if ('feature_profile' in createMemberDto) {
      member.feature_profile = createMemberDto.feature_profile;
    }
    if ('medical_license_number' in createMemberDto) {
      member.medical_license_number = createMemberDto.medical_license_number;
    }
    if ('individual_NPI_number' in createMemberDto) {
      member.individual_NPI_number = createMemberDto.individual_NPI_number;
    }
    if ('practice_type' in createMemberDto) {
      member.practice_type = createMemberDto.practice_type;
    }
    if ('website' in createMemberDto) {
      member.website = createMemberDto.website;
    }
    if ('detailed_bio' in createMemberDto) {
      member.detailed_bio = createMemberDto.detailed_bio;
    }
    if ('organization_1' in createMemberDto) {
      member.organization_1 = createMemberDto.organization_1;
    }
    if ('organization_2' in createMemberDto) {
      member.organization_2 = createMemberDto.organization_2;
    }
    if ('organization_3' in createMemberDto) {
      member.organization_3 = createMemberDto.organization_3;
    }
    member.username = createMemberDto.username;
    member.password = await hashPassword(createMemberDto.password);
    // member.address_details = JSON.stringify(createMemberDto.address_details);
    // member.phone_details = JSON.stringify(createMemberDto.phone_details);
    // member.education_details = JSON.stringify(
    //   createMemberDto.education_details,
    // );
    if ('residency_institution' in createMemberDto) {
      member.residency_institution = createMemberDto.residency_institution;
    }
    if ('residency_institution_start_year' in createMemberDto) {
      member.residency_institution_start_year =
        createMemberDto.residency_institution_start_year;
    }
    if ('residency_institution_end_year' in createMemberDto) {
      member.residency_institution_end_year =
        createMemberDto.residency_institution_end_year;
    }
    if ('fellowship_institution' in createMemberDto) {
      member.fellowship_institution = createMemberDto.fellowship_institution;
    }
    if ('fellowship_start_year' in createMemberDto) {
      member.fellowship_start_year = createMemberDto.fellowship_start_year;
    }
    if ('fellowship_end_year' in createMemberDto) {
      member.fellowship_end_year = createMemberDto.fellowship_end_year;
    }
    if ('amount' in createMemberDto) {
      member.amount = createMemberDto.amount;
    }
    if (stripeCustomerId) {
      member.stripeCustomerId = stripeCustomerId;
    }

    await member.save();

    if (member.id) {
      const membersAddress = new MembersAddress();
      createMemberDto.address_details.forEach(async (singleAddress) => {
        membersAddress.address_type = singleAddress.address_type;
        if ('attention' in singleAddress) {
          membersAddress.attention = singleAddress.attention;
        }
        membersAddress.address_1 = singleAddress.address_1;
        if ('address_2' in singleAddress) {
          membersAddress.address_2 = singleAddress.address_2;
        }
        membersAddress.city = singleAddress.city;
        membersAddress.state = singleAddress.state;
        membersAddress.country = singleAddress.country;
        membersAddress.zip_code = singleAddress.zip_code;
        if ('is_primary_address' in singleAddress) {
          membersAddress.is_primary_address = singleAddress.is_primary_address;
        }
        if ('address_visible' in singleAddress) {
          membersAddress.address_visible = singleAddress.address_visible;
        }
        // membersAddress.member_id = member.id;
        membersAddress.member = member;
        await membersAddress.save();
      });

      const membersPhone = new MembersPhone();
      createMemberDto.phone_details.forEach(async (singlePhone) => {
        membersPhone.phone_type = singlePhone.phone_type;
        membersPhone.phone_number = singlePhone.phone_number;
        if ('extension' in singlePhone) {
          membersPhone.extension = singlePhone.extension;
        }
        if ('phone_visible' in singlePhone) {
          membersPhone.phone_visible = singlePhone.phone_visible;
        }
        // membersPhone.member_id = member.id;
        membersPhone.member = member;
        await membersPhone.save();
      });

      const membersEducation = new MembersEducation();
      createMemberDto.education_details.forEach(async (singleEducation) => {
        membersEducation.degree = singleEducation.degree;
        membersEducation.medical_school_name =
          singleEducation.medical_school_name;
        membersEducation.medical_school_start_year =
          singleEducation.medical_school_start_year;
        membersEducation.medical_school_end_year =
          singleEducation.medical_school_end_year;
        // membersEducation.member_id = member.id;
        membersEducation.member = member;
        await membersEducation.save();

        if (createMemberDto.payment) {
          const membersPayment = new MembersPayment();
          membersPayment.card_holder_name =
            createMemberDto.payment_details[0].card_holder_name;
          // membersPayment.card_type =
          //   createMemberDto.payment_details[0].card_type;
          // membersPayment.card_number =
          //   createMemberDto.payment_details[0].card_number;
          // membersPayment.card_expiration_date =
          //   createMemberDto.payment_details[0].card_expiration_date;
          // membersPayment.card_cvv_number =
          //   createMemberDto.payment_details[0].card_cvv_number;
          membersPayment.amount = createMemberDto.payment_details[0].amount;
          if ('copy_address_from' in createMemberDto.payment_details[0]) {
            membersPayment.copy_address_from =
              createMemberDto.payment_details[0].copy_address_from;
          }
          membersPayment.billing_address_one =
            createMemberDto.payment_details[0].billing_address_one;
          if ('billing_address_two' in createMemberDto.payment_details[0]) {
            membersPayment.billing_address_two =
              createMemberDto.payment_details[0].billing_address_two;
          }
          membersPayment.billing_address_city =
            createMemberDto.payment_details[0].billing_address_city;
          membersPayment.billing_address_state =
            createMemberDto.payment_details[0].billing_address_state;
          membersPayment.billing_address_zip =
            createMemberDto.payment_details[0].billing_address_zip;
          // membersPayment.member_id = member.id;
          if (stripeCustomerId) {
            membersPayment.stripeCustomerId = stripeCustomerId;
          }
          membersPayment.member = member;
          await membersPayment.save();
        }
      });
    }
  }
  async availableMember(availableMemberDto: AvailableMemberDto) {
    const alreadyExistMember = await this.membersRepository.findByEmail(
      availableMemberDto.uname,
    );

    if (alreadyExistMember) {
      throw new BadRequestException(
        `member with email id ${availableMemberDto.uname} already exist`,
      );
    }
    return {
      statusCode: 200,
      message: `member with email id ${availableMemberDto.uname} available`,
    };
  }

  async quickCreateMember(createQuickMemberDto: CreateQuickMemberDto) {
    const alreadyExistMember = await this.membersRepository.findByEmail(
      createQuickMemberDto.username,
    );

    if (alreadyExistMember) {
      throw new BadRequestException(
        `member with email id ${createQuickMemberDto.username} already exist`,
      );
    }
    // *****************************
    if (createQuickMemberDto.payment) {
      const stripeCardToken = await this.createStripeCardToken(
        createQuickMemberDto.payment_details[0].card_number,
        createQuickMemberDto.payment_details[0].card_expiration_date,
        createQuickMemberDto.payment_details[0].card_cvv_number,
      );

      if (stripeCardToken['id'] && stripeCardToken['object'] == 'token') {
        const stripeCustomer = await this.createStripeCustomer(
          createQuickMemberDto.payment_details[0].card_holder_name,
          createQuickMemberDto.primary_email_address,
          stripeCardToken.id,
        );

        if (stripeCustomer['id'] && stripeCustomer['object'] == 'customer') {
          const stripeCharge = await this.createStripeCharge(
            createQuickMemberDto.payment_details[0].amount,
            stripeCustomer['id'],
            stripeCustomer['default_source'],
          );

          if (
            stripeCharge['id'] &&
            stripeCharge['object'] == 'payment_intent' &&
            stripeCharge['status'] == 'succeeded'
          ) {
            return await this.saveQuickMemberDetails(
              createQuickMemberDto,
              stripeCustomer['id'],
            );
          } else {
            return stripeCharge;
          }
        }
      } else {
        return stripeCardToken;
      }
    } else {
      return await this.saveQuickMemberDetails(createQuickMemberDto);
    }
    // *****************************
  }

  async createStripeCardToken(
    cardNumber: number,
    cardExpiration: string,
    cardCVV: number,
  ) {
    try {
      const cardExpArr = cardExpiration.split('/');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const stripeClient = require('stripe')(STRIPE.SECRET_KEY);

      const stripeCardToken = await stripeClient.tokens.create({
        card: {
          number: cardNumber.toString(),
          exp_month: parseInt(cardExpArr[0]),
          exp_year: parseInt(cardExpArr[1]),
          cvc: cardCVV.toString(),
        },
      });

      return stripeCardToken;
    } catch (error) {
      return { status: 'error', message: error.raw.message };
    }
  }

  async createStripeCustomer(name: string, email: string, source: string) {
    try {
      const stripeCustomer = await this.stripe.customers.create({
        name: name,
        email: email,
        source: source,
      });

      return stripeCustomer;
    } catch (error) {
      return { status: 'error', message: error.raw.message };
    }
  }

  async createStripeSource(
    stripeCustomerId: string,
    stripeCardTokenId: string,
  ) {
    try {
      const stripeCard = await this.stripe.customers.createSource(
        stripeCustomerId,
        {
          source: stripeCardTokenId,
        },
      );

      return stripeCard;
    } catch (error) {
      return { status: 'error', message: error.raw.message };
    }
  }

  async createStripeCharge(
    amount: number,
    stripeCustomerId: string,
    defaultSource: string,
  ) {
    try {
      const stripePaymentIntent = await this.stripe.paymentIntents.create({
        amount: amount,
        currency: 'USD',
        payment_method: defaultSource,
        payment_method_types: ['card'],
        customer: stripeCustomerId,
        confirm: true,
      });

      return stripePaymentIntent;
    } catch (error) {
      return { status: 'error', message: error.raw.message };
    }
  }

  async saveQuickMemberDetails(
    createQuickMemberDto: CreateQuickMemberDto,
    stripeCustomerId?: string,
  ) {
    console.log(createQuickMemberDto);

    const member = new Members();
    member.member_type = createQuickMemberDto.member_type;
    member.member_sub_type = createQuickMemberDto.member_sub_type;

    member.first_name = createQuickMemberDto.first_name;

    member.last_name = createQuickMemberDto.last_name;
    member.primary_degree = createQuickMemberDto.primary_degree;

    member.primary_specialty = createQuickMemberDto.primary_specialty;

    member.primary_email_address = createQuickMemberDto.primary_email_address;

    if ('state_of_medical_licence' in createQuickMemberDto) {
      member.state_of_medical_licence =
        createQuickMemberDto.state_of_medical_licence;
    }
    member.username = createQuickMemberDto.username;
    member.password = await hashPassword(createQuickMemberDto.password);
    if ('amount' in createQuickMemberDto) {
      member.amount = createQuickMemberDto.amount;
    }

    if (stripeCustomerId) {
      member.stripeCustomerId = stripeCustomerId;
    }

    await member.save();

    if (member.id) {
      const membersAddress = new MembersAddress();
      createQuickMemberDto.address_details.forEach(async (singleAddress) => {
        membersAddress.address_type = singleAddress.address_type;

        membersAddress.address_1 = singleAddress.address;

        membersAddress.city = singleAddress.city;
        membersAddress.state = singleAddress.state;
        if ('country' in singleAddress) {
          membersAddress.country = singleAddress.country;
        }
        membersAddress.zip_code = singleAddress.zip_code;

        // membersAddress.member_id = member.id;
        membersAddress.member = member;
        await membersAddress.save();
      });

      const membersPhone = new MembersPhone();
      createQuickMemberDto.phone_details.forEach(async (singlePhone) => {
        membersPhone.phone_type = singlePhone.phone_type;
        membersPhone.phone_number = singlePhone.phone_number;

        // membersPhone.member_id = member.id;
        membersPhone.member = member;
        await membersPhone.save();
      });

      const membersEducation = new MembersEducation();
      createQuickMemberDto.education_details.forEach(
        async (singleEducation) => {
          membersEducation.medical_school_name =
            singleEducation.medical_school_name;

          // membersEducation.member_id = member.id;
          membersEducation.member = member;
          await membersEducation.save();
        },
      );

      if (createQuickMemberDto.payment) {
        const membersPayment = new MembersPayment();
        membersPayment.card_holder_name =
          createQuickMemberDto.payment_details[0].card_holder_name;
        // membersPayment.card_type =
        //   createQuickMemberDto.payment_details[0].card_type;
        // membersPayment.card_number =
        //   createQuickMemberDto.payment_details[0].card_number;
        // membersPayment.card_expiration_date =
        //   createQuickMemberDto.payment_details[0].card_expiration_date;
        // membersPayment.card_cvv_number =
        //   createQuickMemberDto.payment_details[0].card_cvv_number;
        membersPayment.amount = createQuickMemberDto.payment_details[0].amount;
        if (stripeCustomerId) {
          membersPayment.stripeCustomerId = stripeCustomerId;
        }
        // membersPayment.member_id = member.id;
        membersPayment.member = member;
        await membersPayment.save();
      }
    }
    return member;
  }

  async searchMembers(searchMemberDto: SearchMemberDto) {
    const createQuery = createQueryBuilder('members', 'member')
      .innerJoinAndSelect('member.address', 'address')
      .where('member.first_name like :fname', {
        fname: `%${searchMemberDto.first_name}%`,
      });

    if ('last_name' in searchMemberDto) {
      createQuery.andWhere('member.last_name like :lname', {
        lname: `%${searchMemberDto.last_name}%`,
      });
    }

    if ('city' in searchMemberDto) {
      createQuery.andWhere('address.city like :city', {
        city: `%${searchMemberDto.city}%`,
      });
    }

    if ('state' in searchMemberDto) {
      createQuery.andWhere('address.state like :state', {
        state: `%${searchMemberDto.state}%`,
      });
    }

    const searchData = await createQuery.getMany();

    return searchData;
  }
}
