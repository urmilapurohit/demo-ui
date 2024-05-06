import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';
import { IItemModel, IItemModelSearchParams } from '../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemModelService {
  constructor(
    private httpService: HttpService,
  ) { }

  getItemModel = (requestObject: IItemModelSearchParams) => {
    return this.httpService.post(API_ROUTES.NETWORK.CONFIGURATION.ITEM_MODEL.GET_ITEM_MODEL, requestObject);
  };

  getItemModelById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.NETWORK.CONFIGURATION.ITEM_MODEL.ITEM_MODEL_PREFIX}${id}`);
  };

  addItemModel = (requestObject: IItemModel) => {
    return this.httpService.post(API_ROUTES.NETWORK.CONFIGURATION.ITEM_MODEL.ADD_ITEM_MODEL, requestObject, true);
  };

  updateItemModel = (id: number, requestObject: IItemModel) => {
    return this.httpService.put(`${API_ROUTES.NETWORK.CONFIGURATION.ITEM_MODEL.ITEM_MODEL_PREFIX}${id}`, requestObject, true);
  };

  deleteItemModel = (id: number) => {
    return this.httpService.delete(`${API_ROUTES.NETWORK.CONFIGURATION.ITEM_MODEL.ITEM_MODEL_PREFIX}${id}`, true);
  };

  updateStatus = (id: number, status: boolean) => {
    return this.httpService.put(`${API_ROUTES.NETWORK.CONFIGURATION.ITEM_MODEL.ITEM_MODEL_PREFIX}${id}/${status}`, {}, true);
  };

  getItemTypeDropDown = () => {
    return this.httpService.get(`${API_ROUTES.NETWORK.CONFIGURATION.ITEM_MODEL.GET_ITEM_TYPE}`);
  };
}
