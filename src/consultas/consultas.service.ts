// src/consultas/consultas.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Consulta, ConsultaDocument } from './consulta.schema';
import { CreateConsultaDto } from './create-consulta.dto';
import { UpdateConsultaDto } from './update-consulta.dto';

@Injectable()
export class ConsultasService {
  constructor(
    @InjectModel(Consulta.name) private consultaModel: Model<ConsultaDocument>,
  ) {}

  async create(createConsultaDto: CreateConsultaDto): Promise<Consulta> {
    const createdConsulta = new this.consultaModel(createConsultaDto);
    return createdConsulta.save();
  }

  async findAll(): Promise<Consulta[]> {
    return this.consultaModel.find().exec();
  }

  async findOne(id: string): Promise<Consulta> {
    const consulta = await this.consultaModel.findById(id).exec();
    if (!consulta) {
      throw new NotFoundException(`Consulta con ID ${id} no encontrada`);
    }
    return consulta;
  }

  async update(
    id: string,
    updateConsultaDto: UpdateConsultaDto,
  ): Promise<Consulta> {
    const updatedConsulta = await this.consultaModel
      .findByIdAndUpdate(id, updateConsultaDto, { new: true })
      .exec();
    if (!updatedConsulta) {
      throw new NotFoundException('La consulta no ha podido ser actualizada');
    }
    return updatedConsulta;
  }

  async remove(id: string): Promise<void> {
    const result = await this.consultaModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('La consulta no ha podido ser eliminada');
    }
  }
}
