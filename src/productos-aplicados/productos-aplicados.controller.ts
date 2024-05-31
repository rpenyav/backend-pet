// src/productos-aplicados/productos-aplicados.controller.ts
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
import { ProductosAplicadosService } from './productos-aplicados.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('productos-aplicados')
@UseGuards(JwtAuthGuard)
export class ProductosAplicadosController {
  constructor(
    private readonly productosAplicadosService: ProductosAplicadosService,
  ) {}

  @Post()
  create(@Body() createProductoAplicadoDto: any) {
    return this.productosAplicadosService.create(createProductoAplicadoDto);
  }

  @Get()
  findAll() {
    return this.productosAplicadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosAplicadosService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductoAplicadoDto: any) {
    return this.productosAplicadosService.update(id, updateProductoAplicadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosAplicadosService.remove(id);
  }
}
