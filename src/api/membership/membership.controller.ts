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
  getList() {
    return this.stripe.customers.list();
  }
}
