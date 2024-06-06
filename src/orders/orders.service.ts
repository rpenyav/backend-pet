import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './schemas/order.schema';
import { PaginatedResponse } from 'src/interface/paginated';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  private calculateTotalAmount(
    orderItems: { quantity: number; price: number }[],
  ): number {
    return orderItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0,
    );
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const totalAmount = this.calculateTotalAmount(createOrderDto.orderItems);
    const createdOrder = new this.orderModel({
      ...createOrderDto,
      totalAmount,
    });
    return createdOrder.save();
  }

  async findAll(page: number, size: number): Promise<PaginatedResponse<Order>> {
    const totalElements = await this.orderModel.countDocuments().exec();
    const totalPages = Math.ceil(totalElements / size);
    const orders = await this.orderModel
      .find()
      .skip((page - 1) * size)
      .limit(size)
      .exec();

    return {
      data: orders,
      pageNumber: page,
      pageSize: size,
      totalElements,
      totalPages,
      isLast: page >= totalPages,
    } as unknown as PaginatedResponse<Order>;
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const totalAmount = this.calculateTotalAmount(updateOrderDto.orderItems);
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, { ...updateOrderDto, totalAmount }, { new: true })
      .exec();
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return updatedOrder;
  }

  async remove(id: string): Promise<Order> {
    const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
    if (!deletedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return deletedOrder;
  }

  async closeOrder(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const tax = order.totalAmount * 0.21;
    const tip = order.totalAmount * 0.05;
    const finalAmount = order.totalAmount + tax + tip;

    order.status = 'closed';
    order.tax = tax;
    order.tip = tip;
    order.finalAmount = finalAmount;

    return order.save();
  }
}
