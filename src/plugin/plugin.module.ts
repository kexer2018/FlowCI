import { Module } from '@nestjs/common';
import { PluginService } from './plugin.service';
import { PluginController } from './plugin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginEntity } from './entities/plugin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PluginEntity])],
  controllers: [PluginController],
  providers: [PluginService],
})
export class PluginModule {}
