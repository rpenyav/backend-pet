import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFacturaDto } from './create-factura.dto';
import { Factura } from './factura.schema';

@Injectable()
export class FacturaService {
  constructor(
    @InjectModel(Factura.name) private readonly facturaModel: Model<Factura>,
  ) {}

  async create(createFacturaDto: CreateFacturaDto): Promise<Factura> {
    const createdFactura = new this.facturaModel(createFacturaDto);
    return createdFactura.save();
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{
    data: Factura[];
    totalElements: number;
    totalPages: number;
    isLast: boolean;
  }> {
    const skip = (page - 1) * limit;
    const [results, total] = await Promise.all([
      this.facturaModel.find().skip(skip).limit(limit).exec(),
      this.facturaModel.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(total / limit);
    const isLast = page >= totalPages;

    return {
      data: results,
      totalElements: total,
      totalPages,
      isLast,
    };
  }
}
