import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ProviderDto {
  @IsString()
  provider: string;

  @IsString()
  model: string;
}

export class ExecutePromptDto {
  @IsString()
  prompt: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProviderDto)
  providers: ProviderDto[];
}