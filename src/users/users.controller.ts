import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Requiere autenticación para crear un usuario
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      await this.usersService.create(createUserDto);
      return { message: 'Usuario creado con éxito' };
    } catch (error) {
      throw new HttpException(
        'Hubo un problema creando el usuario',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard) // Requiere autenticación para encontrar un usuario específico
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard) // Requiere autenticación para actualizar un usuario
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      await this.usersService.update(id, updateUserDto);
      return { message: 'Usuario actualizado con éxito' };
    } catch (error) {
      throw new HttpException(
        'El usuario no ha podido ser actualizado',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Requiere autenticación para eliminar un usuario
  async remove(@Param('id') id: string) {
    try {
      await this.usersService.remove(id);
      return { message: 'Usuario eliminado con éxito' };
    } catch (error) {
      throw new HttpException(
        'Hubo un error, el usuario no se ha eliminado',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
