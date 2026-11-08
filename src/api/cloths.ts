import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api } from './client'

export type Cloth = {
  id: number
  name: string
  brand: string | null
  description: string | null
  touch_feel: string | null
  colour: string
  colour_hex: string
  pattern: string
  best_for: string[]
  images: string[]
  clothing_category: 'shirt' | 'pant'
  unit_price: string // rupees per metre, sent as text such as "320.00"
  stock_quantity: string
  in_stock: boolean
}

export type ClothPage = {
  items: Cloth[]
  total_cloths: number
  page_no: number
  page_size: number
  total_pages: number
}

export type ClothFilters = {
  category?: 'shirt' | 'pant'
  colour?: string
  pattern?: string
  best_for?: string
  min_price?: number
  max_price?: number
  in_stock?: boolean
  search_text?: string
  page?: number
}

export const clothKeys = {
  list: (filters: ClothFilters) => ['cloths', 'list', filters] as const,
  detail: (id: number) => ['cloths', 'detail', id] as const,
}

export function useCloths(filters: ClothFilters) {
  return useQuery({
    queryKey: clothKeys.list(filters),
    queryFn: ({ signal }) => api.get<ClothPage>('/cloths', { params: filters, signal }),
    placeholderData: keepPreviousData, // keep showing the old page while the next one loads
  })
}

export function useCloth(id: number) {
  return useQuery({
    queryKey: clothKeys.detail(id),
    queryFn: ({ signal }) => api.get<Cloth>(`/cloths/${id}`, { signal }),
  })
}
