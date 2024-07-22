import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/repositories/user-repository';
import { CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class o2AuthService {
  // creamos variable privada logger  para manejar los errores en la consola de NEST
  private readonly logger = new Logger('O2AuthService');
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async findUser(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }
  async validateUser(createUserDto: CreateUserDto) {
    //Primero verificamos si el usuario existe de lo contrario se creara el usuario
    try {
      const { email, userName, ...userData } = createUserDto;
      const user = await this.userRepository.findUser(email);
      // si el usuario no existe lo creamos
      if (!user) {
        console.log('User not found. Creating...');
        const newUser = this.userRepository.create({
          email,
          userName,
          ...userData,
        });
        const user = await this.userRepository.save(newUser);
        return user;
      }
      // si el usuario existe lo retornamos
      return user;
    } catch (error) {
      this.handleException(error);
    }
  }

  async handleLogin() {
    return { msg: 'Google Authentication' };
  }

  async handleCallback(req, res) {
    try {
      const user = req.user;
      const authenticatedUser = {
        userid: user.id,
        email: user.email,
        username: user.userName,
        token: await this.getJwtToken({ id: user.id }),
      };
      res.status(200).json(authenticatedUser);
    } catch (error) {
      this.handleException(error);
    }
  }

  //método privado para obtener y manejar el token
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  // creación de método privado de manejo de errores
  private handleException(error: any): never {
    if (error.code === '23505') {
      // console.log (error)
      throw new BadGatewayException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, Check Server Logs',
      error,
    );
  }
}
