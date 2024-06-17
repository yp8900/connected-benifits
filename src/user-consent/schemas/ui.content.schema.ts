import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UiContentDocument = UiContent & Document

@Schema({ collection: 'cb_ui_content' })
export class UiContent {
  @Prop()
  name: string

  @Prop()
  business: string

  @Prop({ type: Object })
  data: object
}

export const UiContentSchema = SchemaFactory.createForClass(UiContent)
