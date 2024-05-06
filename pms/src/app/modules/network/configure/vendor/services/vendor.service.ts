import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';
import { IVendorSearchParams, IVendor } from '../models/vendor';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  constructor(
    private httpService: HttpService
  ) { }

  getVendors = (requestObject: IVendorSearchParams) => {
    return this.httpService.post(API_ROUTES.NETWORK.CONFIGURATION.VENDOR.GET_VENDOR, requestObject);
  };

  addVendor = (requestObject: IVendor) => {
    return this.httpService.post(API_ROUTES.NETWORK.CONFIGURATION.VENDOR.ADD_VENDOR, requestObject, true);
  };

  getVendorById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.NETWORK.CONFIGURATION.VENDOR.GET_VENDOR_BY_ID}${id}`);
  };

  updateVendor = (id: number, requestObject: IVendor) => {
    return this.httpService.put(`${API_ROUTES.NETWORK.CONFIGURATION.VENDOR.GET_VENDOR_BY_ID}${id}`, requestObject, true);
  };

  updateStatus = (id: number, status: boolean) => {
    return this.httpService.put(`${API_ROUTES.NETWORK.CONFIGURATION.VENDOR.GET_VENDOR_BY_ID}${id}/${status}`, {}, true);
  };
}
