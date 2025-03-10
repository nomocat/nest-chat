import { FriendAddDto } from './dto/friend-add.dto';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendshipService {

    @Inject(PrismaService)
    private prismaService: PrismaService;

    async add(friendAddDto: FriendAddDto, userId: number) {
        return await this.prismaService.friendRequest.create({
            data: {
                fromUserId: userId,
                toUserId: friendAddDto.friendId,
                reason: friendAddDto.reason,
                status: 0
            }
        })
    }

    async list(userId: number) {
        return this.prismaService.friendRequest.findMany({
            where: {
                fromUserId: userId
            }
        })
    }

    async agree(friendId: number, userId: number) {
        await this.prismaService.friendRequest.updateMany({
            where: {
                fromUserId: friendId,
                toUserId: userId,
                status: 0
            },
            data: {
                status: 1
            }
        })

        const res = await this.prismaService.friendship.findMany({
            where: {
                userId,
                friendId
            }
        })

        if (!res.length) {
            await this.prismaService.friendship.create({
                data: {
                    userId,
                    friendId
                }
            })
        }
        return '添加成功'
    }

    async reject(friendId: number, userId: number) {
        await this.prismaService.friendRequest.updateMany({
            where: {
                fromUserId: friendId,
                toUserId: userId,
                status: 0
            },
            data: {
                status: 2
            }
        })
        return '已拒绝'
    }

    async remove(friendId: number, userId: number) {
        await this.prismaService.friendship.deleteMany({
            where: {
                userId,
                friendId,
            }
        })
        return '删除成功';
    }
}
