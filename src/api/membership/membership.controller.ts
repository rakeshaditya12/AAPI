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
import { STRIPE } from 'src/stripe/stripe-constants';
import { AvailableMemberDto } from './dto/available-member.dto';

@Controller('membership')
export class MembershipController {
  constructor(
    private readonly membershipService: MembershipService,
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
  ) {}

  @Post('availableMember')
  @UsePipes(ValidationPipe)
  availableMember(@Body() availableMemberDto: AvailableMemberDto) {
    return this.membershipService.availableMember(availableMemberDto);
  }

  @Post('quick-register')
  @UsePipes(ValidationPipe)
  quickCreateMember(@Body() createQuickMemberDto: CreateQuickMemberDto) {
    return this.membershipService.quickCreateMember(createQuickMemberDto);
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.membershipService.create(createMemberDto);
  }

  @Post('search')
  @UsePipes(ValidationPipe)
  searchMembers(@Body() searchMemberDto: SearchMemberDto) {
    return this.membershipService.searchMembers(searchMemberDto);
  }

  @Get('stripe')
  async getList() {
    try {
      const stripe = require('stripe')(STRIPE.SECRET_KEY);

      const token = await stripe.tokens.create({
        card: {
          number: '4242424242424242',
          exp_month: 3,
          exp_year: 2023,
          cvc: '314',
        },
      });
      return token;

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

      const customer = await this.stripe.customers.create({
        name: 'rakesh',
        email: 'raditya@deqode.com',
        // payment_method: paymentMethodID,
        source: token.id,
      });

      const customerID = customer.id;

      //  return customer;

      // const paymentMethodAttach = await this.stripe.paymentMethods.attach(
      //   paymentMethodID,
      //   { customer: customerID },
      // );

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: 500,
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

  @Get('stripee')
  async getStripe() {
    try {
      const stripeClient= require('stripe')(STRIPE.SECRET_KEY);

      const token = await stripeClient.tokens.create({
        card: {
          number: '4242424242424242',
          exp_month: 3,
          exp_year: 2023,
          cvc: '314',
        },
      });

      // return token;

      // const customer = await this.stripe.customers.create({
      //   name: 'rakesh',
      //   email: 'raditya@deqode.com',
      //   source: token.id,
      // });

      // const card = await this.stripe.customers.createSource(
      //   customer.id,
      //   {source: token.id}
      // );

      // const cards = await this.stripe.customers.listSources(
      //   customer.id,
      //   {object: 'card', limit: 3}
      // );

      // return cards;

      const charge = await this.stripe.charges.create({
        amount: 1500, // $15.00 this time
        currency: 'usd',
        customer: 'cus_LP3y7RH2KXRZRI', // Previously stored, then retrieved
      });

      return charge;
    } catch (error) {
      return error;
    }
  }
}
