import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePluginDto } from './dto/create-plugin.dto';
import { UpdatePluginDto } from './dto/update-plugin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PluginEntity } from './entities/plugin.entity';
import { Repository } from 'typeorm';
import { BuiltInCache } from 'src/template/common';

@Injectable()
export class PluginService {
  constructor(
    @InjectRepository(PluginEntity)
    private readonly pluginRepo: Repository<PluginEntity>,
  ) {}

  async create(createPluginDto: CreatePluginDto) {
    const plugin = this.pluginRepo.create(createPluginDto);
    return this.pluginRepo.save(plugin);
  }

  async findAll(userId: string) {
    const customList = await this.pluginRepo.find({
      where: { createBy: userId },
    });

    const builtInList: PluginEntity[] = BuiltInCache.plugins
      .keys()
      .map((key) => BuiltInCache.templates.get(key))
      .filter(Boolean) as PluginEntity[];

    return [...customList, ...builtInList];
  }

  async findOne(id: string) {
    if (BuiltInCache.plugins.has(id)) return BuiltInCache.plugins.get(id);
    const plugin = await this.pluginRepo.findOne({ where: { id } });
    if (!plugin) throw new NotFoundException('Plugin not found');
    return plugin;
  }

  async update(id: string, updatePluginDto: UpdatePluginDto) {
    const plugin = await this.pluginRepo.findOne({ where: { id } });
    if (!plugin) throw new NotFoundException('Plugin not found');
    Object.assign(plugin, updatePluginDto);
    return this.pluginRepo.save(plugin);
  }

  async remove(id: string) {
    await this.pluginRepo.delete(id);
  }
}
