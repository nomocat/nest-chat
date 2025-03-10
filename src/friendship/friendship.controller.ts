import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendAddDto } from './dto/friend-add.dto';
import { RequireLogin, UserInfo } from 'src/custom.decorator';

@Controller('friendship')
@RequireLogin()
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) { }

  @Post('add')
  async add(@Body() friendAddDto: FriendAddDto, @UserInfo("userId") userId: number) {
    // TODO 不能向自己请求
    return this.friendshipService.add(friendAddDto, userId);
  }

  @Get('request_list')
  async list(@UserInfo("userId") userId: number) {
    if (!userId) {
      throw new HttpException(`userId: ${userId}, Invalid userId`, HttpStatus.BAD_REQUEST);  // 或返回空结果
    }

    return this.friendshipService.list(userId);
  }

  @Get('agree/:id')
  async agree(@Param('id') friendId: number, @UserInfo("userId") userId: number) {
    if (!friendId) {
      throw new BadRequestException('添加的好友 id 不能为空');
    }
    // TODO 不存在的 id 没有处理
    return this.friendshipService.agree(friendId, userId);
  }

  @Get('reject/:id')
  async reject(@Param('id') friendId: number, @UserInfo("userId") userId: number) {
    if (!friendId) {
      throw new BadRequestException('添加的好友 id 不能为空');
    }
    // TODO 不存在的 id 没有处理
    return this.friendshipService.reject(friendId, userId);
  }

  @Get('remove/:id')
  async remove(@Param('id') friendId: number, @UserInfo('userId') userId: number) {
    return this.friendshipService.remove(friendId, userId);
  }

}
