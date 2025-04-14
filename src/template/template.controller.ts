import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { TemplateEntity } from './entities/template.entity';

@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  create(@Body() dto: CreateTemplateDto): Promise<TemplateEntity> {
    return this.templateService.create(dto);
  }

  @Get()
  findAll(): Promise<TemplateEntity[]> {
    const userId = 'system';
    return this.templateService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TemplateEntity> {
    return this.templateService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTemplateDto,
  ): Promise<TemplateEntity> {
    return this.templateService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.templateService.delete(id);
  }
}
