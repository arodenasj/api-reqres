export interface Resources {
  id: string | number;
  name: string;
  year: number;
  color: string;
  pantone_value?: string;
}

export interface ResourceResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: Resources[];
}
