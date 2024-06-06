import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ required: true })
  tableId: string;

  @Prop({ required: true })
  sector: string;

  @Prop({
    required: true,
    type: [{ _id: String, namePlato: String, quantity: Number, price: Number }],
  })
  orderItems: {
    _id: string;
    namePlato: string;
    quantity: number;
    price: number;
  }[];

  @Prop({ required: true })
  status: string;

  @Prop({ default: 0 })
  totalAmount: number;

  @Prop({ default: 0 })
  tax: number;

  @Prop({ default: 0 })
  tip: number;

  @Prop({ default: 0 })
  finalAmount: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
