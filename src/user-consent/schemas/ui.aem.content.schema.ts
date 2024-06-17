import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UiAemContentDocument = UiAemContent & Document

@Schema({ collection: 'cb_aem_content' })
export class UiAemContent {
  @Prop()
  name: string

  @Prop()
  business: string

  @Prop({ type: Object })
  data: object
}

export const UiAemContentSchema = SchemaFactory.createForClass(UiAemContent)
