import { Injectable } from '@angular/core';
import { StorageService } from '../supabase/storageservice';

@Injectable({ providedIn: 'root' })
export class ArAssetService {
  assets: any[] = [];

  constructor(private storageService: StorageService) {}

  async loadUserAssets() {
    this.assets = await this.storageService.getUserAssets();
    return this.assets;
  }

  addAsset(asset: any) {
    this.assets.push(asset);
  }

  getAllAssets() {
    return this.assets;
  }
}
