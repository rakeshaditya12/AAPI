import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { STRIPE_CLIENT } from 'src/stripe/constants';
import { CreateMemberDto } from './dto/create-member.dto';
import { CreateQuickMemberDto } from './dto/create-quick-member.dto';
import { SearchMemberDto } from './dto/search-member.dto';
import { MembershipService } from './membership.service';
import Stripe from 'stripe';
import { CustomRepositoryNotFoundError } from 'typeorm';

@Controller('membership')
export class MembershipController {
  constructor(
    private readonly membershipService: MembershipService,
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
  ) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.membershipService.create(createMemberDto);
  }

  @Post('quick-register')
  @UsePipes(ValidationPipe)
  quickCreateMember(@Body() createQuickMemberDto: CreateQuickMemberDto) {
    return this.membershipService.quickCreateMember(createQuickMemberDto);
  }

  @Post('search')
  @UsePipes(ValidationPipe)
  searchMembers(@Body() searchMemberDto: SearchMemberDto) {
    return this.membershipService.searchMembers(searchMemberDto);
  }

  @Get('stripe')
  async getList() {
    try {
      const customer = await this.stripe.customers.create({
        name: 'rakesh',
        email: 'raditya@deqode.com',
      });

      const customerID = customer.id;

      const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: '4242424242424242',
          exp_month: 3,
          exp_year: 2025,
          cvc: '314',
        },
      });

      const paymentMethodID = paymentMethod.id;

      const paymentMethodAttach = await this.stripe.paymentMethods.attach(
        paymentMethodID,
        { customer: customerID },
      );

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: 1000,
        currency: 'USD',
        payment_method: paymentMethodID,
        payment_method_types: ['card'],
        customer: customerID,
        confirm: true,
      });

      return paymentIntent;
    } catch (error) {
      return error;
    }
  }
}
