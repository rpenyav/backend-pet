// src/tratamientos/tratamientos.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TratamientosService } from './tratamientos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tratamientos')
@UseGuards(JwtAuthGuard)
export class TratamientosController {
  constructor(private readonly tratamientosService: TratamientosService) {}

  @Post()
  create(@Body() createTratamientoDto: any) {
    return this.tratamientosService.create(createTratamientoDto);
  }

  @Get()
  findAll() {
    return this.tratamientosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tratamientosService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTratamientoDto: any) {
    return this.tratamientosService.update(id, updateTratamientoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tratamientosService.remove(id);
  }
}
