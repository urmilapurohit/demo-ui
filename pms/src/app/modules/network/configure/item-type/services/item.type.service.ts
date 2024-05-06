import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';
import { IItemType, IItemTypeSearchParams } from '../models/item.type';

@Injectable({
  providedIn: 'root'
})
export class ItemTypeService {
  constructor(
    private httpService: HttpService,
  ) { }

  getItemType = (requestObject: IItemTypeSearchParams) => {
    return this.httpService.post(API_ROUTES.NETWORK.CONFIGURATION.ITEM_TYPE.GET_ITEM_TYPE, requestObject);
  };

  getItemTypeById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.NETWORK.CONFIGURATION.ITEM_TYPE.ITEM_TYPE_PREFIX}${id}`);
  };

  addItemType = (requestObject: IItemType) => {
    return this.httpService.post(API_ROUTES.NETWORK.CONFIGURATION.ITEM_TYPE.ADD_ITEM_TYPE, requestObject, true);
  };

  updateItemType = (id: number, requestObject: IItemType) => {
    return this.httpService.put(`${API_ROUTES.NETWORK.CONFIGURATION.ITEM_TYPE.ITEM_TYPE_PREFIX}${id}`, requestObject, true);
  };

  deleteItemType = (id: number) => {
    return this.httpService.delete(`${API_ROUTES.NETWORK.CONFIGURATION.ITEM_TYPE.ITEM_TYPE_PREFIX}${id}`, true);
  };

  updateStatus = (id: number, status: boolean) => {
    return this.httpService.put(`${API_ROUTES.NETWORK.CONFIGURATION.ITEM_TYPE.ITEM_TYPE_PREFIX}${id}/${status}`, {}, true);
  };
}
