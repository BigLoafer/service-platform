import Loadable from 'react-loadable';
import LoadingComponent from '../ui/PageLoadingComponent';

export function asyncLoad (importComponent: any) {
    return Loadable({
        loader: importComponent,
        loading: LoadingComponent,
        delay: 300
    });
}
