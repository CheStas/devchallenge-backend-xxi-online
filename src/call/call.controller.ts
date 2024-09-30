import { Controller, Get, Post, Param, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { Call } from './call.schema';
import { CallService } from './call.service';
import { CreateCallDto } from './call.dto';

@Controller('call')
export class CallController {
    constructor(private readonly callService: CallService) {}

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() response: Response): Promise<Call | { id: string; message: string }> {
        const result = await this.callService.getById(id);
        if (result.isCompleted) {
            response.status(200).send({
                id: result.id,
                name: result.name,
                location: result.location,
                emotional_tone: result.emotional_tone,
                text: result.text,
            });
            return;
        } else {
            response.status(202).send({
                id: result.id,
                message: 'processing is not yet complete'
            });
            return;
        }
    }

    @Post()
    async create(@Body() call: CreateCallDto): Promise<Call> {
        return this.callService.create(call);
    }
}