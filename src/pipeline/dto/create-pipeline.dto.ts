export class CreatePipelineDto {
  name: string;
  description?: string;
  templateId: string;
  config: any;
}
