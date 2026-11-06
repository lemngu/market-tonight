import type { CollectionConfig } from 'payload'
import { revalidateHomeAfterChange, revalidateHomeAfterDelete } from '@/hooks/revalidateHome'

export const TasteRoutes: CollectionConfig = {
  slug: 'taste-routes',
  labels: {
    singular: '맛길',
    plural: '맛길',
  },
  admin: {
    group: '시장 안내',
    useAsTitle: 'name',
    defaultColumns: ['name', 'order', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateHomeAfterChange],
    afterDelete: [revalidateHomeAfterDelete],
  },
  fields: [
    {
      name: 'name',
      label: '맛길 이름',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: '소개',
      type: 'textarea',
      required: true,
    },
    {
      name: 'order',
      label: '노출 순서',
      type: 'number',
      required: true,
      min: 1,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
