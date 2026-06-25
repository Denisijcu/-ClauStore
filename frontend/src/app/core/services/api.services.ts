import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  Category, Product, GalleryDesign, Order,
  CreateOrderRequest, PromptRequest, PromptResponse, ZelleInfo
} from '../models/models';
import { Observable } from 'rxjs';

const API = environment.apiUrl;

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API}/categories/`);
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${API}/categories/${id}`);
  }

  create(formData: FormData): Observable<Category> {
    return this.http.post<Category>(`${API}/categories/`, formData);
  }

  update(id: number, formData: FormData): Observable<Category> {
    return this.http.put<Category>(`${API}/categories/${id}`, formData);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${API}/categories/${id}`);
  }
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getAll(filters?: { category_id?: number; featured?: boolean; search?: string }): Observable<Product[]> {
    let params = new HttpParams();
    if (filters?.category_id) params = params.set('category_id', filters.category_id);
    if (filters?.featured !== undefined) params = params.set('featured', filters.featured);
    if (filters?.search) params = params.set('search', filters.search);
    return this.http.get<Product[]>(`${API}/products/`, { params });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${API}/products/${id}`);
  }

  create(formData: FormData): Observable<Product> {
    return this.http.post<Product>(`${API}/products/`, formData);
  }

  update(id: number, formData: FormData): Observable<Product> {
    return this.http.put<Product>(`${API}/products/${id}`, formData);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${API}/products/${id}`);
  }
}

// ─── GALLERY ──────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class GalleryService {
  constructor(private http: HttpClient) {}

  getAll(categoryId?: number): Observable<GalleryDesign[]> {
    let params = new HttpParams();
    if (categoryId) params = params.set('category_id', categoryId);
    return this.http.get<GalleryDesign[]>(`${API}/gallery/`, { params });
  }

  create(formData: FormData): Observable<GalleryDesign> {
    return this.http.post<GalleryDesign>(`${API}/gallery/`, formData);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${API}/gallery/${id}`);
  }
}

// ─── ORDERS ───────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  create(data: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${API}/orders/`, data);
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${API}/orders/my-orders`);
  }

  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${API}/orders/${id}`);
  }

  uploadPayment(orderId: number, formData: FormData): Observable<any> {
    return this.http.post(`${API}/orders/${orderId}/upload-payment`, formData);
  }

  getZelleInfo(): Observable<ZelleInfo> {
    return this.http.get<ZelleInfo>(`${API}/orders/admin/zelle-info`);
  }

  // Admin
  getAllOrders(status?: string): Observable<Order[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<Order[]>(`${API}/orders/admin/all`, { params });
  }

  confirmPayment(orderId: number): Observable<any> {
    return this.http.put(`${API}/orders/admin/${orderId}/confirm-payment`, {});
  }

  updateStatus(orderId: number, status: string): Observable<any> {
    const formData = new FormData();
    formData.append('new_status', status);
    return this.http.put(`${API}/orders/admin/${orderId}/status`, formData);
  }
}

// ─── AI PROMPT ────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class AiPromptService {
  constructor(private http: HttpClient) {}

  generatePrompt(data: PromptRequest): Observable<PromptResponse> {
    return this.http.post<PromptResponse>(`${API}/ai/generate-prompt`, data);
  }
}
