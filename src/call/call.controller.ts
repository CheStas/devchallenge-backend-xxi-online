import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CallRepository } from './call.repository';
import { Call } from './call.schema';

@Controller('call')
export class CallController {
    constructor(private readonly callRepository: CallRepository) {}

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Call> {
        return this.callRepository.getById(id);
    }

    @Post()
    async create(@Body() call: Call): Promise<Call> {
        return this.callRepository.create(call);
    }
}