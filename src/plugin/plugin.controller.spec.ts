import { Test, TestingModule } from '@nestjs/testing';
import { PluginController } from './plugin.controller';
import { PluginService } from './plugin.service';

describe('PluginController', () => {
  let controller: PluginController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PluginController],
      providers: [PluginService],
    }).compile();

    controller = module.get<PluginController>(PluginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
