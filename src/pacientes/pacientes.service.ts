import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Paciente, PacienteDocument } from './paciente.schema';

@Injectable()
export class PacientesService {
  constructor(
    @InjectModel(Paciente.name) private pacienteModel: Model<PacienteDocument>,
  ) {}

  async create(createPacienteDto: any): Promise<Paciente> {
    const createdPaciente = new this.pacienteModel(createPacienteDto);
    return createdPaciente.save();
  }

  async findAll(): Promise<Paciente[]> {
    return this.pacienteModel.find().exec();
  }

  async findOne(id: string): Promise<Paciente> {
    const paciente = await this.pacienteModel.findById(id).exec();
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
    return paciente;
  }

  async update(id: string, updatePacienteDto: any): Promise<Paciente> {
    const updatedPaciente = await this.pacienteModel
      .findByIdAndUpdate(id, updatePacienteDto, { new: true })
      .exec();
    if (!updatedPaciente) {
      throw new NotFoundException('El paciente no ha podido ser actualizado');
    }
    return updatedPaciente;
  }

  async remove(id: string): Promise<void> {
    const result = await this.pacienteModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('El paciente no ha podido ser eliminado');
    }
  }
}
