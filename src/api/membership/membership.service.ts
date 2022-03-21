import { BadRequestException, Injectable } from '@nestjs/common';
import { MembersAddress } from 'src/database/entities/members-address.entity';
import { MembersEducation } from 'src/database/entities/members-education.entity';
import { MembersPayment } from 'src/database/entities/members-payment.entity';
import { MembersPhone } from 'src/database/entities/members-phone.entity';
import { Members } from 'src/database/entities/members.entity';
import { MembersRepository } from 'src/database/repositories/member.repository';
import { hashPassword } from 'src/utils/password';
import { createQueryBuilder, getManager, getRepository } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { SearchMemberDto } from './dto/search-member.dto';

@Injectable()
export class MembershipService {
  constructor(private readonly membersRepository: MembersRepository) {}

  async create(createMemberDto: CreateMemberDto) {
    const alreadyExistMember = await this.membersRepository.findByEmail(
      createMemberDto.username,
    );

    if (alreadyExistMember) {
      throw new BadRequestException(
        `member with email id ${createMemberDto.username} already exist`,
      );
    }
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
    member.address_details = JSON.stringify(createMemberDto.address_details);
    member.phone_details = JSON.stringify(createMemberDto.phone_details);
    member.education_details = JSON.stringify(
      createMemberDto.education_details,
    );
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
    member.amount = createMemberDto.amount;
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
        membersPhone.member_id = member.id;
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
        membersEducation.member_id = member.id;
        await membersEducation.save();

        if (createMemberDto.payment) {
          const membersPayment = new MembersPayment();
          membersPayment.card_holder_name =
            createMemberDto.payment_details[0].card_holder_name;
          membersPayment.card_type =
            createMemberDto.payment_details[0].card_type;
          membersPayment.card_number =
            createMemberDto.payment_details[0].card_number;
          membersPayment.card_expiration_date =
            createMemberDto.payment_details[0].card_expiration_date;
          membersPayment.card_cvv_number =
            createMemberDto.payment_details[0].card_cvv_number;
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
          membersPayment.member_id = member.id;
          await membersPayment.save();
        }
      });
    }
  }

  async searchMembers(searchMemberDto: SearchMemberDto) {
    console.log(searchMemberDto);

    const query = createQueryBuilder('members', 'member')
      .innerJoinAndSelect('member.address', 'address')
      .where({ first_name: 'rakesh', last_name: 'hirve' });

    return this.membersRepository
      .createQueryBuilder('members')
      .innerJoinAndSelect(
        'members.address',
        'address',
        'address.city = :city',
        {
          city: 'cityy',
        },
      )
      .getMany();
    return await query.getMany();
  }
}
