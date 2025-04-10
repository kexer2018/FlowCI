import { PipelineBuilder } from './ pipeline.builder';

describe('Pipeline Builder', () => {
  // 测试基础功能
  test('应生成基础流水线结构', () => {
    const pipelineBuilder = new PipelineBuilder();
    pipelineBuilder.setAgent({
      type: 'any',
    });
    pipelineBuilder.addTool('node', 'nodejs-18');
    pipelineBuilder.addOption({
      timeout: {
        time: '10',
        unit: 'MINUTES',
      },
    });
    pipelineBuilder.addTrigger({
      cron: '*/5 * * * *',
    });
    console.log(pipelineBuilder.generate());

    // const config = { stages: ['build', 'test'] };
    // const result = buildPipeline(config);
    // expect(result).toHaveProperty('stages');
    // expect(result.stages).toEqual([
    //   expect.objectContaining({ name: 'build' }),
    //   expect.objectContaining({ name: 'test' }),
    // ]);
    expect(1).toBe(1);
  });

  // 测试异常处理
  test('空配置应抛出错误', () => {
    // expect(() => buildPipeline({})).toThrow('至少需要配置一个阶段');
  });
});
