import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PluginService } from './plugin.service';
import { CreatePluginDto } from './dto/create-plugin.dto';
import { UpdatePluginDto } from './dto/update-plugin.dto';

@Controller('plugin')
export class PluginController {
  constructor(private readonly pluginService: PluginService) {}

  @Post()
  create(@Body() createPluginDto: CreatePluginDto) {
    return this.pluginService.create(createPluginDto);
  }

  @Get()
  findAll() {
    const userId = 'system';
    return this.pluginService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pluginService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePluginDto: UpdatePluginDto) {
    return this.pluginService.update(id, updatePluginDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pluginService.remove(id);
  }
}
