export interface Product {
  id: number;
  code: string;
  name: string;
  value: number;
}

export interface RawMaterial {
  id: number;
  code: string;
  name: string;
  stockQuantity: number;
}

export interface ProductRawMaterial {
  id: number;
  productId: number;
  rawMaterialId: number;
  requiredQuantity: number;
  rawMaterialName?: string;
}

export interface ProductProductionDTO {
  productId: number;
  productCode: string;
  productName: string;
  productValue: number;
  producibleQuantity: number;
  totalValue: number;
}

export interface ProductionSuggestion {
  products: ProductProductionDTO[];
  totalValue: number;
}

export interface ProductFormData {
  code: string;
  name: string;
  value: string;
}

export interface RawMaterialFormData {
  code: string;
  name: string;
  stockQuantity: string;
}

export interface AssociationFormData {
  rawMaterialId: string;
  requiredQuantity: string;
}

export interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

export interface RawMaterialsState {
  items: RawMaterial[];
  loading: boolean;
  error: string | null;
}

export interface ProductRawMaterialsState {
  items: ProductRawMaterial[];
  loading: boolean;
  error: string | null;
}

export interface ProductionState {
  suggestions: ProductionSuggestion | null;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  products: ProductsState;
  rawMaterials: RawMaterialsState;
  productRawMaterials: ProductRawMaterialsState;
  production: ProductionState;
}



