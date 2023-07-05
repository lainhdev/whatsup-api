import { UserService } from './../user/user.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendStatus } from './friend-status.enum';

@Injectable()
export class FriendService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}
  async create(senderId: string, email: string) {
    const receiver = await this.userService.findOneByEmail(email);
    if (!receiver) {
      throw new NotFoundException('Cannot find receiver');
    }

    return this.prisma.friend.create({
      data: {
        senderId,
        receiverId: receiver.id,
      },
      include: {
        receiver: true,
        sender: true,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.friend.findMany({
      where: {
        OR: [
          {
            receiverId: userId,
          },
          {
            senderId: userId,
          },
        ],
      },
      include: {
        receiver: true,
        sender: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.friend.findUnique({
      where: { id },
      include: {
        receiver: true,
        sender: true,
      },
    });
  }

  async update(id: string, userId: string) {
    const friend = await this.findOne(id);
    if (!friend) {
      throw new NotFoundException('Friend not found');
    }
    if (userId !== friend.receiverId && userId !== friend.senderId) {
      throw new ForbiddenException('Friend cannot be updated');
    }
    return this.prisma.friend.update({
      where: { id },
      data: {
        status: FriendStatus.ACCEPTED,
      },
      include: {
        receiver: true,
        sender: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    const friend = await this.findOne(id);
    if (!friend) {
      throw new NotFoundException('Friend not found');
    }
    if (userId !== friend.receiverId && userId !== friend.senderId) {
      throw new ForbiddenException('Friend cannot be removed');
    }
    return this.prisma.friend.delete({ where: { id } });
  }
}
