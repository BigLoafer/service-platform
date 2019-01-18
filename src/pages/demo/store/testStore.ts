
import { action , observable } from 'mobx';
import { getData } from '../apis';

class DemoStore {
    @observable name = '111';

    @action
    getData = (options: any) => {
        try {
            const json = getData(options);
        } catch (error) {
            //
        }
    }
}

export default new DemoStore();
