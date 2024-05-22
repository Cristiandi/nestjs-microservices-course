import { CreateWorkflowDto, UpdateWorkflowDto } from '@app/workflows';
import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Inbox } from '../inbox/entities/inbox.entity';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';

@Controller('workflows')
export class WorkflowsController {
  constructor(
    private readonly workflowsService: WorkflowsService,
    @InjectRepository(Inbox)
    private readonly inboxRepository: Repository<Inbox>,
  ) {}

  @EventPattern('workflows.create')
  async create(
    @Payload() createWorkflowDto: CreateWorkflowDto,
    @Ctx() context: RmqContext, // 👈
  ) {
    console.log('getPattern:', context.getPattern());
    const message = context.getMessage();

    // get the md5 hash of the message content
    // had to do this because the message.properties.messageId was always undefined
    const messageId = createHash('md5')
      .update(message.content.toString())
      .digest('hex');

    const inboxMessage = await this.inboxRepository.findOne({
      where: {
        messageId: messageId,
      },
    });
    if (!inboxMessage) {
      await this.inboxRepository.save({
        messageId,
        pattern: context.getPattern(),
        status: 'pending',
        payload: createWorkflowDto,
      });
    }

    const channel = context.getChannelRef();
    channel.ack(message);
  }

  @Get()
  findAll() {
    return this.workflowsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workflowsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkflowDto: UpdateWorkflowDto,
  ) {
    return this.workflowsService.update(+id, updateWorkflowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workflowsService.remove(+id);
  }
}
