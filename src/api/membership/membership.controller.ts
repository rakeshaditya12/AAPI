import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { SearchMemberDto } from './dto/search-member.dto';
import { MembershipService } from './membership.service';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

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
}
