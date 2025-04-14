import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemplateEntity } from './entities/template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { BuiltInCache } from './common';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    private readonly templateRepo: Repository<TemplateEntity>,
  ) {}

  async create(dto: CreateTemplateDto): Promise<TemplateEntity> {
    const template = this.templateRepo.create(dto);
    return this.templateRepo.save(template);
  }

  async update(id: string, dto: UpdateTemplateDto): Promise<TemplateEntity> {
    const template = await this.templateRepo.findOne({ where: { id } });
    if (!template) throw new NotFoundException('Template not found');
    Object.assign(template, dto);
    return this.templateRepo.save(template);
  }

  async findOne(id: string): Promise<TemplateEntity> {
    if (BuiltInCache.templates.has(id)) return BuiltInCache.templates.get(id);
    const template = await this.templateRepo.findOne({ where: { id } });
    if (!template) throw new NotFoundException('Template not found');
    return template;
  }

  async findAll(userId: string): Promise<TemplateEntity[]> {
    const customList = await this.templateRepo.find({
      where: { createBy: userId },
    });
    const builtInList: TemplateEntity[] = BuiltInCache.templates
      .keys()
      .map((key) => BuiltInCache.templates.get(key))
      .filter(Boolean) as TemplateEntity[];

    return [...customList, ...builtInList];
  }

  async delete(id: string): Promise<void> {
    await this.templateRepo.delete(id);
  }
}
