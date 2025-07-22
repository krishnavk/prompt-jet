import { IsString, IsArray, ValidateNested, IsOptional, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class ProviderDto {
  @IsString()
  provider: string;

  @IsString()
  model: string;
}

class ConfigDto {
  @IsOptional()
  @IsString()
  openaiApiKey?: string;

  @IsOptional()
  @IsString()
  lmStudioUrl?: string;
}

export class ExecutePromptDto {
  @IsString()
  prompt: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProviderDto)
  providers: ProviderDto[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ConfigDto)
  config?: ConfigDto;
}