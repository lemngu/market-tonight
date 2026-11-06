import type { GlobalConfig } from 'payload'
import { revalidateHomeGlobalAfterChange } from '@/hooks/revalidateHome'

export const SiteContent: GlobalConfig = {
  slug: 'site-content',
  label: '홈페이지 콘텐츠',
  admin: {
    group: '시장 안내',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateHomeGlobalAfterChange],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '상단·히어로',
          fields: [
            { name: 'brand', label: '사이트 이름', type: 'text', required: true },
            { name: 'navRoutesLabel', label: '맛길 메뉴명', type: 'text', required: true },
            { name: 'navEventLabel', label: '행사 메뉴명', type: 'text', required: true },
            {
              name: 'hero',
              label: '히어로',
              type: 'group',
              fields: [
                { name: 'eyebrow', label: '상단 라벨', type: 'text', required: true },
                { name: 'titleLine1', label: '제목 첫 줄', type: 'text', required: true },
                { name: 'titleLine2', label: '제목 둘째 줄', type: 'text', required: true },
                { name: 'description', label: '설명', type: 'textarea', required: true },
                { name: 'ctaLabel', label: '버튼 문구', type: 'text', required: true },
                {
                  name: 'image',
                  label: '대표 이미지',
                  type: 'upload',
                  relationTo: 'media',
                },
                { name: 'caption', label: '이미지 설명', type: 'text', required: true },
                { name: 'footLeft', label: '하단 왼쪽 문구', type: 'text', required: true },
                { name: 'footRight', label: '하단 오른쪽 문구', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: '맛길',
          fields: [
            {
              name: 'routesSection',
              label: '맛길 영역',
              type: 'group',
              fields: [
                { name: 'title', label: '제목', type: 'text', required: true },
                { name: 'description', label: '설명', type: 'textarea', required: true },
                { name: 'searchPlaceholder', label: '검색창 문구', type: 'text', required: true },
                { name: 'allMarketsLabel', label: '전체 시장 문구', type: 'text', required: true },
                { name: 'countLabel', label: '점포 수 문구', type: 'text', required: true },
                { name: 'advisory', label: '확인 안내', type: 'text', required: true },
                {
                  name: 'emptyMessage',
                  label: '검색 결과 없음 문구',
                  type: 'text',
                  required: true,
                },
                { name: 'detailLabel', label: '상세 버튼 문구', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: '행사',
          fields: [
            {
              name: 'festival',
              label: '행사 영역',
              type: 'group',
              fields: [
                { name: 'heading', label: '제목', type: 'text', required: true },
                { name: 'name', label: '행사명', type: 'text', required: true },
                { name: 'highlights', label: '프로그램', type: 'text', required: true },
                { name: 'date', label: '날짜', type: 'text', required: true },
                { name: 'schedule', label: '시간', type: 'text', required: true },
                { name: 'location', label: '장소', type: 'text', required: true },
                { name: 'programHours', label: '추가 운영시간', type: 'text', required: true },
                { name: 'note', label: '안내', type: 'text', required: true },
                { name: 'linkLabel', label: '포스터 링크 문구', type: 'text', required: true },
                {
                  name: 'poster',
                  label: '행사 포스터',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
            { name: 'notice', label: '하단 유의사항', type: 'text', required: true },
          ],
        },
        {
          label: '푸터',
          fields: [
            {
              name: 'footer',
              label: '푸터',
              type: 'group',
              fields: [
                { name: 'headingLine1', label: '제목 첫 줄', type: 'text', required: true },
                { name: 'headingLine2', label: '제목 둘째 줄', type: 'text', required: true },
                { name: 'tagline', label: '태그라인', type: 'text', required: true },
                { name: 'organization', label: '운영 주체', type: 'text', required: true },
                { name: 'analyticsNote', label: '분석 안내', type: 'text', required: true },
                { name: 'adminLabel', label: '관리자 링크 문구', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
