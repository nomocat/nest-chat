import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {

  @Inject(PrismaService)
  private prismaService: PrismaService;

  @Inject(RedisService)
  private redisService: RedisService;

  private logger = new Logger();

  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`);

    // if (!captcha) {
    //   throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    // }

    // if (user.captcha !== captcha) {
    //   throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    // }

    const foundUser = await this.prismaService.user.findUnique({
      where: {
        username: user.username
      }
    });

    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.prismaService.user.create({
        data: {
          username: user.username,
          password: user.password,
          nickName: user.nickName,
          email: user.email
        },
        select: {
          id: true,
          username: true,
          nickName: true,
          email: true,
          headPic: true,
          createTime: true
        }
      });
    } catch (e) {
      this.logger.error(`Error during user registration: ${e.message}`, e.stack);
      throw new HttpException('注册失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const foundUser = await this.prismaService.user.findUnique({
      where: {
        username: loginUserDto.username
      }
    });

    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (foundUser.password !== loginUserDto.password) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    foundUser.password = "";
    return foundUser;
  }
  
  async findUserDetailById(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        username: true,
        nickName: true,
        email: true,
        headPic: true,
        createTime: true
      }
    });
    return user;
  }
}