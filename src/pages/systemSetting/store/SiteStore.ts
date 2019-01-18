import { message } from 'antd';
import { action, observable } from 'mobx';
import {
  editStation ,
  getRegionData ,
  getSiteDetail
} from '../apis';

class SiteStore {
    @observable addressData = '';
    @observable siteData: any = {};

    formatAddressData = (data: any) => {
        return data.map((item: any) => {
          const { name } = item;
          const { id } = item;
          let { children } = item;
          if (children && children.length > 0) {
            children = this.formatAddressData(children);
          }
          return {
            label: name,
            value: name,
            zid: id,
            // tslint:disable-next-line:object-shorthand-properties-first
            children
          };
        });
      }

    @action
    changePcaAddress = (opt: any[], selecdOptions: any[]) => {
      this.siteData.p_name = opt[0];
      this.siteData.c_name = opt[1];
      this.siteData.a_name = opt[2];
      this.siteData.p_id = selecdOptions[0].zid;
      this.siteData.c_id = selecdOptions[1].zid;
      this.siteData.a_id = selecdOptions[2].zid;
    }

    @action
    getAddress = async(options: any) => {
        try {
            const json: any = await getRegionData(options);
            this.addressData = this.formatAddressData(json.data);
        } catch (error) {
            message.error(error.msg);
        }
    }

    @action
    getSiteDetail = async(options: any) => {
        try {
            const json: any = await getSiteDetail(options);
            this.siteData = json.data;
        } catch (error) {
            message.error(error.msg);
        }
    }

    @action
    submitStationInfo = async() => {
        try {
            const json: any = await editStation(this.siteData);
            message.success('操作成功');
            this.getSiteDetail({});
        } catch (error) {
            message.error(error.msg);
        }
    }
}

export default new SiteStore();
