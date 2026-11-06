import type { CollectionConfig } from 'payload'
import { revalidateHomeAfterChange, revalidateHomeAfterDelete } from '@/hooks/revalidateHome'

export const Stores: CollectionConfig = {
  slug: 'stores',
  labels: {
    singular: '점포',
    plural: '점포',
  },
  admin: {
    group: '시장 안내',
    useAsTitle: 'name',
    defaultColumns: ['name', 'isVisible', 'market', 'menu', 'createdAt'],
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
      label: '점포명',
      type: 'text',
      required: true,
    },
    {
      name: 'menu',
      label: '대표 메뉴',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      label: '점포 사진',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'isVisible',
      label: '노출 상태',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: '켜면 사이트에 표시되고, 끄면 숨겨집니다.',
        position: 'sidebar',
      },
    },
    {
      name: 'market',
      label: '시장',
      type: 'select',
      required: true,
      options: [
        { label: '구월시장', value: '구월시장' },
        { label: '모래내시장', value: '모래내시장' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'price',
      label: '가격',
      type: 'text',
      defaultValue: '확인 중',
    },
    {
      name: 'hours',
      label: '영업시간',
      type: 'text',
      defaultValue: '확인 중',
    },
    {
      name: 'routes',
      label: '포함되는 맛길',
      type: 'relationship',
      relationTo: 'taste-routes',
      hasMany: true,
      required: true,
    },
  ],
}
