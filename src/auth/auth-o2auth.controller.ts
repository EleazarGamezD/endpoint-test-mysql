import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { o2AuthService } from './auth-o2auth.service';
import {
  ApiInternalServerErrorResponse,
  ApiNotImplementedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GoogleAuthGuard } from './guards/google-guard/google-guard';

@ApiTags('Oauth')
@Controller('oauth')
export class O2AuthController {
  constructor(private readonly o2authService: o2AuthService) {}

  @ApiNotImplementedResponse({ description: 'Not Implemented' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return this.o2authService.handleLogin();
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  handleCallback(@Req() req, @Res() res) {
    return this.o2authService.handleCallback(req, res);
  }
}
