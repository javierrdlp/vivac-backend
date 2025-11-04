import { PartialType } from '@nestjs/mapped-types';
import { CreateVivacDto } from './create-vivac.dto';

export class UpdateVivacDto extends PartialType(CreateVivacDto) {}
