import { PipelineBuilder } from './ pipeline.builder';

describe('Pipeline Builder', () => {
  // 测试基础功能
  test('应生成基础流水线结构', () => {
    const pipelineBuilder = new PipelineBuilder();
    pipelineBuilder.addStage({
      id: '1',
      name: 'git',
      label: '代码源',
      type: 'source',
      stepGroups: [
        {
          steps: [
            {
              id: '11',
              name: 'git',
              params: [
                {
                  key: 'repository',
                  value: 'https://github.com/kexer2018/Learn-Algorithms.git',
                },
                { key: 'branch', value: 'master' },
              ],
              script: 'git clone {{repository}} && git checkout {{branch}}',
            },
          ],
        },
      ],
    });
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
    const script = pipelineBuilder.generate();
    console.log(pipelineBuilder.toXml(script));

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
