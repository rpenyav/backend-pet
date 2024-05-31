import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cliente, ClienteDocument } from './cliente.schema';

@Injectable()
export class ClientesService {
  constructor(
    @InjectModel(Cliente.name) private clienteModel: Model<ClienteDocument>,
  ) {}

  async create(createClienteDto: any): Promise<Cliente> {
    const createdCliente = new this.clienteModel(createClienteDto);
    return createdCliente.save();
  }

  async findAll(): Promise<Cliente[]> {
    return this.clienteModel.find().exec();
  }

  async findOne(id: string): Promise<Cliente> {
    const cliente = await this.clienteModel.findById(id).exec();
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return cliente;
  }

  async update(id: string, updateClienteDto: any): Promise<Cliente> {
    const updatedCliente = await this.clienteModel
      .findByIdAndUpdate(id, updateClienteDto, { new: true })
      .exec();
    if (!updatedCliente) {
      throw new NotFoundException('El cliente no ha podido ser actualizado');
    }
    return updatedCliente;
  }

  async remove(id: string): Promise<void> {
    const result = await this.clienteModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('El cliente no ha podido ser eliminado');
    }
  }
}
