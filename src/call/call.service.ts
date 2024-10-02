import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { CallRepository } from "./call.repository";
import { CreateCallDto } from "./call.dto";
import { Call } from "./call.schema";

@Injectable()
export class CallService {
    constructor(
        private readonly callRepository: CallRepository,
        private readonly logger: Logger
    ) {}

    static isCompleted(call: Call): boolean {
        return !!(call.name && call.location && call.emotional_tone && call.text);
    }

    async getById(id: string): Promise<Call & { isCompleted: boolean }> {
        const result = await this.callRepository.getById(id);
 
        if (!result) {
            throw new NotFoundException('Unknown call id');
        }

        return {
            isCompleted: CallService.isCompleted(result),
            id: result.id,
            name: result.name,
            location: result.location,
            emotional_tone: result.emotional_tone,
            text: result.text,
        }
    }

    async create(call: CreateCallDto): Promise<{ id: string }> {
        const uuid = uuidv4();
        const result = await this.callRepository.create({
            id: uuid,
        });

        return {
            id: result.id,
            name: result.name, 
            location: result.location,
            emotional_tone: result.emotional_tone,
            text: result.text,
        }
    }
}