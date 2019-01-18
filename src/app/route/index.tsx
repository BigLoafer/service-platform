import { getToken } from 'app/services';
import { getUrlRelativePath } from 'app/utils';
import React from 'react';
import { Route, withRouter } from 'react-router-dom';
class PrivateRoute extends React.Component<any, any> {
    fromUrl: any;

    constructor(props: any) {
        super(props);
        this.state = {
            isAuthenticated: getToken('token') ? true : false
            // isAuthenticated: true
        };
        this.fromUrl = getUrlRelativePath();
    }

    componentWillMount() {
        if (!this.state.isAuthenticated) {
            const {history} = this.props;
            setTimeout(
              () => {
                history.replace('/login');
           }, 1000);
        }
    }

    renderComponent = (props: any) => {
        const {component: Component} = this.props;
        return ( <Component {...props} />);
    }

    render() {
        const { component: Component, ...rest} = this.props;
        return this.state.isAuthenticated ?
        (<Route {...rest} render={this.renderComponent}/> ) :
            (<p
                style = {{'width': '100%', 'textAlign': 'center',
                'fontSize': '20px', 'lineHeight': '50px'}}
            >
            请登录...
            </p>);
    }

}

export default withRouter(PrivateRoute);
